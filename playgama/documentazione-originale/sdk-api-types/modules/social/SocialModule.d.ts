import ModuleBase from '../ModuleBase';
import type { SocialBridgeContract, SocialOptions, PostReward } from './types';
declare class SocialModule extends ModuleBase<SocialBridgeContract> {
    #private;
    get isInviteFriendsSupported(): boolean;
    get isJoinCommunitySupported(): boolean;
    get isShareSupported(): boolean;
    get isCreatePostSupported(): boolean;
    get isAddToHomeScreenSupported(): boolean;
    get isAddToHomeScreenRewardSupported(): boolean;
    get isAddToFavoritesSupported(): boolean;
    get isAddToFavoritesRewardSupported(): boolean;
    get isRateSupported(): boolean;
    get isPostRewardSupported(): boolean;
    inviteFriends(options?: string | SocialOptions): Promise<unknown>;
    joinCommunity(options?: SocialOptions): Promise<unknown>;
    share(options?: string | SocialOptions): Promise<unknown>;
    createPost(options?: string | SocialOptions, payload?: string): Promise<unknown>;
    addToHomeScreen(): Promise<unknown>;
    getAddToHomeScreenReward(): Promise<unknown>;
    addToFavorites(): Promise<unknown>;
    getAddToFavoritesReward(): Promise<unknown>;
    rate(): Promise<unknown>;
    getPostReward(): Promise<PostReward[]>;
}
export default SocialModule;
