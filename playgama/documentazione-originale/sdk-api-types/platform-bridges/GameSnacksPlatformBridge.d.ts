import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
interface GameSnacksAdBreakOptions {
    type: 'next' | 'reward';
    name: string;
    beforeAd?: () => void;
    afterAd?: () => void;
    beforeReward?: (showAdFn: () => void) => void;
    adDismissed?: () => void;
    adViewed?: () => void;
    adBreakDone?: (placementInfo?: {
        breakStatus?: string;
    }) => void;
}
interface GameSnacksSdk {
    game: {
        ready(): void;
        gameOver(): void;
        levelComplete(level: number): void;
        firstFrameReady(): void;
        onPause(callback: () => void): void;
        onResume(callback: () => void): void;
    };
    audio: {
        isEnabled(): boolean;
        subscribe(callback: (isEnabled: boolean) => void): void;
    };
    ad: {
        break(options: GameSnacksAdBreakOptions): void;
    };
    storage: {
        getItem(key: string): string | null;
        setItem(key: string, value: string): void;
        removeItem(key: string): void;
    };
    score: {
        update(score: unknown): Promise<unknown>;
    };
}
declare global {
    interface Window {
        GameSnacks?: GameSnacksSdk;
    }
}
declare class GameSnacksPlatformBridge extends PlatformBridgeBase {
    get platformId(): PlatformId;
    get isPlatformExternalCallsSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isPlatformPageVisibilityApiAllowed(): boolean;
    get leaderboardsType(): LeaderboardType;
    protected _isBannerSupported: boolean;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown, options?: unknown): Promise<unknown>;
    showInterstitial(placement?: unknown): void;
    showRewarded(placement?: unknown): void;
    checkAdBlock(): Promise<boolean>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    leaderboardsSetScore(_id?: unknown, score?: unknown): Promise<unknown>;
}
export default GameSnacksPlatformBridge;
