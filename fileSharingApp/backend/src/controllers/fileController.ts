import { Request, Response } from 'express';
import fs from 'fs-extra';
import { FileModel } from '../models/fileModel';

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        const fileMetadata = FileModel.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            contentType: req.file.mimetype,
            uploaderId: req.userId,
            expiresAt
        });

        const downloadUrl = `${req.get('host')}/api/files/download/${fileMetadata.id}`;

        res.status(201).json({
            message: 'File uploaded successfully',
            fileId: fileMetadata.id,
            downloadUrl,
            expiresAt: fileMetadata.expiresAt
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const downloadFile = async (req: Request, res: Response) => {
    try {
        const fileId = req.params.id;
        const fileMetadata = FileModel.findById(fileId);

        if (!fileMetadata) {
            return res.status(404).json({ error: 'File not found' });
        }

        FileModel.updateDownload(fileId);

        if (!await fs.pathExists(fileMetadata.filePath)) {
            return res.status(404).json({ error: 'File not found on server' });
        }

        res.setHeader('Content-Type', fileMetadata.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.fileName}"`);
        res.setHeader('Content-Length', fileMetadata.fileSize);

        const fileStream = fs.createReadStream(fileMetadata.filePath);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};