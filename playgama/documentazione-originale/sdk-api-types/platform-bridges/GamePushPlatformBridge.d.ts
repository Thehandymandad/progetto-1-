import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
interface GamePushAds {
    showFullscreen(): void;
    showRewardedVideo(): Promise<unknown>;
    showSticky(): void;
    closeSticky(): void;
    isAdblockEnabled(): Promise<boolean>;
    on(event: string, callback: (arg?: unknown) => void): void;
}
interface GamePushPlayer {
    id?: string | null;
    name?: string;
    avatar?: string;
}
interface GamePushSdk {
    ads: GamePushAds;
    player?: GamePushPlayer;
}
declare global {
    interface Window {
        GamePush?: GamePushSdk;
    }
}
declare class GamePushPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    protected _isBannerSupported: boolean;
    initialize(): Promise<unknown>;
    showInterstitial(): void;
    showRewarded(): void;
    showBanner(): void;
    hideBanner(): void;
    checkAdBlock(): Promise<boolean>;
}
export default GamePushPlatformBridge;
