import { FileModel } from '../models/fileModel';
import fs from 'fs-extra';

export const cleanupExpiredFiles = async () => {
    try {
        const expiredFiles = FileModel.getExpiredFiles();
        for (const file of expiredFiles) {
            try {
                await fs.remove(file.filePath);
                FileModel.delete(file.id);
                console.log(`Deleted expired file: ${file.fileName}`);
            } catch (error) {
                console.error(`Error deleting file ${file.id}:`, error);
            }
        }
        if (expiredFiles.length > 0) {
            console.log(`Cleanup completed. Deleted ${expiredFiles.length} files.`);
        }
    } catch (error) {
        console.error(error);
    }
};

export const startCleanupService = () => {
    setInterval(cleanupExpiredFiles,  1000);
    cleanupExpiredFiles();
};