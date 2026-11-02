declare class MemoryCache {
    #private;
    has(key: string): boolean;
    get(key: string): unknown;
    isDirty(key: string): boolean;
    isDeleted(key: string): boolean;
    dirtyKeys(): string[];
    deletedKeys(): string[];
    set(key: string, value: unknown): void;
    setDirty(key: string, value: unknown): void;
    delete(key: string): void;
    tombstone(key: string): void;
    keys(): string[];
    clear(): void;
}
export default MemoryCache;
