import PlatformBridgeBase from './PlatformBridgeBase';
import { type PlatformId } from '../modules/platform/constants';
import { type DeviceType } from '../modules/device/constants';
import type { AnyRecord } from '../utils';
interface VkBridge {
    send(method: string, params?: AnyRecord): Promise<AnyRecord>;
}
declare global {
    interface Window {
        vkBridge?: VkBridge;
    }
}
declare class VkPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get platformLanguage(): string;
    get platformPayload(): string | null;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get deviceType(): DeviceType;
    get isPlayerAuthorizationSupported(): boolean;
    get isPlayerAuthorized(): boolean;
    get isInviteFriendsSupported(): boolean;
    get isJoinCommunitySupported(): boolean;
    get isShareSupported(): boolean;
    get isAddToHomeScreenSupported(): boolean;
    get isAddToFavoritesSupported(): boolean;
    protected _isBannerSupported: boolean;
    initialize(): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showBanner(position?: unknown): void;
    hideBanner(): void;
    showInterstitial(): void;
    showRewarded(): void;
    inviteFriends(): Promise<unknown>;
    joinCommunity(options?: AnyRecord & {
        groupId?: string | number;
    }): Promise<unknown>;
    share(options?: AnyRecord & {
        url?: string;
    }): Promise<unknown>;
    addToHomeScreen(): Promise<unknown>;
    addToFavorites(): Promise<unknown>;
    clipboardWrite(text: string): Promise<void>;
}
export default VkPlatformBridge;
