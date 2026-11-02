import type { MultiplayerConfig, MultiplayerRegion } from './types';
import type { Session } from './protocol';
export declare const remaining: (deadline: number, signal?: AbortSignal) => number;
export declare const delay: (ms: number, signal?: AbortSignal, deadline?: number) => Promise<void>;
export default class HttpClient {
    private config;
    private headers;
    private sessions;
    private pending;
    private refreshing;
    private selectedRegion?;
    private refreshTimers;
    constructor(config: MultiplayerConfig, headers: () => Record<string, string>);
    session(region?: MultiplayerRegion | undefined): Promise<Session>;
    request<T>(path: string, body?: unknown, session?: Session, key?: string, signal?: AbortSignal, deadline?: number): Promise<T>;
    refresh(session: Session): Promise<void>;
    private storageKey;
    private selectionKey;
    private scheduleRefresh;
    private restore;
    private persist;
    private validateSession;
    private createSession;
}
