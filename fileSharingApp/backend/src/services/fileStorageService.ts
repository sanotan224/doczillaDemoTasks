import { v4 as uuidv4 } from 'uuid';
import {IFileMetadata} from "../models/fileMetadata";

export class FileStorageService {
    private static files: Map<string, IFileMetadata> = new Map();

    static create(metadata: Omit<IFileMetadata, 'id' | 'downloadCount'>): IFileMetadata {
        const id = uuidv4();
        const fileMetadata: IFileMetadata = {
            ...metadata,
            id,
            downloadCount: 0
        };

        this.files.set(id, fileMetadata);
        return fileMetadata;
    }

    static findById(id: string): IFileMetadata | undefined {
        return this.files.get(id);
    }

    static updateDownload(id: string): IFileMetadata | null {
        const file = this.files.get(id);
        if (!file) {
            return null;
        }

        file.expiresAt = new Date();
        file.expiresAt.setDate(file.expiresAt.getDate() + 30);

        file.downloadCount += 1;
        this.files.set(id, file);

        return file;
    }

    static delete(id: string): boolean {
        const file = this.files.get(id);
        if (!file) {
            return false;
        }

        this.files.delete(id);
        return true;
    }

    static getAll(): IFileMetadata[] {
        return Array.from(this.files.values());
    }

    static getExpiredFiles(): IFileMetadata[] {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return Array.from(this.files.values()).filter(file =>
            file.expiresAt && file.expiresAt < thirtyDaysAgo
        );
    }
}