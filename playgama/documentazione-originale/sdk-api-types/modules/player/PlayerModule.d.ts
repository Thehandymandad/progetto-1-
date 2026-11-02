import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import { type AnyRecord } from '../../utils';
export type PlayerAuthorizeOptions = AnyRecord & Partial<Record<PlatformId, AnyRecord>>;
export interface PlayerBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    isPlayerAuthorizationSupported: boolean;
    isPlayerAuthorized: boolean;
    playerId: string | null;
    playerName: string | null;
    playerPhotos: string[];
    playerExtra: AnyRecord;
    authorizePlayer(options?: PlayerAuthorizeOptions): Promise<unknown>;
}
declare class PlayerModule extends ModuleBase<PlayerBridgeContract> {
    get isAuthorizationSupported(): boolean;
    get isAuthorized(): boolean;
    get isGuest(): boolean;
    get id(): string | null;
    get name(): string | null;
    get photos(): string[];
    get extra(): AnyRecord;
    authorize(options?: PlayerAuthorizeOptions): Promise<unknown>;
}
export default PlayerModule;
