import type { AnyRecord } from '../../utils';
import type { MultiplayerTarget, MultiplayerType } from './constants';
import type { MultiplayerSyncOptions } from './transport/types';
export type { MultiplayerSyncOptions } from './transport/types';
export type MultiplayerSyncStateOption<T extends object = object> = MultiplayerSyncOptions<T> | {
    updatesPerSecond?: number;
} | boolean;
export interface MultiplayerConfig {
    apiBase?: string;
}
export type MultiplayerProperties = Record<string, unknown>;
export type MultiplayerFilter = Record<string, string | number | boolean>;
export interface MultiplayerPlayer {
    id: string;
    name: string;
    isHost: boolean;
    isConnected: boolean;
    properties: MultiplayerProperties;
}
export interface MultiplayerRoom {
    id: string;
    type: MultiplayerType;
    maxPlayers: number;
    isOpen: boolean;
    isVisible: boolean;
    hostId: string;
    properties: MultiplayerProperties;
}
export interface MultiplayerRoomInfo {
    id: string;
    type: MultiplayerType;
    maxPlayers: number;
    playerCount: number;
    filter: MultiplayerFilter;
    properties: MultiplayerProperties;
}
export interface MultiplayerMessage {
    type: string;
    data: unknown;
    from: string;
}
export interface MultiplayerSendOptions {
    to?: MultiplayerTarget | string | string[];
}
export interface PlayerOptions {
    playerName?: string;
    playerProperties?: MultiplayerProperties;
}
export interface RoomTypeOptions {
    type?: MultiplayerType;
}
export interface CreateRoomOptions<T extends object = object> extends PlayerOptions, RoomTypeOptions {
    syncState?: MultiplayerSyncStateOption<T>;
    maxPlayers?: number;
    isVisible?: boolean;
    isOpen?: boolean;
    filter?: MultiplayerFilter;
    properties?: MultiplayerProperties;
}
export interface JoinRoomOptions<T extends object = object> extends PlayerOptions, RoomTypeOptions {
    syncState?: MultiplayerSyncStateOption<T>;
}
export interface JoinOrCreateRoomOptions<T extends object = object> extends PlayerOptions, RoomTypeOptions {
    syncState?: MultiplayerSyncStateOption<T>;
    maxPlayers?: number;
    filter?: MultiplayerFilter;
    properties?: MultiplayerProperties;
}
export interface GetRoomsOptions extends RoomTypeOptions {
    filter?: MultiplayerFilter;
    maxPlayers?: number;
    limit?: number;
}
export interface RoomInviteOptions extends AnyRecord {
    text?: string;
    image?: string;
}
export interface MultiplayerRoomInvite extends RoomInviteOptions {
    roomId: string;
    type: MultiplayerType;
}
export interface MultiplayerRoomStatus {
    id: string;
    type: MultiplayerType;
    maxPlayers: number;
    playerCount: number;
    isOpen: boolean;
    isVisible: boolean;
}
