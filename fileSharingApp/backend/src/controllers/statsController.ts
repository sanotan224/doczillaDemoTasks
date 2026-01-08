import { Request, Response } from 'express';
import { FileModel } from '../models/fileModel';

export const getStats = async (req: Request, res: Response) => {
    try {
        const files = FileModel.getAll();
        const userFiles = files.filter(file => file.uploaderId === req.userId);

        const totalSize = userFiles.reduce((sum, file) => sum + file.fileSize, 0);
        const totalDownloads = userFiles.reduce((sum, file) => sum + file.downloadCount, 0);
        const activeFiles = userFiles.filter(file => new Date(file.expiresAt) > new Date()).length;

        res.json({
            activeFiles,
            totalSize,
            totalDownloads,
            averageDownloads: userFiles.length > 0 ? totalDownloads / userFiles.length : 0
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};