export const getFileIcon = (is_folder: boolean, extension: string): string => {
    if (is_folder) return '📁'; // Ícone de pasta
    switch (extension) {
        case '.pdf':
            return '📄'; // PDF
        case '.doc':
        case '.docx':
            return '📝'; // Documento Word
        case '.xls':
        case '.xlsx':
            return '📊'; // Planilha Excel
        case '.ppt':
        case '.pptx':
            return '📈'; // Apresentação PowerPoint
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.gif':
            return '🖼️'; // Imagem
        case '.mp4':
        case '.avi':
            return '🎥'; // Vídeo
        case '.mp3':
            return '🎵'; // Áudio
        case '.zip':
        case '.rar':
            return '📦'; // Arquivo compactado
        default:
            return '📄'; // Arquivo genérico
    }
};
