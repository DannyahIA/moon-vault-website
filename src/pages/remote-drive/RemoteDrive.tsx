import React, { useState, useEffect } from 'react';
import { FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import './RemoteDrive.css';

interface Folder {
    name: string;
    is_folder: boolean;
    path: string;
    size: string;
    extension: string;
    data_modified: string;
}

const RemoteDrive: React.FC = () => {
    const Host = 'http://remote-lunar.ddns.net:8080';
    const [folders, setFolders] = useState<Folder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [files, setFiles] = useState<Folder[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, file: Folder | null, location: 'sidebar' | 'main' } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<string | ArrayBuffer | null>(null);
    const [modalFilePath, setModalFilePath] = useState('');
    const [previousFolder, setPreviousFolder] = useState<Folder | null>(null); // Added state for previous folder

    useEffect(() => {
        fetchFolders().then((data) => setFolders(data));
    }, []);

    const fetchFolders = async (): Promise<Folder[]> => {
        const response = await fetch(Host + '/file-manager/list-root-folders');
        const data = await response.json();
        return data;
    };

    const fetchFiles = async (path: string): Promise<Folder[]> => {
        const response = await fetch(Host + '/file-manager/list-files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path }),
        });
        const data = await response.json();
        return data;
    };

    const searchFiles = async (query: string): Promise<Folder[]> => {
        const response = await fetch(Host + '/file-manager/search-files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        const data = await response.json();
        return data;
    };

    const createFolder = async (folderName: string, path: string) => {
        await fetch(Host + `/file-manager/create-folder/${folderName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ path }),
        });
        if (selectedFolder) {
            handleFolderClick(selectedFolder);
        } else {
            fetchFolders().then((data) => setFolders(data));
        }
    };

    const deleteFile = async (filePath: string) => {
        await fetch(Host + '/file-manager/delete-file', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{ path: filePath }]),
        });
        if (selectedFolder) {
            handleFolderClick(selectedFolder);
        } else {
            fetchFolders().then((data) => setFolders(data));
        }
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', selectedFolder?.path || '');

        await fetch(Host + '/file-manager/upload-file', {
            method: 'POST',
            body: formData,
        });

        if (selectedFolder) {
            handleFolderClick(selectedFolder);
        }
    };

    const renameFile = async (filePath: string, newName: string, is_folder: boolean) => {
        try {
            const response = await fetch(Host + '/file-manager/rename-file', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: filePath, new_name: newName, is_folder: is_folder }),
            });

            if (!response.ok) {
                throw new Error('Failed to rename file');
            }

            if (selectedFolder) {
                handleFolderClick(selectedFolder);
            }
        } catch (error) {
            console.error('Error renaming file:', error);
        }
    };

    const downloadFile = async (filePath: string) => {
        try {
            const response = await fetch(Host + '/file-manager/download-file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: filePath }),
            });

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            // Create a URL for the file
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                setModalContent(reader.result);
                setModalFilePath(filePath);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const handleFolderClick = async (folder: Folder) => {
        setSelectedFolder(folder);
        setPreviousFolder(selectedFolder); // Store the previous folder
        const files = await fetchFiles(folder.path);
        setFiles(files);
    };

    const handleItemDoubleClick = async (item: Folder) => {
        if (item.is_folder) {
            handleFolderClick(item);
        } else {
            downloadFile(item.path);
        }
    };

    const handleContextMenu = (event: React.MouseEvent, file: Folder | null, location: 'sidebar' | 'main') => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY, file, location });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleRename = (newName: string) => {
        if (contextMenu?.file) {
            renameFile(contextMenu.file.path, newName, contextMenu.file.is_folder);
            handleCloseContextMenu();
        }
    };

    const handleDownload = () => {
        if (contextMenu?.file) {
            downloadFile(contextMenu.file.path);
            handleCloseContextMenu();
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

    const getFileIcon = (is_folder: boolean, extension: string): string => {
        if (is_folder) return '📁'; // Ícone de pasta
        switch (extension) {
            case '.pdf':
                return '📄'; // PDF
            case '.doc':
                return '📝'; // Documento Word
            case '.docx':
                return '📝'; // Documento Word
            case '.xls':
                return '📊'; // Planilha Excel
            case '.xlsx':
                return '📊'; // Planilha Excel
            case '.ppt':
                return '📈'; // Apresentação PowerPoint
            case '.pptx':
                return '📈'; // Apresentação PowerPoint
            case '.jpg':
                return '🖼️'; // Imagem
            case '.jpeg':
                return '🖼️'; // Imagem
            case '.png':
                return '🖼️'; // Imagem
            case '.gif':
                return '🖼️'; // Imagem
            case '.mp4':
                return '🎥'; // Vídeo
            case '.avi':
                return '🎥'; // Vídeo
            case '.mp3':
                return '🎵'; // Áudio
            case '.zip':
                return '📦'; // Arquivo compactado
            case '.rar':
                return '📦'; // Arquivo compactado
            default:
                return '📄'; // Arquivo genérico
        }
    };

    const handleBack = () => {
        if (previousFolder) {
            handleFolderClick(previousFolder);
        }
    };

    return (
        <div className="remote-drive-wrapper">
            <div className="header">
                {/* Seu conteúdo de cabeçalho existente */}
            </div>
            <div className="remote-drive">
                <div className="sidebar" onContextMenu={(e) => handleContextMenu(e, null, 'sidebar')}>
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
                                onContextMenu={(e) => handleContextMenu(e, folder, 'sidebar')}
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
                <div className="main" onContextMenu={(e) => handleContextMenu(e, null, 'main')}>
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
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    uploadFile(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            )}
                            <ul className="file-list">
                                {files.map((file) => (
                                    <li key={file.path} onDoubleClick={() => handleItemDoubleClick(file)} className="file-item">
                                        <div className="file-info">
                                            <span className="file-icon">{getFileIcon(file.is_folder, file.extension)} {file.name}</span>
                                            <span className="file-size">{file.is_folder ? '' : `${file.size}`}</span>
                                            <span className="file-date">{file.data_modified}</span>
                                        </div>
                                        <div className="file-actions">
                                            <FaDownload onClick={() => downloadFile(file.path)} title="Download" />
                                            <FaEdit onClick={() => handleRename(prompt('New name') || '')} title="Edit" />
                                            <FaTrash onClick={() => deleteFile(file.path)} title="Delete" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {contextMenu && (
                    <div
                        className="context-menu"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                        onClick={handleCloseContextMenu}
                    >
                        <button onClick={() => handleRename(prompt('New name') || '')}>Rename</button>
                        <button onClick={handleDownload}>Download</button>
                        <button onClick={() => deleteFile(contextMenu.file?.path || '')}>Delete</button>
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="modal">
                <div className="modal-content">
                    <h2>Preview File</h2>
                    <div>
                        {modalContent && modalFilePath.endsWith('.txt') && (
                            <pre>{String.fromCharCode.apply(null, Array.from(new Uint16Array(modalContent as ArrayBuffer)))}</pre>
                        )}
                        {modalContent && modalFilePath.match(/\.(jpg|jpeg|png|gif)$/) && (
                            <img src={modalContent as string} alt="Preview" />
                        )}
                    </div>
                    <button
                        onClick={() => {
                            const a = document.createElement('a');
                            a.href = modalContent as string;
                            a.download = modalFilePath.split('/').pop() || 'file';
                            a.style.display = 'none';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            setIsModalOpen(false);
                        }}
                    >
                        Download
                    </button>
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default RemoteDrive;
