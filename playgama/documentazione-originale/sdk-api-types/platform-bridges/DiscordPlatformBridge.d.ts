import PlatformBridgeBase from './PlatformBridgeBase';
import { type AnyRecord } from '../utils';
import { type PlatformId } from '../modules/platform/constants';
interface DiscordPurchase {
    id: string | number;
    purchaseToken?: string;
    [key: string]: unknown;
}
interface DiscordSku {
    id: string;
    name: string;
    price: {
        currency?: string;
    };
}
interface DiscordSdkInstance {
    channelId: string | null;
    ready(): Promise<unknown>;
    commands: {
        authorize(options: AnyRecord): Promise<{
            code: string;
        }>;
        authenticate(options: {
            access_token: string;
        }): Promise<unknown>;
        startPurchase(options: {
            sku_id: string;
        }): Promise<unknown>;
        getSkus(): Promise<{
            skus: DiscordSku[];
        }>;
        getEntitlements(): Promise<{
            entitlements: DiscordPurchase[];
        }>;
        openInviteDialog(): Promise<unknown>;
        openShareMomentDialog(options: AnyRecord & {
            mediaUrl: string;
        }): Promise<unknown>;
    };
}
interface DiscordGlobal {
    DiscordSDK: new (appId: string) => DiscordSdkInstance;
    PriceUtils: {
        formatPrice(price: {
            currency?: string;
        } | undefined): string;
    };
}
declare global {
    interface Window {
        discord?: DiscordGlobal;
    }
}
declare class DiscordPlatformBridge extends PlatformBridgeBase {
    get platformId(): PlatformId;
    get isPlayerAuthorizationSupported(): boolean;
    get isPaymentsSupported(): boolean;
    get isInviteFriendsSupported(): boolean;
    get isShareSupported(): boolean;
    protected _appId: string | null;
    protected _accessToken: string | null;
    initialize(): Promise<unknown>;
    authorizePlayer(options?: unknown): Promise<unknown>;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsConsumePurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
    inviteFriends(): Promise<unknown>;
    share(options?: unknown): Promise<unknown>;
}
export default DiscordPlatformBridge;
