import PlaygamaPlatformBridge from './PlaygamaPlatformBridge';
import { type PlatformId } from '../modules/platform/constants';
declare class StandalonePlatformBridge extends PlaygamaPlatformBridge {
    #private;
    get platformId(): PlatformId;
    get sdkUrl(): string;
    get sdkGlobalName(): string;
    get isMinimumDelayBetweenInterstitialEnabled(): boolean;
    get isInitialInterstitialDelayEnabled(): boolean;
    get isPlatformExternalLinksAllowed(): boolean;
    protected _isAdvancedBannersSupported: boolean;
    paymentsGetCatalog(): Promise<unknown>;
    protected _configureAdFrequency(): Promise<void>;
}
export default StandalonePlatformBridge;
