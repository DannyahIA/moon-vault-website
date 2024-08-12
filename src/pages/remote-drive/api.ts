import { Folder } from './types';

const Host = 'http://remote-lunar.ddns.net:8080';

export const fetchFolders = async (): Promise<Folder[]> => {
    const response = await fetch(Host + '/file-manager/list-root-folders');
    const data = await response.json();
    return data;
};

export const fetchFiles = async (path: string): Promise<Folder[]> => {
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

export const searchFiles = async (query: string): Promise<Folder[]> => {
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

export const createFolder = async (folderName: string, path: string) => {
    await fetch(Host + `/file-manager/create-folder/${folderName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
    });
};

export const deleteFile = async (filePath: string, Host: any) => {
    await fetch(Host + '/file-manager/delete-file', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ path: filePath }]),
    });
};

export const uploadFile = async (file: File, path: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    await fetch(Host + '/file-manager/upload-file', {
        method: 'POST',
        body: formData,
    });
};

export const renameFile = async (filePath: string, newName: string, is_folder: boolean) => {
    await fetch(Host + '/file-manager/rename-file', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: filePath, new_name: newName, is_folder: is_folder }),
    });
};

export const downloadFile = async (filePath: string, setModalContent: unknown, setModalFilePath: unknown, setIsModalOpen: unknown): Promise<Blob> => {
    const response = await fetch(Host + '/file-manager/download-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: filePath }),
    });

    return response.blob();
};
