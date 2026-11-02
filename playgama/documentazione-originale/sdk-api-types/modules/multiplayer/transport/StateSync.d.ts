import { MultiplayerError } from './types';
import type { MultiplayerSyncOptions } from './types';
import type { HostMetadata } from './protocol';
export interface SyncContext extends HostMetadata {
    connected: boolean;
    roomId: string;
    playerId: string;
    ownerEpoch: string;
    generation: number;
}
export interface SyncTransport {
    context(): SyncContext;
    control(message: object): boolean;
    bytes(message: Uint8Array): boolean;
    changed(): void;
    error(error: MultiplayerError): void;
    rejoin(): void;
}
export default class StateSync {
    private transport;
    private options;
    private registrationId;
    private registered;
    private ready;
    private suspended;
    private failure?;
    private retained?;
    private pending?;
    private applied?;
    private appliedAck;
    private lastApplied;
    private seq;
    private assignment;
    private prepared;
    private firstAccepted;
    private timer?;
    private lastControl;
    private lastSnapshot;
    private pausedUntil;
    private stoppedAck;
    private disposed;
    get isReady(): boolean;
    get isHost(): boolean;
    get error(): MultiplayerError | undefined;
    constructor(transport: SyncTransport, options: MultiplayerSyncOptions<object>);
    connected(): void;
    disconnected(): void;
    dispose(): void;
    metadata(): void;
    control(value: unknown): void;
    snapshot(bytes: Uint8Array): void;
    private tick;
    private sendControl;
    private canCapture;
    private apply;
    private fail;
}
