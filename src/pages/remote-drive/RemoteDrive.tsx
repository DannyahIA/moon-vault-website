import React, { useState, useEffect } from 'react';
import { FaDownload, FaTrash, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import './RemoteDrive.css';
import { Folder } from './types';
import { fetchFolders, fetchFiles, searchFiles, createFolder, deleteFile, uploadFile, renameFile, downloadFile } from './api';
import { getFileIcon } from './utils';

const RemoteDrive: React.FC = () => {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [files, setFiles] = useState<Folder[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<string | ArrayBuffer | null>(null);
    const [modalFilePath, setModalFilePath] = useState('');
    const [previousFolder, setPreviousFolder] = useState<Folder | null>(null);

    useEffect(() => {
        fetchFolders().then((data) => setFolders(data));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectedFiles.size > 0) {
                const target = event.target as HTMLElement;
                if (!target.closest('.file-table')) {
                    setSelectedFiles(new Set());
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedFiles]);

    const handleFolderClick = async (folder: Folder) => {
        setSelectedFolder(folder);
        setPreviousFolder(selectedFolder);
        const files = await fetchFiles(folder.path);
        setFiles(files);
    };

    const handleItemClick = (file: Folder, event: React.MouseEvent) => {
        event.preventDefault();
        const isCtrl = event.ctrlKey;
        const isShift = event.shiftKey;
        const filePath = file.path;

        if (isCtrl) {
            setSelectedFiles((prev) => {
                const newSelection = new Set(prev);
                if (newSelection.has(filePath)) {
                    newSelection.delete(filePath);
                } else {
                    newSelection.add(filePath);
                }
                return newSelection;
            });
        } else if (isShift && selectedFiles.size > 0) {
            const paths = files.map((f) => f.path);
            const lastSelected = Array.from(selectedFiles)[selectedFiles.size - 1];
            const startIndex = paths.indexOf(lastSelected);
            const endIndex = paths.indexOf(filePath);
            const newSelection = new Set(selectedFiles);

            for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                newSelection.add(paths[i]);
            }
            setSelectedFiles(newSelection);
        } else {
            setSelectedFiles(new Set([filePath]));
        }
    };

    const handleItemDoubleClick = async (item: Folder) => {
        if (item.is_folder) {
            handleFolderClick(item);
        } else {
            const blob = await downloadFile(item.path, '', '', '');
            const reader = new FileReader();
            reader.onloadend = () => {
                setModalContent(reader.result);
                setModalFilePath(item.path);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(blob);
        }
    };

    const handleRename = (newName: string) => {
        if (selectedFiles.size > 0) {
            selectedFiles.forEach((filePath) => {
                renameFile(filePath, newName, false);
            });
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            const searchResults = await searchFiles(searchQuery);
            setFiles(searchResults);
            setSelectedFolder(null);
        } else {
            if (selectedFolder) {
                handleFolderClick(selectedFolder);
            } else {
                setFiles([]);
            }
        }
    };

    const handleBack = () => {
        if (previousFolder) {
            handleFolderClick(previousFolder);
        }
    };

    const handleDelete = async () => {
        if (selectedFiles.size > 0) {
            const deletionPromises = Array.from(selectedFiles).map((filePath) => deleteFile(filePath, ''));
            await Promise.all(deletionPromises);
            setSelectedFiles(new Set());
            if (selectedFolder) {
                handleFolderClick(selectedFolder);
            } else {
                fetchFolders().then((data) => setFolders(data));
            }
        }
    };

    const handleDownload = async () => {
        if (selectedFiles.size > 0) {
            const filePath = Array.from(selectedFiles)[0];
            const blob = await downloadFile(filePath, '', '', '');
            const reader = new FileReader();
            reader.onloadend = () => {
                setModalContent(reader.result);
                setModalFilePath(filePath);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(blob);
        }
    };

    return (
        <div className="remote-drive-wrapper">
            <div className="remote-drive">
                <div className="sidebar">
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <ul>
                        {folders.map((folder) => (
                            <li
                                key={folder.path}
                                onClick={() => handleFolderClick(folder)}
                                className={selectedFolder?.path === folder.path ? 'active' : ''}
                            >
                                {getFileIcon(folder.is_folder, '')} {folder.name}
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        placeholder="New folder name"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                createFolder((e.target as HTMLInputElement).value, selectedFolder?.path || '');
                                (e.target as HTMLInputElement).value = '';
                            }
                        }}
                    />
                </div>
                <div className="main">
                    <div className="status-bar" style={{ visibility: selectedFiles.size > 0 ? 'visible' : 'hidden' }}>
                        {selectedFiles.size > 0 && (
                            <div>
                                <span>{selectedFiles.size} arquivo(s) selecionado(s)</span>
                                <button onClick={handleDelete} disabled={selectedFiles.size === 0}>
                                    <FaTrash /> Excluir
                                </button>
                                <button onClick={handleDownload} disabled={selectedFiles.size === 0}>
                                    <FaDownload /> Baixar
                                </button>
                            </div>
                        )}
                    </div>
                    {selectedFolder && (
                        <div>
                            <h2>
                                {previousFolder && (
                                    <button onClick={handleBack} className="back-button">Back</button>
                                )}
                                {selectedFolder.name}
                            </h2>
                            {!searchQuery && (
                                <div className="upload-btn-wrapper">
                                    <label className="upload-btn">
                                        Upload File
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    uploadFile(file, selectedFolder.path);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            )}
                            <table className="file-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Size</th>
                                        <th>Date Modified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file) => (
                                        <tr
                                            key={file.path}
                                            onClick={(e) => handleItemClick(file, e)}
                                            onDoubleClick={() => handleItemDoubleClick(file)}
                                            className={selectedFiles.has(file.path) ? 'selected' : ''}
                                        >
                                            <td>
                                                {getFileIcon(file.is_folder, file.extension)} {file.name}
                                            </td>
                                            <td>{file.is_folder ? 'Folder' : file.extension}</td>
                                            <td>{file.is_folder ? '' : file.size}</td>
                                            <td>{file.is_folder ? '' : file.data_modified}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="modal"
                overlayClassName="overlay"
                ariaHideApp={false} // Para evitar warnings no console
            >
                <div className="modal-header">
                    <h2>Visualização do Arquivo</h2>
                    <button className="close-button" onClick={() => setIsModalOpen(false)}>✖</button>
                </div>
                <div className="modal-content">
                    {modalContent && (
                        <>
                            {modalFilePath.endsWith('.pdf') && (
                                <iframe
                                    src={modalContent as string}
                                    style={{ width: '100%', height: '500px', border: 'none' }}
                                    title="Preview"
                                />
                            )}
                            {modalFilePath.endsWith('.docx') && (
                                <iframe
                                    src={modalContent as string}
                                    style={{ width: '100%', height: '500px', border: 'none' }}
                                    title="Preview"
                                />
                            )}
                            {modalFilePath.endsWith('.jpg') || modalFilePath.endsWith('.jpeg') || modalFilePath.endsWith('.gif') || modalFilePath.endsWith('.png') ? (
                                <img
                                    src={modalContent as string}
                                    alt="Preview"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            ) : (
                                <p>Pré-visualização não disponível para este tipo de arquivo.</p>
                            )}
                            <button className="download-button" onClick={() => {/* lógica para download */ }}>Baixar</button>
                        </>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default RemoteDrive;