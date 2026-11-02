import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
interface JioGamesAdCallbacks {
    onAdPrepared?: () => void;
    onAdClosed?: (isRewardUser?: boolean) => void;
    onAdFailedToLoad?: (error: unknown) => void;
}
interface JioGamesPlayerInfo {
    gamer_id?: string;
    gamer_name?: string;
    gamer_avatar_url?: string;
    [key: string]: unknown;
}
interface JioGamesSdk {
    playerInfo?: JioGamesPlayerInfo;
    cacheAd(type: string, callbacks: JioGamesAdCallbacks): void;
    showAd(type: string, callbacks: JioGamesAdCallbacks): void;
    postScore(value: number): void;
}
interface JioGamesBanner {
    loadBanner(): Promise<unknown>;
    showBanner(position: string): void;
    hideBanner(): void;
}
declare global {
    interface Window {
        JioGames?: JioGamesSdk;
        JGBanner?: JioGamesBanner;
        AdType?: {
            Interstitial: string;
            Rewarded: string;
        };
        BannerPosition?: {
            TOP: string;
            BOTTOM: string;
        };
        onSdkReady?: () => void;
        onBannerReady?: () => void;
    }
}
declare class JioGamesPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isBannerSupported(): boolean;
    get leaderboardsType(): LeaderboardType;
    get isPlatformExternalLinksAllowed(): boolean;
    protected _preloadInterstitialPromise: Promise<unknown> | null;
    protected _preloadRewardedPromise: Promise<unknown> | null;
    protected _isBannerAvailable: boolean;
    initialize(): Promise<unknown>;
    preloadInterstitial(): void;
    showInterstitial(): void;
    preloadRewarded(): void;
    showRewarded(): void;
    showBanner(position?: unknown): void;
    hideBanner(): void;
    leaderboardsSetScore(_id?: unknown, score?: unknown, isMain?: unknown): Promise<unknown>;
}
export default JioGamesPlatformBridge;
