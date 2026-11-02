import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import { type EventEmitter } from '../../lib/EventBus';
import { type MultiplayerState } from './constants';
import type { CreateRoomOptions, GetRoomsOptions, JoinOrCreateRoomOptions, JoinRoomOptions, MultiplayerPlayer, MultiplayerProperties, MultiplayerRoom, MultiplayerRoomInfo, MultiplayerRoomInvite, MultiplayerRoomStatus, MultiplayerSendOptions, RoomInviteOptions } from './types';
export interface MultiplayerBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    playerId: string | null;
    playerName: string | null;
    isMultiplayerRoomInviteSupported: boolean;
    multiplayerLaunchRoomId: string | null;
    multiplayerInviteToRoom(invite: MultiplayerRoomInvite): Promise<unknown>;
    notifyMultiplayerRoomChanged(room: MultiplayerRoomStatus | null): void;
}
interface MultiplayerModule extends EventEmitter {
}
declare class MultiplayerModule extends ModuleBase<MultiplayerBridgeContract> {
    #private;
    get isSupported(): boolean;
    get state(): MultiplayerState;
    get isInRoom(): boolean;
    get isHost(): boolean;
    get playerId(): string | null;
    get hostId(): string | null;
    get roomId(): string | null;
    get room(): MultiplayerRoom | null;
    get players(): MultiplayerPlayer[];
    get isInviteSupported(): boolean;
    get launchRoomId(): string | null;
    get syncState(): MultiplayerProperties;
    createRoom<T extends object = object>(options?: CreateRoomOptions<T>): Promise<string>;
    joinRoom<T extends object = object>(roomId: string, options?: JoinRoomOptions<T>): Promise<void>;
    joinOrCreateRoom<T extends object = object>(options?: JoinOrCreateRoomOptions<T>): Promise<string>;
    getRooms(options?: GetRoomsOptions): Promise<MultiplayerRoomInfo[]>;
    inviteToRoom(options?: RoomInviteOptions): Promise<unknown>;
    leaveRoom(): void;
    setRoomOpen(isOpen: boolean): void;
    setRoomVisible(isVisible: boolean): void;
    setRoomProperties(properties: MultiplayerProperties): void;
    setPlayerProperties(properties: MultiplayerProperties): void;
    send(type: string, data?: unknown, options?: MultiplayerSendOptions): void;
    setSyncState(state: MultiplayerProperties): void;
}
export default MultiplayerModule;
