import { type BannerState } from './constants';
import type { AdvertisementBridgeContract, AdvertisementOptions, AnalyticsSender } from './types';
declare class AdvancedBannersController {
    #private;
    get isSupported(): boolean;
    get state(): BannerState;
    get options(): AdvertisementOptions['advancedBanners'];
    constructor(bridge: AdvertisementBridgeContract, analytics: AnalyticsSender, isAdInProgress: () => boolean);
    show(placement: string | null): void;
    hide(): void;
    tryShow(placement: string | null): void;
    hideByAd(): void;
    restoreAfterAd(): void;
}
export default AdvancedBannersController;
