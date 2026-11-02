import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
import type { WriteBatch } from '../modules/storage/types';
import type { PostLaunchOptions } from '../modules/social/types';
type AdType = 'interstitial' | 'rewarded';
type AdState = 'open' | 'empty' | 'rewarded' | 'close' | 'error' | string;
type AdResponseDetails = {
    reason?: string;
    retryAfterMs?: number;
};
interface PlaygamaPlayer {
    isAuthorized: boolean;
    id: string;
    name: string;
    photos: string[];
    [key: string]: unknown;
}
interface PlaygamaPurchase {
    status: string;
    orderId?: string;
    error?: unknown;
    [key: string]: unknown;
}
interface PlaygamaProductData extends AnyRecord {
    id: string;
    externalId?: string;
    bridgeId?: string;
}
interface PlaygamaCatalogProduct {
    id: string;
    amount?: number;
    currency?: string;
    price: string;
    priceValue: number;
    priceCurrencyCode: string;
    priceCurrencyImage?: string;
}
interface PlaygamaRoomInvite extends AnyRecord {
    roomId: string;
    type: string;
}
interface PlaygamaRoomStatus {
    id: string;
    type: string;
    maxPlayers: number;
    playerCount: number;
    isOpen: boolean;
    isVisible: boolean;
}
interface PlaygamaSdk {
    platformService: {
        getLanguage(): string;
        isReady?: Promise<unknown>;
        getIsPaymentsSupported?: () => boolean;
        getIsPlayerAuthorizationSupported?: () => boolean;
        getIsCloudSaveSupported?: () => boolean;
        getAdditionalParams?: () => Record<string, unknown> | null;
        getPayload?: () => string | null;
    };
    advService: {
        configureAdFrequency?: () => Promise<boolean>;
        subscribeToAdStateChanges(callback: (adType: AdType, state: AdState, details?: AdResponseDetails) => void): void;
        showInterstitial(): void;
        showRewarded(): void;
        showAdvancedBanners(banners: unknown): Promise<unknown>;
        hideAdvancedBanners(): void;
        checkAdBlock(): Promise<boolean>;
    };
    userService: {
        getUser(): Promise<PlaygamaPlayer>;
        authorizeUser(): Promise<unknown>;
    };
    cloudSaveApi: {
        getState(): Promise<AnyRecord>;
        setItems(data: AnyRecord): Promise<unknown>;
    };
    storageApi?: {
        setItems?(data: AnyRecord): unknown;
        deleteItems?(keys: string[]): unknown;
    };
    inGamePaymentsApi: {
        purchase(product: PlaygamaProductData): Promise<PlaygamaPurchase>;
        getCatalog?: (products: PlaygamaProductData[]) => Promise<PlaygamaCatalogProduct[]>;
        getPurchases?: () => Promise<Array<AnyRecord & {
            id: string;
            bridgeId?: string;
        }>>;
        consumePurchase?: (orderId: string | undefined, externalId: string | undefined) => Promise<unknown>;
        confirmDelivery?: (params: {
            orderId?: string;
            externalId?: string;
        }) => Promise<unknown>;
    };
    gameService: {
        gameReady(): void;
        sendMessage?: (message: string, options?: AnyRecord) => unknown;
    };
    socialService?: {
        getIsShareSupported?: () => boolean;
        share?: (options?: AnyRecord) => Promise<unknown>;
        getIsInviteFriendsSupported?: () => boolean;
        inviteFriends?: (options?: AnyRecord) => Promise<unknown>;
        getIsJoinCommunitySupported?: () => boolean;
        joinCommunity?: (options?: AnyRecord) => Promise<unknown>;
        getIsCreatePostSupported?: () => boolean;
        createPost?: (options?: AnyRecord, post?: PostLaunchOptions) => Promise<unknown>;
        getIsAddToHomeScreenSupported?: () => boolean;
        addToHomeScreen?: () => Promise<unknown>;
        getIsAddToHomeScreenRewardSupported?: () => boolean;
        getAddToHomeScreenReward?: () => Promise<unknown>;
        getIsAddToFavoritesSupported?: () => boolean;
        addToFavorites?: () => Promise<unknown>;
        getIsAddToFavoritesRewardSupported?: () => boolean;
        getAddToFavoritesReward?: () => Promise<unknown>;
        getIsRateSupported?: () => boolean;
        rate?: () => Promise<unknown>;
    };
    multiplayerService?: {
        getIsInviteToRoomSupported?: () => boolean;
        inviteToRoom?: (invite: PlaygamaRoomInvite) => Promise<unknown>;
        getLaunchRoomId?: () => string | null;
        setCurrentRoom?: (room: PlaygamaRoomStatus | null) => void;
    };
}
declare global {
    interface Window {
        PLAYGAMA_SDK?: PlaygamaSdk;
    }
}
declare class PlaygamaPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get sdkUrl(): string;
    get sdkGlobalName(): string;
    get isInterstitialSupported(): boolean;
    get isMinimumDelayBetweenInterstitialEnabled(): boolean;
    get isInitialInterstitialDelayEnabled(): boolean;
    get isRewardedSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    get isShareSupported(): boolean;
    get isInviteFriendsSupported(): boolean;
    get isJoinCommunitySupported(): boolean;
    get isCreatePostSupported(): boolean;
    get isAddToHomeScreenSupported(): boolean;
    get isAddToHomeScreenRewardSupported(): boolean;
    get isAddToFavoritesSupported(): boolean;
    get isAddToFavoritesRewardSupported(): boolean;
    get isRateSupported(): boolean;
    get isMultiplayerRoomInviteSupported(): boolean;
    get multiplayerLaunchRoomId(): string | null;
    get isPlayerAuthorizationSupported(): boolean;
    get isPaymentsSupported(): boolean;
    get platformLanguage(): string;
    get platformPayload(): string | null;
    protected _isAdvancedBannersSupported: boolean;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown, options?: unknown): Promise<unknown>;
    getDataFromStorage(): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    notifyLocalDataChanged(batch: WriteBatch): void;
    showInterstitial(): void;
    showRewarded(): void;
    showAdvancedBanners(banners?: unknown): void;
    hideAdvancedBanners(): void;
    checkAdBlock(): Promise<boolean>;
    authorizePlayer(options?: unknown): Promise<unknown>;
    paymentsPurchase(id: string, options?: {
        externalId?: string;
    }): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    share(options?: AnyRecord): Promise<unknown>;
    inviteFriends(options?: AnyRecord): Promise<unknown>;
    joinCommunity(options?: AnyRecord): Promise<unknown>;
    createPost(options?: AnyRecord, post?: PostLaunchOptions): Promise<unknown>;
    addToHomeScreen(): Promise<unknown>;
    getAddToHomeScreenReward(): Promise<unknown>;
    addToFavorites(): Promise<unknown>;
    getAddToFavoritesReward(): Promise<unknown>;
    rate(): Promise<unknown>;
    multiplayerInviteToRoom(invite: PlaygamaRoomInvite): Promise<unknown>;
    notifyMultiplayerRoomChanged(room: PlaygamaRoomStatus | null): void;
    protected _configureAdFrequency(): Promise<void>;
}
export default PlaygamaPlatformBridge;
