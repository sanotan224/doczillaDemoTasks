import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs-extra';
import {FileMetadata} from "./fileMetadata";

export class FileModel {
    private static files: Map<string, FileMetadata> = new Map();
    private static uploadsDir = path.join(__dirname, '../../uploads/')
    private static metadataPath = this.uploadsDir + 'metadata.json';

    static async saveMetadata(): Promise<void> {
        try {
            await fs.ensureDir(this.uploadsDir);
            await fs.chmod(this.uploadsDir, 0o755);
            await fs.ensureDir(path.dirname(this.metadataPath));
            await fs.writeJson(this.metadataPath, Object.fromEntries(this.files));
        } catch (error) {
            console.error('Error saving metadata:', error);
        }
    }

    static create(metadata: Omit<FileMetadata, 'id' | 'lastDownloadDate' | 'downloadCount'>): FileMetadata {
        const id = uuidv4();
        const fileMetadata: FileMetadata = {
            ...metadata,
            id,
            downloadCount: 0
        };

        this.files.set(id, fileMetadata);
        this.saveMetadata();
        return fileMetadata;
    }

    static findById(id: string): FileMetadata | undefined {
        return this.files.get(id);
    }

    static updateDownload(id: string): FileMetadata | null {
        const file = this.files.get(id);
        if (!file) return null;

        file.expiresAt = new Date();
        file.expiresAt.setDate(file.expiresAt.getDate() + 30);

        file.downloadCount += 1;
        this.files.set(id, file);
        this.saveMetadata();

        return file;
    }

    static delete(id: string): boolean {
        const file = this.files.get(id);
        if (!file) return false;

        this.files.delete(id);
        this.saveMetadata();
        return true;
    }

    static getAll(): FileMetadata[] {
        return Array.from(this.files.values());
    }

    static getExpiredFiles(): FileMetadata[] {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return Array.from(this.files.values()).filter(file =>
            file.expiresAt && file.expiresAt < thirtyDaysAgo
        );
    }
}