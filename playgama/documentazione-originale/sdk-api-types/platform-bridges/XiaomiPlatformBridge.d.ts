import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
interface FunmaxApi {
    loadStart?: () => void;
    loadReady?: () => void;
}
declare global {
    interface Window {
        funmax?: FunmaxApi;
    }
}
declare class XiaomiPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isBannerSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown, options?: unknown): Promise<unknown>;
    showBanner(position?: unknown, placement?: unknown): void;
    hideBanner(): void;
    showInterstitial(placement?: unknown): void;
    showRewarded(placement?: unknown): void;
}
export default XiaomiPlatformBridge;
