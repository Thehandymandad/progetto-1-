import type { AnyRecord } from '../../utils';
export declare const REMOTE_LOAD_STATUS: {
    readonly PENDING: "pending";
    readonly LOADING: "loading";
    readonly SUCCESS: "success";
    readonly FAILED: "failed";
    readonly TIMEOUT: "timeout";
    readonly SKIPPED: "skipped";
};
export type RemoteLoadStatus = typeof REMOTE_LOAD_STATUS[keyof typeof REMOTE_LOAD_STATUS];
export declare const REMOTE_APPLIED_SOURCE: {
    readonly NETWORK: "network";
    readonly FRESH_CACHE: "fresh-cache";
    readonly STALE_CACHE: "stale-cache";
};
export type RemoteAppliedSource = typeof REMOTE_APPLIED_SOURCE[keyof typeof REMOTE_APPLIED_SOURCE];
export interface RemoteConfigLoaderOptions {
    url: string;
    timeoutMs?: number;
    ttlMs?: number;
}
export interface RemoteConfigLoadResult {
    source: RemoteAppliedSource | null;
    options: AnyRecord | null;
    error?: string;
}
declare class RemoteConfigLoader {
    #private;
    get loadStatus(): RemoteLoadStatus;
    get loadError(): string;
    get appliedSource(): RemoteAppliedSource | null;
    constructor({ url, timeoutMs, ttlMs }: RemoteConfigLoaderOptions);
    load(): Promise<RemoteConfigLoadResult>;
    refreshInBackground(): void;
}
export default RemoteConfigLoader;
