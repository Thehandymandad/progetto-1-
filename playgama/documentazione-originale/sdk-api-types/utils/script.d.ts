import type { AnyRecord } from './object';
interface AdsByGoogleOptions {
    adSenseId: string;
    channelId?: string;
    hostId?: string;
    interstitialPlacementId?: string;
    rewardedPlacementId?: string;
    adFrequencyHint?: string;
    testMode?: boolean;
}
type AdsByGooglePush = (adOptions: AnyRecord) => unknown;
export declare const addJavaScript: (src: string, options?: Record<string, string>) => Promise<Event>;
export declare const addAdsByGoogle: ({ adSenseId, channelId, hostId, interstitialPlacementId, rewardedPlacementId, adFrequencyHint, testMode, }: AdsByGoogleOptions, config?: AnyRecord) => Promise<AdsByGooglePush>;
export {};
