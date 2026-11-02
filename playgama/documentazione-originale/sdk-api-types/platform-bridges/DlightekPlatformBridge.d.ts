import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
interface DlightekAdBreakOptions {
    type: string;
    name?: unknown;
    beforeAd?: () => void;
    afterAd?: () => void;
    beforeReward?: (showAdFn: (delay: number) => void) => void;
    adDismissed?: () => void;
    adViewed?: () => void;
    adBreakDone?: (placementInfo: {
        breakStatus: string;
    }) => void;
}
interface DlightekAdsenseOptions {
    client: string;
    'data-ad-frequency-hint': string;
    callback: () => void;
    'data-ad-channel'?: string;
    'data-adbreak-test'?: string;
}
interface DlightekSdk {
    init(appKey: string, a: string, b: string, c: string, d: string, options: {
        adsense: DlightekAdsenseOptions;
    }): void;
    adConfig(options: {
        preloadAdBreaks: string;
        sound: string;
        onReady: () => void;
    }): void;
    adBreak(options: DlightekAdBreakOptions): void;
    gameLoadingCompleted?(): void;
}
declare global {
    interface Window {
        h5sdk?: DlightekSdk;
    }
}
declare class DlightekPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isBannerSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    protected _bannerContainer: HTMLDivElement | null;
    protected _bannerPlacement: unknown;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown, _options?: unknown): Promise<unknown>;
    showInterstitial(placement?: unknown): void;
    showRewarded(placement?: unknown): void;
    showBanner(position?: unknown, placement?: unknown): void;
    hideBanner(): void;
}
export default DlightekPlatformBridge;
