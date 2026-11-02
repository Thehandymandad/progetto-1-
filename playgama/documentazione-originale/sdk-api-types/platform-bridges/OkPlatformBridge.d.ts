import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
type OkClientCallback = (status: string, data: AnyRecord, error?: unknown) => void;
interface OkSdk {
    Util: {
        getRequestParameters(): AnyRecord | null;
    };
    init(apiServer: string, apiConnection: string, onSuccess: () => void, onError: () => void): void;
    Client: {
        call(params: AnyRecord, callback: OkClientCallback): void;
    };
    UI: {
        showLoginSuggestion(state: string): void;
        showAd(): void;
        loadAd(): void;
        showLoadedAd(): void;
        showInvite(text: string): void;
        showRatingDialog(): void;
        joinGroup(groupId: string | number, enableMessages: boolean): void;
        showPermissions(permissions: string): void;
        postMediatopic(options: AnyRecord, status: boolean): void;
    };
    invokeUIMethod(method: string, ...args: unknown[]): void;
    saved_state?: string;
}
declare global {
    interface Window {
        FAPI?: OkSdk;
        API_callback?: (method: string, result: string, data: unknown) => void;
    }
}
declare class OkPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get isPlayerAuthorizationSupported(): boolean;
    get isBannerSupported(): boolean;
    get isInterstitialSupported(): boolean;
    get isRewardedSupported(): boolean;
    get isJoinCommunitySupported(): boolean;
    get isInviteFriendsSupported(): boolean;
    get isCreatePostSupported(): boolean;
    get isRateSupported(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    get isClipboardSupported(): boolean;
    protected _hasValuableAccessPermission: boolean;
    protected _hasValuableAccessPermissionShowed: boolean;
    protected _platformBannerOptions: AnyRecord;
    initialize(): Promise<unknown>;
    authorizePlayer(): Promise<unknown>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    showInterstitial(): void;
    showRewarded(): void;
    showBanner(position?: unknown): void;
    hideBanner(): void;
    checkAdBlock(): Promise<boolean>;
    inviteFriends(options?: {
        text?: string;
    }): Promise<unknown>;
    rate(): Promise<unknown>;
    createPost(options?: AnyRecord & {
        text?: string;
        url?: string;
        status?: boolean;
    }): Promise<unknown>;
    joinCommunity(options?: {
        groupId?: string | number;
        enableMessages?: boolean;
    }): Promise<unknown>;
}
export default OkPlatformBridge;
