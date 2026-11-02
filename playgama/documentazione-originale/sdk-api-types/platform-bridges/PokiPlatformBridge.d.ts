import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
interface PokiSdk {
    init(): Promise<unknown>;
    gameLoadingFinished(): void;
    gameplayStart(): void;
    gameplayStop(): void;
    commercialBreak(onStart: () => void): Promise<unknown>;
    rewardedBreak(onStart: () => void): Promise<boolean>;
}
declare global {
    interface Window {
        PokiSDK?: PokiSdk;
    }
}
declare class PokiPlatformBridge extends PlatformBridgeBase {
    get platformId(): PlatformId;
    get isPlatformExternalCallsSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    get isClipboardSupported(): boolean;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown): Promise<unknown>;
    showInterstitial(): void;
    showRewarded(): void;
}
export default PokiPlatformBridge;
