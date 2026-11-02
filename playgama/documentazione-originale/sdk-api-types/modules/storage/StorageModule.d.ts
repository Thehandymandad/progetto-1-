import ModuleBase from '../ModuleBase';
import type { StorageBridgeContract } from './types';
declare class StorageModule extends ModuleBase<StorageBridgeContract> {
    #private;
    initialize(platformBridge: StorageBridgeContract): this;
    get(key: string | string[], tryParseJson?: boolean): Promise<unknown>;
    set(key: string | string[], value: unknown | unknown[]): Promise<void>;
    delete(key: string | string[]): Promise<void>;
}
export default StorageModule;
