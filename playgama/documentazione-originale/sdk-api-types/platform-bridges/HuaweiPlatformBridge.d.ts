import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
interface HuaweiSystem {
    onmessage: ((event: string) => void) | null;
    postMessage(message: unknown): void;
}
declare global {
    interface Window {
        system?: HuaweiSystem;
    }
}
declare class HuaweiPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isPlayerAuthorizationSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isPaymentsSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    protected _isPlatformStorageAvailable: boolean;
    initialize(): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showInterstitial(placementId?: unknown): void;
    showRewarded(placementId?: unknown): void;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
}
export default HuaweiPlatformBridge;
