import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import type { ScheduledNotification } from '../modules/notifications/types';
import { type LaunchSource } from '../constants';
import { type PlatformId } from '../modules/platform/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
interface MsnNotification {
    title: string;
    description: string;
    type: number;
    imageData?: string;
    payload?: string;
    minDelayInSeconds?: number;
    callToAction?: string;
}
interface MsnLoadAdsOptions {
    isRewardedAd: boolean;
    canBackfill: boolean;
}
interface MsnAdInstance {
    instanceId: string;
    showAdsCompletedAsync: Promise<unknown>;
}
interface MsnIap {
    purchaseAsync(params: {
        productId: string;
    }): Promise<{
        code?: string;
        description?: string;
        receipt: AnyRecord;
        receiptSignature: string;
    }>;
    consumeAsync(params: {
        productId: string;
    }): Promise<{
        code?: string;
        description?: string;
        consumptionReceipt: AnyRecord;
        consumptionSignature: string;
    }>;
    getAllAddOnsAsync(params: {
        productId: string;
    }): Promise<AnyRecord & {
        code?: string;
        description?: string;
    }>;
    getAllPurchasesAsync(params: {
        productId: string;
    }): Promise<{
        receipts: AnyRecord[];
        receiptSignature: string;
    }>;
}
interface MsnSdk {
    getSignedInUserAsync(): Promise<AnyRecord>;
    signInAsync(): Promise<AnyRecord>;
    scheduleNotificationAsync(notification: MsnNotification): Promise<unknown>;
    getNotificationPayload?(): string | undefined;
    cloudSave: {
        saveDataAsync(params: {
            data: AnyRecord;
            gameId: unknown;
        }): Promise<unknown>;
        getDataAsync(params: {
            gameId: unknown;
        }): Promise<AnyRecord>;
    };
    shareAsync(options: unknown): Promise<unknown>;
    promptInstallAsync(): Promise<string>;
    submitGameResultsAsync(score: unknown): Promise<unknown>;
    showDisplayAdsAsync(placements: string[]): Promise<unknown>;
    hideDisplayAdsAsync(): Promise<unknown>;
    loadAdsAsync(options: MsnLoadAdsOptions): Promise<MsnAdInstance>;
    showAdsAsync(instanceId: string): Promise<MsnAdInstance>;
    iap: MsnIap;
}
declare global {
    interface Window {
        $msstart?: MsnSdk;
    }
}
declare class MsnPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get launchSource(): LaunchSource | null;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isPlayerAuthorizationSupported(): boolean;
    get isShareSupported(): boolean;
    get isAddToHomeScreenSupported(): boolean;
    get leaderboardsType(): LeaderboardType;
    get isBannerSupported(): boolean;
    get isPaymentsSupported(): boolean;
    get isNotificationsSupported(): boolean;
    get platformPayload(): string | null;
    protected _isAdvancedBannersSupported: boolean;
    initialize(): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    share(options?: unknown): Promise<unknown>;
    addToHomeScreen(): Promise<unknown>;
    leaderboardsSetScore(_id?: unknown, score?: unknown): Promise<unknown>;
    notificationsSchedule(notification: ScheduledNotification, platformValue?: string | number): Promise<unknown>;
    showBanner(position?: unknown): void;
    hideBanner(): void;
    showAdvancedBanners(banners?: unknown): void;
    hideAdvancedBanners(): void;
    showInterstitial(): void;
    showRewarded(): void;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
}
export default MsnPlatformBridge;
