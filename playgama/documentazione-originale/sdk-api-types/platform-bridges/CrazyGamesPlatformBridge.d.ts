import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
import { type DeviceType } from '../modules/device/constants';
interface CrazyGamesUser {
    username?: string;
    profilePictureUrl?: string;
    [key: string]: unknown;
}
interface CrazyGamesAdCallbacks {
    adStarted: () => void;
    adFinished: () => void;
    adError: () => void;
}
interface CrazyGamesSdk {
    init(): Promise<unknown>;
    user: {
        isUserAccountAvailable: boolean;
        systemInfo: {
            countryCode: string;
            device: {
                type: string;
            };
        };
        getUser(): Promise<CrazyGamesUser | null>;
        getUserToken(): Promise<string>;
        getXsollaUserToken(): Promise<string>;
        showAuthPrompt(): Promise<unknown>;
    };
    data: {
        getItem(key: string): string | null;
        setItem(key: string, value: string): void;
        removeItem(key: string): void;
    };
    banner: {
        requestResponsiveBanner(containers: string | string[]): Promise<unknown>;
        clearAllBanners(): void;
    };
    ad: {
        requestAd(type: string, callbacks: CrazyGamesAdCallbacks): void;
        hasAdblock(): Promise<boolean>;
    };
    game: {
        loadingStart(): void;
        loadingStop(): void;
        gameplayStart(): void;
        gameplayStop(): void;
        happytime(): void;
        addSettingsChangeListener(callback: (settings: {
            muteAudio: boolean;
        }) => void): void;
        settings: {
            muteAudio: boolean;
        };
    };
    analytics: {
        trackOrder(provider: string, order: AnyRecord): void;
    };
}
interface XsollaPayStation {
    init(config: AnyRecord): void;
    on(event: string, callback: (...args: unknown[]) => void): void;
    open(): void;
    eventTypes: {
        STATUS: string;
        [key: string]: string;
    };
}
declare global {
    interface Window {
        CrazyGames?: {
            SDK: CrazyGamesSdk;
        };
        XPayStationWidget?: XsollaPayStation;
    }
}
declare class CrazyGamesPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get platformLanguage(): string;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isPlayerAuthorizationSupported(): boolean;
    get isPaymentsSupported(): boolean;
    get deviceType(): DeviceType;
    initialize(): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    sendMessage(message?: unknown): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showBanner(position?: unknown): void;
    hideBanner(): void;
    showAdvancedBanners(banners?: unknown): void;
    hideAdvancedBanners(): void;
    showInterstitial(): void;
    showRewarded(): void;
    checkAdBlock(): Promise<boolean>;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
}
export default CrazyGamesPlatformBridge;
