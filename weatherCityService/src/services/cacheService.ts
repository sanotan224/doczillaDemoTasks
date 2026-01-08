import NodeCache from 'node-cache';

export class CacheService {
    private cache: NodeCache;

    constructor() {
        this.cache = new NodeCache({ stdTTL: 60 * 15 });
    }

    async get<T>(key: string): Promise<T | null> {
        return this.cache.get<T>(key) ?? null;
    }

    async set<T>(key: string, value: T): Promise<boolean> {
        return this.cache.set(key, value);
    }

    async has(key: string): Promise<boolean> {
        return this.cache.has(key);
    }
}