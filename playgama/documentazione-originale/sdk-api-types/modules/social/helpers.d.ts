import { type AnyRecord } from '../../utils';
import type { PlatformId } from '../platform/constants';
import { type PostRewardType } from './constants';
import type { SocialConfig, SocialMethod, SocialOptions, SocialContentMapping, PostMapping, PostReward } from './types';
export declare function getSocialPlatformData(social: SocialConfig | undefined, method: SocialMethod, runtimeOptions?: SocialOptions): AnyRecord;
export declare function getSocialContent(entries: SocialContentMapping[] | undefined, platformId: PlatformId, id: string): AnyRecord | null;
export declare function getPostPlatformData(posts: PostMapping[] | undefined, platformId: PlatformId, id: string): PostMapping | null;
export declare function getPostRewards(post: PostMapping | null, type: PostRewardType, count: number): PostReward[];
