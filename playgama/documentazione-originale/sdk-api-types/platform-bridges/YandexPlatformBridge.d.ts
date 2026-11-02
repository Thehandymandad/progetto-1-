import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
import { type DeviceType } from '../modules/device/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
interface YandexPlayer {
    getUniqueID(): string;
    isAuthorized(): boolean;
    getName(): string;
    getPhoto(size: 'small' | 'medium' | 'large'): string | null;
    getPayingStatus(): string;
    getData(): Promise<AnyRecord>;
    setData(data: AnyRecord): Promise<unknown>;
    signature?: string;
}
interface YandexPayments {
    purchase(product: AnyRecord): Promise<{
        purchaseData: AnyRecord & {
            productID?: string;
        };
    }>;
    consumePurchase(token: string): Promise<unknown>;
    getCatalog(): Promise<Array<AnyRecord & {
        id: string;
        getPriceCurrencyImage?: (size: string) => string;
    }>>;
    getPurchases(): Promise<Array<{
        productID: string;
        purchaseData: AnyRecord & {
            productID?: string;
        };
    }>>;
}
interface YandexLeaderboardEntry {
    score: number;
    rank: number;
    player: {
        uniqueID: string;
        publicName: string;
        getAvatarSrc(size: 'small' | 'medium' | 'large'): string;
    };
}
interface YandexLeaderboardOptions {
    quantityTop: number;
    includeUser?: boolean;
    quantityAround?: number;
}
interface YandexSdk {
    environment: {
        i18n: {
            lang: string;
            tld: string;
        };
    };
    deviceInfo: {
        type: string;
    };
    features: {
        PluginEngineDataReporterAPI?: {
            report(data: {
                engineName: string;
                engineVersion: string;
                pluginName: string;
                pluginVersion: string;
            }): Promise<unknown>;
        };
        LoadingAPI?: {
            ready(): void;
        };
        GameplayAPI?: {
            start(): void;
            stop(): void;
        };
        GamesAPI: {
            getAllGames(): Promise<{
                games: AnyRecord[];
            }>;
            getGameByID(gameId: string | number): Promise<{
                game: AnyRecord;
                isAvailable: boolean;
            }>;
        };
    };
    shortcut: {
        canShowPrompt(): Promise<{
            canShow: boolean;
        }>;
        showPrompt(): Promise<{
            outcome: string;
        }>;
    };
    getPayments(): Promise<YandexPayments>;
    adv: {
        getBannerAdvStatus(): Promise<{
            stickyAdvIsShowing?: boolean;
        }>;
        showBannerAdv(): Promise<{
            stickyAdvIsShowing?: boolean;
        }>;
        hideBannerAdv(): Promise<{
            stickyAdvIsShowing?: boolean;
        }>;
        showFullscreenAdv(options: {
            callbacks: AnyRecord;
        }): void;
        showRewardedVideo(options: {
            callbacks: AnyRecord;
        }): void;
    };
    on(event: string, callback: () => void): void;
    serverTime(): number;
    getPlayer(options: {
        signed: boolean;
    }): Promise<YandexPlayer>;
    auth: {
        openAuthDialog(): Promise<unknown>;
    };
    feedback: {
        canReview(): Promise<{
            value: boolean;
            reason?: unknown;
        }>;
        requestReview(): Promise<{
            feedbackSent: boolean;
        }>;
    };
    leaderboards: {
        setScore(id: string, score: number): Promise<unknown>;
        getEntries(id: string, options: YandexLeaderboardOptions): Promise<{
            entries: YandexLeaderboardEntry[];
        }>;
    };
    getFlags(options: AnyRecord): Promise<AnyRecord>;
    clipboard: {
        writeText(text: string): Promise<unknown>;
    };
}
declare global {
    interface Window {
        YaGames?: {
            init(): Promise<YandexSdk>;
        };
    }
}
declare class YandexPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get platformLanguage(): string;
    get platformTld(): string | null;
    get isPlatformGamesListSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get deviceType(): DeviceType;
    get isPlayerAuthorizationSupported(): boolean;
    get isAddToHomeScreenSupported(): boolean;
    get isRateSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    get leaderboardsType(): LeaderboardType;
    get isPaymentsSupported(): boolean;
    get isRemoteConfigSupported(): boolean;
    protected _isPlatformStorageAvailable: boolean;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown): Promise<unknown>;
    getServerTime(): Promise<number>;
    getGamesList(): Promise<unknown[]>;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showBanner(): void;
    hideBanner(): void;
    showInterstitial(): void;
    showRewarded(): void;
    checkAdBlock(): Promise<boolean>;
    addToHomeScreen(): Promise<unknown>;
    rate(): Promise<unknown>;
    leaderboardsSetScore(id: string, score: number): Promise<unknown>;
    leaderboardsGetEntries(id: string): Promise<unknown>;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
    getRemoteConfig(parameters?: AnyRecord): Promise<unknown>;
    clipboardWrite(text: string): Promise<void>;
}
export default YandexPlatformBridge;
