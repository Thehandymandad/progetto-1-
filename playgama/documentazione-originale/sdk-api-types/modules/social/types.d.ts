import type { PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import type { AnyRecord } from '../../utils';
import type { PostRewardType } from './constants';
export type SocialMethod = 'share' | 'inviteFriends' | 'joinCommunity' | 'createPost';
export interface SocialOptions extends AnyRecord {
    text?: string;
    image?: string;
    url?: string;
}
export interface PostRewardConfig {
    id: string;
    amount: number;
    type?: PostRewardType;
}
export interface PostLaunchOptions {
    id?: string;
    payload?: string;
}
export interface PostReward {
    id: string;
    amount: number;
    type: PostRewardType;
}
export interface SocialContentMapping extends AnyRecord {
    id: string;
    text?: string;
    image?: string;
    url?: string;
}
export type ShareMapping = SocialContentMapping;
export type InviteMapping = SocialContentMapping;
export interface PostMapping extends SocialContentMapping {
    rewards?: PostRewardConfig[];
    rewardCooldown?: number;
}
export type SocialMethodConfig = SocialOptions;
export interface SocialConfig {
    share?: SocialMethodConfig;
    inviteFriends?: SocialMethodConfig;
    joinCommunity?: SocialMethodConfig;
    createPost?: SocialMethodConfig;
    shares?: ShareMapping[];
    invites?: InviteMapping[];
    posts?: PostMapping[];
}
export interface SocialBridgeOptions extends AnyRecord {
    social?: SocialConfig;
}
export interface SocialBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    options: SocialBridgeOptions;
    isInviteFriendsSupported: boolean;
    isJoinCommunitySupported: boolean;
    isShareSupported: boolean;
    isCreatePostSupported: boolean;
    isAddToHomeScreenSupported: boolean;
    isAddToHomeScreenRewardSupported: boolean;
    isAddToFavoritesSupported: boolean;
    isAddToFavoritesRewardSupported: boolean;
    isRateSupported: boolean;
    isPostRewardSupported: boolean;
    launchPostId: string | null;
    inviteFriends(data?: AnyRecord): Promise<unknown>;
    joinCommunity(data?: AnyRecord): Promise<unknown>;
    share(data?: AnyRecord): Promise<unknown>;
    createPost(data?: AnyRecord, post?: PostLaunchOptions): Promise<unknown>;
    addToHomeScreen(): Promise<unknown>;
    getAddToHomeScreenReward(): Promise<unknown>;
    addToFavorites(): Promise<unknown>;
    getAddToFavoritesReward(): Promise<unknown>;
    rate(): Promise<unknown>;
    getPostVisitReward(cooldown?: number): Promise<unknown>;
    getPostAuthorReward(): Promise<Record<string, number>>;
}
