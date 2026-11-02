import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
import { type DeviceType, type DeviceOs } from '../modules/device/constants';
interface TelegramUser {
    id: number;
    first_name?: string;
    last_name?: string;
    photo_url?: string;
    language_code: string;
}
interface TelegramCloudStorage {
    getItem(key: string, callback: (error: unknown, value: string | null) => void): void;
    getItems(keys: string[], callback: (error: unknown, values: Record<string, string>) => void): void;
    getKeys(callback: (error: unknown, keys: string[]) => void): void;
    setItem(key: string, value: string, callback?: (error: unknown) => void): void;
    removeItem(key: string, callback?: (error: unknown) => void): void;
}
interface TelegramSdk {
    initDataUnsafe: {
        user: TelegramUser;
    };
    platform: string;
    ready(): void;
    CloudStorage: TelegramCloudStorage;
    readTextFromClipboard(callback: (text: string) => void): void;
}
interface AdsgramController {
    show(): Promise<unknown>;
    addEventListener(event: string, listener: () => void): void;
    removeEventListener(event: string, listener: () => void): void;
}
interface AdsgramSdk {
    init(options: {
        blockId: string;
    }): AdsgramController;
}
declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramSdk;
        };
        Adsgram?: AdsgramSdk;
    }
}
declare class TelegramPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get platformLanguage(): string;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get deviceType(): DeviceType;
    get deviceOs(): DeviceOs;
    get isPlayerAuthorizationSupported(): boolean;
    protected _isPlatformStorageAvailable: boolean;
    protected _isPlayerAuthorized: boolean;
    initialize(): Promise<unknown>;
    sendMessage(message?: unknown, options?: unknown): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showInterstitial(): void;
    showRewarded(): void;
    clipboardRead(): Promise<string>;
}
export default TelegramPlatformBridge;
