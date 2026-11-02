import { type BannerPosition, type BannerState } from './constants';
import type { AdvertisementBridgeContract, AnalyticsSender } from './types';
declare class BannerController {
    #private;
    get isSupported(): boolean;
    get state(): BannerState;
    constructor(bridge: AdvertisementBridgeContract, analytics: AnalyticsSender);
    show(position?: BannerPosition, placement?: string | null): void;
    hide(): void;
}
export default BannerController;
