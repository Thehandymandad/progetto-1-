import ModuleBase from '../ModuleBase';
import { type BannerPosition, type BannerState, type InterstitialState, type RewardedState } from './constants';
import type { AdvertisementBridgeContract } from './types';
import type { EventEmitter } from '../../lib/EventBus';
interface AdvertisementModule extends EventEmitter {
}
declare class AdvertisementModule extends ModuleBase<AdvertisementBridgeContract> {
    #private;
    get isBannerSupported(): boolean;
    get bannerState(): BannerState;
    get isInterstitialSupported(): boolean;
    get interstitialState(): InterstitialState;
    get isRewardedSupported(): boolean;
    get rewardedPlacement(): string | null;
    get rewardedState(): RewardedState;
    get minimumDelayBetweenInterstitial(): number;
    get isAdvancedBannersSupported(): boolean;
    get advancedBannersState(): BannerState;
    initialize(platformBridge: AdvertisementBridgeContract): this;
    setMinimumDelayBetweenInterstitial(value: unknown): void;
    showBanner(position?: BannerPosition, placement?: string | null): void;
    hideBanner(): void;
    preloadInterstitial(placement?: string | null): void;
    showInterstitial(placement?: string | null): void;
    preloadRewarded(placement?: string | null): void;
    showRewarded(placement?: string | null): void;
    showAdvancedBanners(placement: string | null): void;
    hideAdvancedBanners(): void;
    checkAdBlock(): Promise<unknown>;
}
export default AdvertisementModule;
