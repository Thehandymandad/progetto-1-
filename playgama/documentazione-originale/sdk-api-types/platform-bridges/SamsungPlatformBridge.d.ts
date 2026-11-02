import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
interface SamsungResult {
    err?: unknown;
    result?: string;
    [key: string]: unknown;
}
interface SamsungAds {
    initAd(options: AnyRecord): SamsungResult | void;
    loadAd(options: {
        adFormat: string;
    }): SamsungResult | void;
    showAd(options: {
        adFormat: string;
    }): SamsungResult | void;
    addEventListener(event: string, callback: () => void): void;
}
interface GSInstantSdk {
    initializeAsync(): Promise<SamsungResult | void>;
    getLocale(): string;
    setLoadingProgress?(rate: number): void;
    canCreateShortCut(): SamsungResult | boolean;
    setOnPauseCallback(callback: () => void): void;
    setOnResumeCallback(callback: () => void): void;
    startGameAsync(): Promise<SamsungResult | void>;
    getLoginStatus(): SamsungResult;
    loginAsync(): Promise<unknown>;
    player: {
        getPlayerIdAsync(): Promise<string>;
    };
    getDataAsync(keys: string[]): Promise<Record<string, unknown>>;
    setDataAsync(data: Record<string, unknown>): Promise<unknown>;
    createShortCut(): SamsungResult | void;
    advertisement2?: SamsungAds;
}
interface SamsungIapProduct {
    mItemId: string;
    mItemName?: string;
    mItemDesc?: string;
    mItemPrice?: string | number;
    mItemPriceString?: string;
    mCurrencyCode?: string;
    mCurrencyUnit?: string;
    mItemImageUrl?: string;
    mType?: string;
    mConsumableYN?: string;
    [key: string]: unknown;
}
interface SamsungIapPurchase {
    mItemId: string;
    mPurchaseId: string;
    signedPurchaseRequest?: string;
    [key: string]: unknown;
}
interface SamsungIapConsume {
    mPurchaseId?: string;
    mPurchaseID?: string;
    mStatusCode: string | number;
    mStatusString?: string;
}
interface GSInstantIapSdk {
    getSupportedAPIs?(): string[];
    getProductListAsync(itemIDs?: string): Promise<SamsungIapProduct[]>;
    purchaseItemAsync(config: {
        itemID: string;
        passThroughParam?: string;
    }): Promise<SamsungIapPurchase>;
    consumeItemsAsync(purchaseIDs: string): Promise<SamsungIapConsume[]>;
    getOwnedListAsync(): Promise<SamsungIapPurchase[]>;
}
declare global {
    interface Window {
        GSInstant?: GSInstantSdk;
        GSInstantIAP?: GSInstantIapSdk;
    }
}
declare class SamsungPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get platformLanguage(): string;
    get isPlayerAuthorizationSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isAddToHomeScreenSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    get isPaymentsSupported(): boolean;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown, options?: unknown): Promise<unknown>;
    setLoadingProgress(percent: number): void;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    preloadInterstitial(): void;
    showInterstitial(): void;
    preloadRewarded(): void;
    showRewarded(): void;
    addToHomeScreen(): Promise<void>;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
}
export default SamsungPlatformBridge;
