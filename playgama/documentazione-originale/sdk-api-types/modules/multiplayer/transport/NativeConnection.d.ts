import type { Reservation } from './protocol';
export interface NativeEvents {
    control(value: unknown): void;
    syncControl(value: unknown): void;
    relay(value: Uint8Array): void;
    snapshot(value: Uint8Array): void;
    closed(code: number): void;
}
export declare const terminalClose: (code: number) => string | undefined;
export declare const needsRejoin: (code: number) => boolean;
/**
 * WebSocket to the room server. Speaks the frames of the Colyseus wire protocol a relay room
 * uses: join with a seat reservation, messages and byte messages. Rooms have no Colyseus state.
 */
export default class NativeConnection {
    get token(): string | undefined;
    get open(): boolean;
    get buffered(): number;
    private socket?;
    private stopped;
    private joined;
    private events;
    private reconnectionToken?;
    private join?;
    private offline;
    constructor(events: NativeEvents);
    connect(reservation: Reservation, endpoint: string, signal: AbortSignal, token?: string): Promise<void>;
    send(channel: string, value: unknown): void;
    sendBytes(channel: string, bytes: Uint8Array): void;
    stop(): void;
    private write;
    private receive;
    private dispatch;
    private fail;
    private closed;
    private drop;
}
