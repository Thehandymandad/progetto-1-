import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
declare const SUBSCRIBE_BUTTON_TYPE: {
    readonly ROLL: "roll";
    readonly BOUNCE: "bounce";
};
export type YoutubeSubscribeButtonType = typeof SUBSCRIBE_BUTTON_TYPE[keyof typeof SUBSCRIBE_BUTTON_TYPE];
interface YtgameSystem {
    getLanguage(): Promise<string>;
    isAudioEnabled(): boolean;
    onAudioEnabledChange(callback: (isEnabled: boolean) => void): void;
    onPause(callback: () => void): void;
    onResume(callback: () => void): void;
}
interface YtgameGame {
    loadData(): Promise<string>;
    saveData(data: string): Promise<unknown>;
    gameReady(): void;
    firstFrameReady(): void;
}
interface YtgameAds {
    requestInterstitialAd(): Promise<unknown>;
    requestRewardedAd(placement?: unknown): Promise<boolean>;
}
interface YtgameEngagement {
    sendScore(options: {
        value: number;
    }): Promise<unknown>;
    openYTContent(content: {
        id: string;
    }): Promise<unknown>;
}
interface YtgameSdk {
    system: YtgameSystem;
    game: YtgameGame;
    ads: YtgameAds;
    engagement: YtgameEngagement;
}
declare global {
    interface Window {
        ytgame?: YtgameSdk;
    }
}
declare class YoutubePlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isPlatformExternalCallsSupported(): boolean;
    get platformLanguage(): string;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    get isClipboardSupported(): boolean;
    get leaderboardsType(): LeaderboardType;
    initialize(): Promise<unknown>;
    getDataFromStorage(): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    sendMessage(message?: unknown, _options?: unknown): Promise<unknown>;
    showInterstitial(): void;
    showRewarded(placement?: unknown): void;
    checkAdBlock(): Promise<boolean>;
    leaderboardsSetScore(_id?: unknown, score?: unknown, isMain?: unknown): Promise<unknown>;
}
export default YoutubePlatformBridge;
