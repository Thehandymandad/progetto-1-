import ModuleBase from '../ModuleBase';
import type { AchievementsBridgeContract, NormalizedAchievement } from './types';
declare class AchievementsModule extends ModuleBase<AchievementsBridgeContract> {
    #private;
    initialize(platformBridge: AchievementsBridgeContract): this;
    unlock(id: string): Promise<unknown>;
    getAchievements(): Promise<NormalizedAchievement[]>;
}
export default AchievementsModule;
