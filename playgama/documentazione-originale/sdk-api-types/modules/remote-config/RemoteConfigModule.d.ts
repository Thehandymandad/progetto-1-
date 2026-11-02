import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
export type RemoteConfigContext = Record<string, string | number | boolean>;
export interface RemoteConfigBridgeContract extends PlatformBridgeLike {
    isRemoteConfigSupported: boolean;
    getRemoteConfig(parameters?: RemoteConfigContext): Promise<unknown>;
}
declare class RemoteConfigModule extends ModuleBase<RemoteConfigBridgeContract> {
    #private;
    get isSupported(): boolean;
    setContext(parameters: RemoteConfigContext): void;
    get(): Promise<unknown>;
}
export default RemoteConfigModule;
