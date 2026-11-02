import { type InterstitialState } from './constants';
import type { AdvertisementBridgeContract, AnalyticsSender } from './types';
declare class InterstitialController {
    #private;
    get isSupported(): boolean;
    get state(): InterstitialState;
    get minimumDelayBetweenInterstitial(): number;
    get isInProgress(): boolean;
    constructor(bridge: AdvertisementBridgeContract, analytics: AnalyticsSender, onStateChange: (state: InterstitialState) => void);
    preload(placement?: string | null): void;
    show(placement?: string | null): void;
    setMinimumDelay(value: unknown): void;
}
export default InterstitialController;
