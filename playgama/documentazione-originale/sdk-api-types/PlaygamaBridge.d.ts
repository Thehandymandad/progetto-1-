import { MODULE_NAME, EVENT_NAME, LAUNCH_SOURCE } from './constants';
import { PLATFORM_ID, PLATFORM_MESSAGE } from './modules/platform/constants';
import { DEVICE_TYPE, DEVICE_ORIENTATION } from './modules/device/constants';
import { INTERSTITIAL_STATE, REWARDED_STATE, BANNER_STATE } from './modules/advertisement/constants';
import platformModule from './modules/platform';
import playerModule from './modules/player';
import storageModule from './modules/storage';
import advertisementModule from './modules/advertisement';
import socialModule from './modules/social';
import deviceModule from './modules/device';
import leaderboardsModule from './modules/leaderboards';
import paymentsModule from './modules/payments';
import remoteConfigModule from './modules/remote-config';
import clipboardModule from './modules/clipboard';
import achievementsModule from './modules/achievements';
import notificationsModule from './modules/notifications';
import dailyRewardsModule from './modules/daily-rewards';
import tasksModule from './modules/tasks';
import crossPromoModule from './modules/cross-promo';
import multiplayerModule from './modules/multiplayer';
import analyticsModule from './modules/analytics';
import type { EventEmitter } from './lib/EventBus';
export interface PlaygamaInitOptions {
    configFilePath?: string;
    [key: string]: unknown;
}
interface PlaygamaBridge extends EventEmitter {
}
declare class PlaygamaBridge {
    #private;
    get version(): string;
    get isInitialized(): boolean;
    get options(): unknown;
    get platform(): typeof platformModule;
    get player(): typeof playerModule;
    get storage(): typeof storageModule;
    get advertisement(): typeof advertisementModule;
    get social(): typeof socialModule;
    get device(): typeof deviceModule;
    get leaderboards(): typeof leaderboardsModule;
    get payments(): typeof paymentsModule;
    get achievements(): typeof achievementsModule;
    get remoteConfig(): typeof remoteConfigModule;
    get clipboard(): typeof clipboardModule;
    get notifications(): typeof notificationsModule;
    get analytics(): typeof analyticsModule;
    get dailyRewards(): typeof dailyRewardsModule;
    get tasks(): typeof tasksModule;
    get crossPromo(): typeof crossPromoModule;
    get multiplayer(): typeof multiplayerModule;
    get engine(): string;
    set engine(value: string);
    set gameVersion(value: string | null);
    readonly PLATFORM_ID: typeof PLATFORM_ID;
    readonly PLATFORM_MESSAGE: typeof PLATFORM_MESSAGE;
    readonly MODULE_NAME: typeof MODULE_NAME;
    readonly EVENT_NAME: typeof EVENT_NAME;
    readonly INTERSTITIAL_STATE: typeof INTERSTITIAL_STATE;
    readonly REWARDED_STATE: typeof REWARDED_STATE;
    readonly BANNER_STATE: typeof BANNER_STATE;
    readonly DEVICE_TYPE: typeof DEVICE_TYPE;
    readonly DEVICE_ORIENTATION: typeof DEVICE_ORIENTATION;
    readonly LAUNCH_SOURCE: typeof LAUNCH_SOURCE;
    initialize(options?: PlaygamaInitOptions): Promise<void>;
    setGameLoadingProgress(percent: number): void;
}
export default PlaygamaBridge;
