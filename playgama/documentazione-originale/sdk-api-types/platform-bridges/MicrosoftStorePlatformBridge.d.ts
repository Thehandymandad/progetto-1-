import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
interface PgAdInstance {
    state: string;
    show(): void;
    addEventListener(event: string, callback: () => void): void;
}
interface PgAdsSdk {
    init(id: string): Promise<unknown>;
    updateTargeting(targeting: Record<string, unknown>): void;
    requestOutOfPageAd(type: string): Promise<PgAdInstance>;
}
interface ChromeWebView {
    addEventListener(event: string, callback: (event: {
        data: unknown;
    }) => void): void;
    postMessage(message: unknown): void;
}
declare global {
    interface Window {
        pgAds?: PgAdsSdk;
        chrome?: {
            webview?: ChromeWebView;
        };
    }
}
declare class MicrosoftStorePlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isPlayerAuthorizationSupported(): boolean;
    get isPaymentsSupported(): boolean;
    get isRateSupported(): boolean;
    protected _isPlatformStorageAvailable: boolean;
    initialize(): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    showInterstitial(): void;
    showRewarded(): void;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
    rate(): Promise<unknown>;
}
export default MicrosoftStorePlatformBridge;
