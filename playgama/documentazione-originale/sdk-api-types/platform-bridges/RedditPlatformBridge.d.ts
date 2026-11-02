import PlatformBridgeBase from './PlatformBridgeBase';
import { type LaunchSource } from '../constants';
import { type PlatformId } from '../modules/platform/constants';
import { type LeaderboardType } from '../modules/leaderboards/constants';
import type { PostLaunchOptions } from '../modules/social/types';
declare global {
    interface Window {
        __playgama_devvit?: {
            purchase: (id: string) => Promise<unknown> | unknown;
        };
    }
}
declare class RedditPlatformBridge extends PlatformBridgeBase {
    #private;
    get platformId(): PlatformId;
    get launchSource(): LaunchSource | null;
    get platformPayload(): string | null;
    get isPlatformExternalCallsSupported(): boolean;
    get isJoinCommunitySupported(): boolean;
    get isShareSupported(): boolean;
    get isCreatePostSupported(): boolean;
    get isPostRewardSupported(): boolean;
    get leaderboardsType(): LeaderboardType;
    get isPaymentsSupported(): boolean;
    initialize(): Promise<unknown>;
    getServerTime(): Promise<number>;
    getDataFromStorage(keys: string[]): Promise<Record<string, unknown>>;
    setDataToStorage(data: Record<string, unknown>): Promise<void>;
    deleteDataFromStorage(keys: string[]): Promise<void>;
    checkAdBlock(): Promise<boolean>;
    paymentsPurchase(id: string): Promise<unknown>;
    paymentsGetCatalog(): Promise<unknown>;
    paymentsGetPurchases(): Promise<unknown>;
    share(options?: unknown): Promise<unknown>;
    createPost(options?: unknown, post?: PostLaunchOptions): Promise<unknown>;
    joinCommunity(): Promise<unknown>;
    getPostVisitReward(cooldown?: number): Promise<unknown>;
    getPostAuthorReward(): Promise<Record<string, number>>;
    leaderboardsSetScore(id: string, score: number, isMain: boolean): Promise<unknown>;
    leaderboardsGetEntries(id: string): Promise<unknown>;
}
export default RedditPlatformBridge;
