import { type PlatformId } from '../platform/constants';
import { type ErrorCode } from '../../constants/errors';
export declare const MULTIPLAYER_TARGET: {
    readonly ALL: "all";
    readonly OTHERS: "others";
    readonly HOST: "host";
};
export type MultiplayerTarget = typeof MULTIPLAYER_TARGET[keyof typeof MULTIPLAYER_TARGET];
export declare const MULTIPLAYER_TYPE: {
    readonly RELAY: "relay";
};
export type MultiplayerType = typeof MULTIPLAYER_TYPE[keyof typeof MULTIPLAYER_TYPE];
export declare const MULTIPLAYER_STATE: {
    readonly DISCONNECTED: "disconnected";
    readonly CONNECTING: "connecting";
    readonly CONNECTED: "connected";
    readonly RECONNECTING: "reconnecting";
};
export type MultiplayerState = typeof MULTIPLAYER_STATE[keyof typeof MULTIPLAYER_STATE];
export declare const ROOM_LEAVE_REASON: {
    readonly LEFT: "left";
    readonly CONNECTION_LOST: "connection_lost";
    readonly ROOM_CLOSED: "room_closed";
};
export type RoomLeaveReason = typeof ROOM_LEAVE_REASON[keyof typeof ROOM_LEAVE_REASON];
export declare const MULTIPLAYER_UNSUPPORTED_PLATFORMS: readonly PlatformId[];
export declare const MULTIPLAYER_DEFAULTS: {
    readonly TYPE: "relay";
    readonly API_BASE: "https://playgama.com/api/bridge/v1/relay";
    readonly MAX_PLAYERS: 4;
    readonly ROOM_LIST_LIMIT: 50;
    readonly HOST_TIMEOUT: 5000;
    readonly SEND_RETRY_DELAY: 20;
    readonly MAX_QUEUED_MESSAGES: 1000;
};
export declare const MAX_PLAYER_NAME_LENGTH = 32;
export declare const HOST_SYNC: {
    readonly UPDATES_PER_SECOND: 1;
};
export declare const BACKEND_ERRORS: Readonly<Record<string, ErrorCode>>;
export declare const ROOM_ENDED_ERRORS: readonly string[];
export declare const RATE_LIMITED_ERROR = "RATE_LIMITED";
export declare const CONNECTION_STATE: {
    readonly CONNECTED: "connected";
    readonly RECONNECTING: "reconnecting";
    readonly DISCONNECTED: "disconnected";
};
export declare const INVITE_CODE_PATTERN: RegExp;
export declare const ROOM_UUID_PATTERN: RegExp;
