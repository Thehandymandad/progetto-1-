import type { PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import type { AnyRecord } from '../../utils';
export type AchievementPlatformData = string | AnyRecord;
export interface AchievementMapping {
    id: string;
    name?: string;
    description?: string;
    [platform: string]: string | AnyRecord | undefined;
}
export interface LocalAchievementsState {
    unlocked: string[];
}
export interface NormalizedAchievement {
    id: string;
    name?: string;
    description?: string;
    unlocked: boolean;
}
export interface AchievementsBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    isAchievementsSupported: boolean;
    achievementsUnlock(data: AchievementPlatformData): Promise<unknown>;
    achievementsGetList(): Promise<NormalizedAchievement[]>;
}
