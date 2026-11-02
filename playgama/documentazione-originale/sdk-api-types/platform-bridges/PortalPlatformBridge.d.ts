import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
interface PortalSdk {
    getLocale(): string;
    initialize(): Promise<unknown>;
    initializeOverlay(): void;
    getValue(key: string): unknown;
    setValue(key: string, value: unknown): unknown;
    removeValue(key: string): unknown;
    requestAd(): Promise<unknown>;
    requestRewardAd(): Promise<boolean>;
    gameReady(): void;
    getShopItems(): Promise<AnyRecord[]>;
    openPurchaseConfirmModal(item: AnyRecord): Promise<AnyRecord>;
    getPurchasedShopItems(): Promise<AnyRecord[]>;
}
declare global {
    interface Window {
        PortalSDK?: PortalSdk;
    }
}
declare class PortalPlatformBridge extends PlatformBridgeBase {
    get platformId(): PlatformId;
    get isPaymentsSupported(): boolean;
    get platformLanguage(): string;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    initialize(): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showInterstitial(): void;
    showRewarded(): void;
    sendMessage(message?: unknown, options?: unknown): Promise<unknown>;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
}
export default PortalPlatformBridge;
