import type { PlatformBridgeLike } from '../ModuleBase';
export interface StorageBridgeContract extends PlatformBridgeLike {
    isPlatformStorageAvailable: boolean;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    notifyLocalDataChanged?(batch: WriteBatch): void;
}
export interface StorageEntry {
    key: string;
    value: unknown;
}
export interface WriteBatch {
    sets: StorageEntry[];
    deletes: string[];
}
