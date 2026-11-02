import type { ConfigFileOptions } from './types';
import { type RemoteAppliedSource, type RemoteLoadStatus } from './RemoteConfigLoader';
export declare const LOAD_STATUS: {
    readonly PENDING: "pending";
    readonly LOADING: "loading";
    readonly SUCCESS: "success";
    readonly FAILED: "failed";
};
export type LoadStatus = typeof LOAD_STATUS[keyof typeof LOAD_STATUS];
export declare const PARSE_STATUS: {
    readonly PENDING: "pending";
    readonly SUCCESS: "success";
    readonly FAILED: "failed";
};
export type ParseStatus = typeof PARSE_STATUS[keyof typeof PARSE_STATUS];
declare class BridgeConfig {
    #private;
    get loadStatus(): LoadStatus;
    get parseStatus(): ParseStatus;
    get path(): string;
    get loadError(): string;
    get parseError(): string;
    get remoteLoadStatus(): RemoteLoadStatus;
    get remoteLoadError(): string;
    get remoteAppliedSource(): RemoteAppliedSource | null;
    load(configFilePath?: string, fallbackValues?: ConfigFileOptions): Promise<void>;
    initialize(platformId: string): void;
    getValues(): ConfigFileOptions;
    getRawValues(): ConfigFileOptions;
}
export { BridgeConfig };
declare const _default: BridgeConfig;
export default _default;
