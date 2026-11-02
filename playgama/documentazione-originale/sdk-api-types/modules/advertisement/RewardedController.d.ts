import { type RewardedState } from './constants';
import type { AdvertisementBridgeContract, AnalyticsSender } from './types';
declare class RewardedController {
    #private;
    get isSupported(): boolean;
    get state(): RewardedState;
    get placement(): string | null;
    get isInProgress(): boolean;
    constructor(bridge: AdvertisementBridgeContract, analytics: AnalyticsSender, onStateChange: (state: RewardedState) => void);
    preload(placement?: string | null): void;
    show(placement?: string | null): void;
}
export default RewardedController;
