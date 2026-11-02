import type { AnyRecord } from '../../utils';
import type { AdvertisementOptions } from '../../modules/advertisement/types';
import type { DailyRewardsConfig } from '../../modules/daily-rewards/types';
import type { TasksConfig } from '../../modules/tasks/types';
import type { AchievementMapping } from '../../modules/achievements/types';
import type { CrossPromoConfig } from '../../modules/cross-promo/types';
import type { LeaderboardMapping } from '../../modules/leaderboards';
import type { SocialConfig } from '../../modules/social/types';
import type { NotificationMapping } from '../../modules/notifications/types';
import type { DeviceConfig } from '../../modules/device';
import type { MultiplayerConfig } from '../../modules/multiplayer/types';
import type { LoadingScreenType, LoadingLogoType } from '../loading-screen';
import type { YoutubeSubscribeButtonType } from '../../platform-bridges/YoutubePlatformBridge';
export interface SaasFeatureConfig {
    platforms?: string[];
}
export interface SaasConfig {
    baseUrl?: string;
    publicToken?: string;
    [feature: string]: SaasFeatureConfig | string | undefined;
}
export interface GameConfig {
    adaptToSafeArea?: boolean;
    [key: string]: unknown;
}
export interface VideoPreview {
    image: string;
    videoId: string;
}
export interface LoadingSoundConfig {
    url: string;
}
export interface ConfigFileOptions extends AnyRecord {
    platforms?: Record<string, ConfigFileOptions>;
    debug?: boolean;
    forciblySetPlatformId?: string;
    remoteConfigUrl?: string;
    remoteConfigTimeout?: number;
    remoteConfigTtl?: number;
    sendAnalyticsEvents?: boolean;
    loadingScreenType?: LoadingScreenType;
    loadingLogoType?: LoadingLogoType;
    showLoadingText?: boolean;
    disableLoadingLogo?: boolean;
    showFullLoadingLogo?: boolean;
    loadingSound?: LoadingSoundConfig;
    game?: GameConfig;
    advertisement?: AdvertisementOptions;
    dailyRewards?: DailyRewardsConfig;
    tasks?: TasksConfig;
    achievements?: AchievementMapping[];
    leaderboards?: LeaderboardMapping[];
    social?: SocialConfig;
    notifications?: NotificationMapping[];
    disableAutoNotifications?: boolean;
    device?: DeviceConfig;
    crossPromo?: CrossPromoConfig;
    saas?: SaasConfig;
    payments?: Array<AnyRecord & {
        id: string;
    }>;
    videoPreviews?: VideoPreview[];
    youtubeSubscribeButtonType?: YoutubeSubscribeButtonType;
    youtubeSubscribeButtonColor?: string;
    youtubeSubscribeButtonTextColor?: string;
    multiplayer?: MultiplayerConfig;
}
