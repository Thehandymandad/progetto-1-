import type { AnyRecord } from '../../utils';
import type { AchievementMapping, AchievementPlatformData } from './types';
export declare function getAchievementPlatformData(achievements: AchievementMapping[] | undefined, platformId: string, id: string): AchievementPlatformData;
export declare function findAchievementGameId(achievements: AchievementMapping[] | undefined, platformId: string, predicate: (platformData: AnyRecord) => boolean): string | null;
