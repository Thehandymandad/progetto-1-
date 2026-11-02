import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
interface GdSdkEvent {
    name: string;
}
interface GdSdk {
    showAd(type?: string, options?: {
        containerId?: string;
    }): Promise<unknown>;
    preloadAd(type: string): unknown;
}
declare global {
    interface Window {
        GD_OPTIONS?: {
            gameId: string;
            onEvent(event: GdSdkEvent): void;
        };
        gdsdk?: GdSdk;
    }
}
declare class GameDistributionPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isPlatformExternalCallsSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isMinimumDelayBetweenInterstitialEnabled(): boolean;
    get isRewardedSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    initialize(): Promise<unknown>;
    showBanner(position?: unknown, _placement?: unknown): void;
    hideBanner(): void;
    showInterstitial(): void;
    preloadRewarded(): void;
    showRewarded(): void;
}
export default GameDistributionPlatformBridge;
