import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import { type LeaderboardType } from './constants';
import type { LeaderboardEntry } from './types';
export interface LeaderboardMapping {
    id: string;
    isMain?: boolean;
    [platform: string]: string | boolean | undefined;
}
export interface LeaderboardsBridgeOptions {
    leaderboards?: LeaderboardMapping[];
    [key: string]: unknown;
}
export interface LeaderboardsBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    playerId: string | null;
    leaderboardsType: LeaderboardType;
    options: LeaderboardsBridgeOptions;
    leaderboardsSetScore(id: string | null | undefined, score: number, isMain: boolean): Promise<unknown>;
    leaderboardsGetEntries(id: string | null | undefined): Promise<unknown>;
    leaderboardsShowNativePopup(id: string | null | undefined): Promise<unknown>;
}
declare class LeaderboardsModule extends ModuleBase<LeaderboardsBridgeContract> {
    #private;
    get type(): LeaderboardType;
    initialize(platformBridge: LeaderboardsBridgeContract): this;
    setScore(id: string, score: number): Promise<unknown>;
    getEntries(id: string): Promise<LeaderboardEntry[]>;
    showNativePopup(id: string): Promise<unknown>;
    protected _getPlatformLeaderboardId(id: string | null | undefined): string | null | undefined;
}
export default LeaderboardsModule;
