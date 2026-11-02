import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
import { type NormalizedAchievement } from '../modules/achievements';
interface Y8User {
    pid?: string;
    nickname?: string;
    first_name?: string;
    last_name?: string;
    avatars?: {
        thumb_url?: string;
        medium_url?: string;
        large_url?: string;
    };
}
interface Y8AdBreakInfo {
    breakStatus: string;
}
interface Y8ShowAdOptions {
    type: string;
    name: string;
    beforeAd?: () => void;
    afterAd?: () => void;
    adBreakDone?: (info: Y8AdBreakInfo) => void;
    beforeReward?: (showAdFn: () => void) => void;
    adDismissed?: () => void;
    adViewed?: () => void;
}
interface Y8Sdk {
    init(appConfig: AnyRecord, adConfig?: AnyRecord): Promise<void>;
    onAuth(callback: (user: Y8User | null, error: unknown) => void): void;
    login(): Promise<void>;
    getUser(): Y8User | null;
    getPlatformLocale(): Promise<string>;
    showAd(options: Y8ShowAdOptions): Promise<void>;
    requestBanner(options: {
        id: string;
        width: number;
        height: number;
    }): Promise<void>;
    clearBanner(id: string): void;
    saveLeaderboardScore(options: {
        table: string;
        points: number;
    }): Promise<void>;
    getLeaderboardScores(options: {
        table: string;
        mode?: string;
    }): Promise<{
        items: AnyRecord[];
    }>;
    getAchievements(): Promise<AnyRecord[]>;
    awardAchievement(options: {
        achievement: string;
        achievementKey: string;
    }): Promise<void>;
    saveData(options: {
        key: string;
        value: string;
    }): Promise<void>;
    loadData(options: {
        key: string;
    }): Promise<string | null>;
    trackCustomEvent(name: string, value?: number | null, amount?: number): void;
}
declare global {
    interface Window {
        y8?: {
            sdk(): Y8Sdk;
        };
    }
}
declare class Y8PlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get platformLanguage(): string;
    get isInterstitialSupported(): boolean;
    get initialInterstitialDelay(): number;
    get isRewardedSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    get isPlayerAuthorizationSupported(): boolean;
    get leaderboardsType(): LeaderboardType;
    get isAchievementsSupported(): boolean;
    protected _isBannerSupported: boolean;
    protected _isAdvancedBannersSupported: boolean;
    initialize(): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showBanner(position?: unknown): void;
    hideBanner(): void;
    showAdvancedBanners(banners?: unknown): void;
    hideAdvancedBanners(): void;
    showInterstitial(placement?: unknown): void;
    showRewarded(placement?: unknown): void;
    leaderboardsSetScore(id: string, score: number): Promise<unknown>;
    leaderboardsGetEntries(id: string): Promise<unknown>;
    achievementsUnlock(data?: unknown): Promise<unknown>;
    achievementsGetList(): Promise<NormalizedAchievement[]>;
    sendAnalyticsEvent(eventName: string, data: Record<string, unknown>): void;
}
export default Y8PlatformBridge;
