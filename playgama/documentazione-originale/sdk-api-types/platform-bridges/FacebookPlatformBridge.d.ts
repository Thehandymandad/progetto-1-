import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
import { type DeviceType } from '../modules/device/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
interface FacebookAd {
    loadAsync(): Promise<unknown>;
    showAsync(): Promise<unknown>;
}
interface FacebookOverlayView {
    showAsync(): Promise<unknown>;
    dismissAsync(): Promise<unknown>;
    iframeElement: HTMLIFrameElement;
}
interface FacebookOverlayHandle {
    iframeElement: HTMLIFrameElement;
}
interface FacebookLeaderboardEntry {
    getScore(): number;
    getPlayer(): {
        getSessionID(): string;
    };
}
interface FacebookCatalogProduct {
    productID: string;
    title: string;
    description: string;
    imageURI: string;
    price: string;
    priceCurrencyCode: string;
    priceAmount: number;
}
interface FacebookPurchase {
    productID: string;
    purchaseToken: string;
    [key: string]: unknown;
}
interface FacebookSdk {
    initializeAsync(): Promise<unknown>;
    setLoadingProgress(value: number): void;
    startGameAsync(): Promise<unknown>;
    getLocale(): string;
    getSupportedAPIs(): string[];
    getPlatform(): string;
    player: {
        getID(): string;
        getDataAsync(keys: string[]): Promise<Record<string, unknown>>;
        setDataAsync(data: Record<string, unknown>): Promise<unknown>;
        isSubscribedBotAsync(): Promise<boolean>;
        canSubscribeBotAsync(): Promise<boolean>;
        subscribeBotAsync(): Promise<unknown>;
    };
    context: {
        getID(): string;
    };
    community: {
        canFollowOfficialPageAsync(): Promise<boolean>;
        canJoinOfficialGroupAsync(): Promise<boolean>;
        followOfficialPageAsync(): Promise<unknown>;
        joinOfficialGroupAsync(): Promise<unknown>;
    };
    loadBannerAdAsync(placement: unknown, position: unknown): Promise<unknown>;
    hideBannerAdAsync(): Promise<unknown>;
    getInterstitialAdAsync(placement: unknown): Promise<FacebookAd>;
    getRewardedVideoAsync(placement: unknown): Promise<FacebookAd>;
    globalLeaderboards: {
        setScoreAsync(id: unknown, score: number): Promise<unknown>;
        getTopEntriesAsync(id: unknown, count: number): Promise<FacebookLeaderboardEntry[]>;
    };
    overlayViews: {
        setCustomEventHandler(handler: (event: string) => void): void;
        createOverlayViewWithXMLString(xml: string, id: string, data: AnyRecord, onSuccess: (overlayView: FacebookOverlayView) => void, onError: (overlayView: unknown, error: unknown) => void): FacebookOverlayHandle;
    };
    payments: {
        purchaseAsync(options: {
            productID: string;
        }): Promise<FacebookPurchase>;
        consumePurchaseAsync(token: string): Promise<unknown>;
        getCatalogAsync(): Promise<FacebookCatalogProduct[]>;
        getPurchasesAsync(): Promise<FacebookPurchase[]>;
    };
    inviteAsync(options: AnyRecord): Promise<unknown>;
    shareAsync(options: AnyRecord): Promise<unknown>;
}
declare global {
    interface Window {
        FBInstant?: FacebookSdk;
    }
}
declare class FacebookPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get platformLanguage(): string;
    get isPlatformExternalCallsSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get deviceType(): DeviceType;
    get isPlayerAuthorizationSupported(): boolean;
    get isBannerSupported(): boolean;
    get leaderboardsType(): LeaderboardType;
    get isPaymentsSupported(): boolean;
    get isInviteFriendsSupported(): boolean;
    get isJoinCommunitySupported(): boolean;
    get isShareSupported(): boolean;
    protected _platformLanguage: string | null;
    protected _contextId: string | null;
    protected _supportedApis: string[];
    protected _preloadedInterstitialPromises: Record<string, Promise<FacebookAd> | null>;
    protected _preloadedRewardedPromises: Record<string, Promise<FacebookAd> | null>;
    protected _isPlatformStorageAvailable: boolean;
    protected _isJoinCommunitySupported: boolean;
    protected _overlay: FacebookOverlayView | null;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown, options?: unknown): Promise<unknown>;
    authorizePlayer(_options?: unknown): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showBanner(position?: unknown, placement?: unknown): void;
    hideBanner(): void;
    preloadInterstitial(placement?: unknown): void;
    showInterstitial(placement?: unknown): void;
    preloadRewarded(placement?: unknown): void;
    showRewarded(placement?: unknown): void;
    leaderboardsSetScore(id?: unknown, score?: unknown): Promise<unknown>;
    leaderboardsShowNativePopup(id?: unknown): Promise<unknown>;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
    inviteFriends(options?: unknown): Promise<unknown>;
    joinCommunity(options?: unknown): Promise<unknown>;
    share(options?: unknown): Promise<unknown>;
}
export default FacebookPlatformBridge;
