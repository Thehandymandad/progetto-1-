import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
import { type DeviceType, type DeviceOs } from '../modules/device/constants';
import type { SafeAreaInsets } from '../lib/safe-area';
interface TikTokSystemInfo {
    language: string;
    platform: string;
    [key: string]: unknown;
}
interface TikTokRect {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}
interface TikTokSuccessFailCallbacks<T = unknown> {
    success?: (result: T) => void;
    fail?: (error: unknown) => void;
}
interface TikTokAd {
    onClose(callback: (res?: {
        isEnded?: boolean;
    }) => void): void;
    onError(callback: (error: unknown) => void): void;
    show(): Promise<unknown>;
}
interface TikTokSdk {
    canIUse(name: string): boolean;
    init(options: {
        clientKey: string;
    }): void;
    getSystemInfoSync(): TikTokSystemInfo;
    getMenuButtonBoundingClientRect(): TikTokRect;
    onShow(callback: () => void): void;
    onHide(callback: () => void): void;
    login(callbacks: TikTokSuccessFailCallbacks): void;
    setLoadingProgress(options: {
        progress: number;
    }): void;
    getStorage(options: {
        key: string;
    } & TikTokSuccessFailCallbacks<{
        data: unknown;
    }>): void;
    setStorage(options: {
        key: string;
        data: unknown;
    } & TikTokSuccessFailCallbacks): void;
    removeStorage(options: {
        key: string;
    } & TikTokSuccessFailCallbacks): void;
    createInterstitialAd(options: {
        adUnitId?: unknown;
    }): TikTokAd;
    createRewardedVideoAd(options: {
        adUnitId?: unknown;
    }): TikTokAd;
    addShortcut(callbacks: TikTokSuccessFailCallbacks): void;
    getShortcutMissionReward(callbacks: TikTokSuccessFailCallbacks<{
        canReceiveReward?: boolean;
    }>): void;
    startEntranceMission(callbacks: TikTokSuccessFailCallbacks): void;
    getEntranceMissionReward(callbacks: TikTokSuccessFailCallbacks<{
        canReceiveReward?: boolean;
    }>): void;
}
declare global {
    interface Window {
        TTMinis?: {
            game: TikTokSdk;
        };
    }
}
declare class TikTokPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get platformLanguage(): string;
    get isPlayerAuthorizationSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isAddToHomeScreenSupported(): boolean;
    get isAddToHomeScreenRewardSupported(): boolean;
    get isAddToFavoritesSupported(): boolean;
    get isAddToFavoritesRewardSupported(): boolean;
    get safeArea(): SafeAreaInsets | null;
    get deviceType(): DeviceType;
    get deviceOs(): DeviceOs;
    get isClipboardSupported(): boolean;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown, _options?: unknown): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showInterstitial(placement?: unknown): void;
    showRewarded(placement?: unknown): void;
    addToHomeScreen(): Promise<unknown>;
    getAddToHomeScreenReward(): Promise<unknown>;
    addToFavorites(): Promise<unknown>;
    getAddToFavoritesReward(): Promise<unknown>;
}
export default TikTokPlatformBridge;
