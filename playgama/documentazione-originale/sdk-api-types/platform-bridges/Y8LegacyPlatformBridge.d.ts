import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
import { type NormalizedAchievement } from '../modules/achievements';
interface Y8LoginResponse {
    status: string;
    authResponse?: {
        details: {
            pid?: string;
            locale?: string;
            nickname?: string;
            first_name?: string;
            last_name?: string;
            avatars: {
                thumb_url?: string;
                medium_url?: string;
                large_url?: string;
            };
        };
    };
}
interface Y8ApiResponse {
    status?: string;
    error?: string;
    jsondata?: string;
    [key: string]: unknown;
}
interface Y8Sdk {
    Event: {
        subscribe(eventName: string, callback: () => void): void;
    };
    init(options: {
        appId: string;
    }): void;
    getLoginStatus(callback: (data: Y8LoginResponse) => void): void;
    login(callback: (data: Y8LoginResponse) => void): void;
    api(method: string, httpMethod: string, params: AnyRecord, callback: (response: Y8ApiResponse) => void): void;
    GameAPI: {
        Leaderboards: {
            save(options: AnyRecord, callback: (response: {
                success: boolean;
                errormessage?: unknown;
            }) => void): void;
            listCustom(options: AnyRecord, callback: (response: {
                success: boolean;
                scores: AnyRecord[];
                errormessage?: unknown;
            }) => void): void;
        };
        Achievements: {
            save(options: AnyRecord, callback: (data: unknown) => void): void;
            listCustom(options: AnyRecord, callback: (data: {
                success: boolean;
                achievements: AnyRecord[];
                errorcode?: string;
            }) => void): void;
            list(options: AnyRecord): void;
        };
    };
}
declare global {
    interface Window {
        ID?: Y8Sdk;
    }
}
declare class Y8LegacyPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isInterstitialSupported(): boolean;
    get initialInterstitialDelay(): number;
    get isRewardedSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    get isPlayerAuthorizationSupported(): boolean;
    get leaderboardsType(): LeaderboardType;
    get isAchievementsSupported(): boolean;
    initialize(): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showInterstitial(): void;
    showRewarded(): void;
    leaderboardsSetScore(id: string, score: number): Promise<unknown>;
    leaderboardsGetEntries(id: string): Promise<unknown>;
    achievementsUnlock(data?: unknown): Promise<unknown>;
    achievementsGetList(): Promise<NormalizedAchievement[]>;
}
export default Y8LegacyPlatformBridge;
