import type { JsonValue } from '../../../utils/json';
import type { MultiplayerConfig, MultiplayerPlayer, MultiplayerProperties, MultiplayerRegion } from './types';
export interface Session {
    sessionId: string;
    sessionToken: string;
    expiresAt: string;
    region: MultiplayerRegion;
    apiBase: string;
    protocolVersion: 1;
    refreshedAt?: number;
}
export interface HostMetadata {
    hostPlayerId: string | null;
    hostEpoch: string;
    hostStatus: 'none' | 'preparing' | 'active' | 'waiting';
    syncStarted: boolean;
}
export interface RoomMetadata extends HostMetadata {
    id: string;
    creatorId: string;
    region: MultiplayerRegion;
    gameVersion: string;
    maxPlayers: number;
    isOpen: boolean;
    isVisible: boolean;
    properties: MultiplayerProperties;
}
export interface Reservation {
    roomId: string;
    playerId: string;
    region: MultiplayerRegion;
    ownerEpoch: string;
    connectionGeneration: string;
    expiresAt: string;
    colyseus: {
        name: string;
        roomId: string;
        processId: string;
        sessionId: string;
        publicAddress: string;
        [field: string]: unknown;
    };
}
export type Admission = {
    status: 'grant';
    operationId: string;
    created: boolean;
    reservation: Reservation;
} | {
    status: 'admitted';
    operationId: string;
    roomId: string;
    playerId: string;
} | {
    status: 'pending';
    operationId: string;
    retryAfterMs: number;
};
export interface Welcome {
    roomId: string;
    ownerEpoch: string;
    revision: string;
    selfPlayerId: string;
    connectionGeneration: string;
    room: RoomMetadata;
    players: MultiplayerPlayer[];
    inviteCode: string;
}
export declare const uuid: () => string;
export declare const decimal: (value: unknown) => value is string;
export declare function invitation(input: string): {
    code: string;
    region: MultiplayerRegion;
};
export declare function validateConfig(config: MultiplayerConfig): void;
export declare function encodeJson(value: unknown, objectOnly?: boolean): Uint8Array;
export declare function decodeJson(bytes: Uint8Array, objectOnly?: boolean): JsonValue;
export declare function frame(header: object, payload: Uint8Array): Uint8Array;
export declare function unframe(bytes: Uint8Array): {
    header: Record<string, unknown>;
    payload: Uint8Array;
};
/**
 * Socket buffer that still accepts frames. The browser empties it only after the current task,
 * so frames sent together must fit; SendBudget limits the rate.
 */
export declare const MAX_BUFFERED_BYTES: number;
/**
 * Packet pace kept under the server quota of 60 packets/s: packets bunch up on the way, and the
 * server silently drops a packet over its quota, so the client keeps headroom.
 */
export declare const SEND_PACKETS_PER_SECOND = 50;
export declare const SEND_PACKET_BURST = 30;
/** One budget shared by relay and snapshots, including framing. */
export declare class SendBudget {
    private bytes;
    private packets;
    private at;
    take(size: number): boolean;
}
/** First byte of a room server frame (Colyseus 0.17 wire protocol). */
export declare const ROOM_FRAME: {
    readonly JOIN_ROOM: 10;
    readonly ERROR: 11;
    readonly LEAVE_ROOM: 12;
    readonly ROOM_DATA: 13;
    readonly ROOM_DATA_BYTES: 17;
};
/** Room server close codes the transport reacts to. */
export declare const ROOM_CLOSE_CODE: {
    readonly SERVER_SHUTDOWN: 4001;
    readonly MAY_TRY_RECONNECT: 4010;
    readonly REJOIN: 4410;
    readonly REPLACED: 4401;
    readonly ROOM_ENDED: 4402;
    readonly UNAUTHORIZED: 4403;
    readonly PROTOCOL_VIOLATION: 4420;
};
