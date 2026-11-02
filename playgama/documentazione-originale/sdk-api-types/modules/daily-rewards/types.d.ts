import type { PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import type { AnyRecord } from '../../utils';
export interface DailyRewardsConfig {
    rewards: string[];
    cycle?: boolean;
    resetOnMiss?: boolean;
}
export interface DailyRewardsState {
    day: number;
    lastClaimEpochDay: number | null;
}
export interface DailyRewardsClaimedPayload {
    day: number;
    reward: string;
}
export interface DailyRewardsStreakResetPayload {
    day: number;
}
export interface DailyRewardsBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    options?: AnyRecord;
    getServerTime(): Promise<number>;
}
