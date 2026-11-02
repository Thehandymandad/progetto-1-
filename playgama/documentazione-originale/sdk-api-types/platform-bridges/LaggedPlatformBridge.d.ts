import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
interface LaggedUserResponse {
    user?: {
        id?: number;
        name?: string;
        avatar?: string;
    };
}
interface LaggedScoresResponse {
    success: boolean;
    errormsg?: string;
}
interface LaggedAchievementsResponse {
    success: boolean;
    errormsg?: string;
}
interface LaggedSdk {
    init(devId: string, publisherId: string): void;
    User: {
        get(callback: (response: LaggedUserResponse) => void): void;
    };
    APIAds: {
        show(callback: () => void): void;
    };
    GEvents: {
        reward(canShowReward: (success: boolean, showAdFn: () => void) => void, rewardSuccess: (success: boolean) => void): void;
    };
    Scores: {
        save(params: {
            score: unknown;
            board: unknown;
        }, callback: (response: LaggedScoresResponse) => void): void;
    };
    Achievements: {
        save(achievements: unknown[], callback: (response: LaggedAchievementsResponse) => void): void;
    };
}
declare global {
    interface Window {
        LaggedAPI?: LaggedSdk;
    }
}
declare class LaggedPlatformBridge extends PlatformBridgeBase {
    get platformId(): PlatformId;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get leaderboardsType(): LeaderboardType;
    get isAchievementsSupported(): boolean;
    initialize(): Promise<unknown>;
    showInterstitial(): void;
    showRewarded(): void;
    leaderboardsSetScore(id: unknown, score: unknown): Promise<unknown>;
    achievementsUnlock(data?: unknown): Promise<unknown>;
}
export default LaggedPlatformBridge;
