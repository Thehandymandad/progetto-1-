import SocialModule from './SocialModule';
export type { SocialBridgeContract, SocialOptions, SocialConfig, SocialMethod, SocialContentMapping, ShareMapping, InviteMapping, PostMapping, PostRewardConfig, PostReward, } from './types';
export { POST_REWARD_TYPE } from './constants';
export { getSocialPlatformData, getSocialContent, getPostPlatformData, getPostRewards, } from './helpers';
declare const _default: SocialModule;
export default _default;
