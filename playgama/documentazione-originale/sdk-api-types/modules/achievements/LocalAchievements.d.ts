import type { AchievementMapping, NormalizedAchievement } from './types';
/**
 * SDK-managed achievements used on platforms without native achievements support.
 * The game developer configures the achievements list (id plus optional name and
 * description) through the bridge options; this store tracks which ids the player
 * has unlocked and persists them through the storage module (which transparently
 * uses the platform cloud when available, otherwise local storage).
 */
declare class LocalAchievements {
    #private;
    constructor(achievements: AchievementMapping[]);
    unlock(id: string): Promise<void>;
    getList(): Promise<NormalizedAchievement[]>;
}
export default LocalAchievements;
