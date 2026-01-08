export interface FileMetadata {
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    contentType: string;
    downloadCount: number;
    uploaderId: number;
    expiresAt: Date;
}
