export declare const BANNER_POSITION: {
    readonly TOP: "top";
    readonly BOTTOM: "bottom";
};
export type BannerPosition = typeof BANNER_POSITION[keyof typeof BANNER_POSITION];
export declare const BANNER_STATE: {
    readonly LOADING: "loading";
    readonly SHOWN: "shown";
    readonly HIDDEN: "hidden";
    readonly FAILED: "failed";
};
export type BannerState = typeof BANNER_STATE[keyof typeof BANNER_STATE];
export declare const INTERSTITIAL_STATE: {
    readonly LOADING: "loading";
    readonly OPENED: "opened";
    readonly CLOSED: "closed";
    readonly FAILED: "failed";
};
export type InterstitialState = typeof INTERSTITIAL_STATE[keyof typeof INTERSTITIAL_STATE];
export declare const REWARDED_STATE: {
    readonly LOADING: "loading";
    readonly OPENED: "opened";
    readonly CLOSED: "closed";
    readonly FAILED: "failed";
    readonly REWARDED: "rewarded";
};
export type RewardedState = typeof REWARDED_STATE[keyof typeof REWARDED_STATE];
export declare const ADVANCED_BANNERS_ACTION: {
    readonly SHOW: "show";
    readonly HIDE: "hide";
};
export type AdvancedBannersAction = typeof ADVANCED_BANNERS_ACTION[keyof typeof ADVANCED_BANNERS_ACTION];
export declare const BANNER_CONTAINER_ID = "banner-container";
export declare const ADVANCED_BANNER_CONTAINER_ID_PREFIX = "advanced-banner-";
export declare const INTERSTITIAL_CONTAINER_ID = "interstitial-container";
export declare const REWARDED_CONTAINER_ID = "rewarded-container";
export declare const DEFAULT_MINIMUM_DELAY_BETWEEN_INTERSTITIAL = 60;
export declare const ADVANCED_BANNERS_CONDITIONS_DEBOUNCE = 200;
export declare const ADVANCED_BANNERS_SCORE: {
    DEVICE_TYPE: number;
    ORIENTATION: number;
    DIMENSION: number;
    CANVAS: number;
};
export declare const ADVANCED_BANNER_SIZE_KEYS: readonly ["width", "height"];
export declare const ADVANCED_BANNER_POSITION_KEYS: readonly ["top", "bottom", "left", "right"];
export declare const ADVANCED_BANNER_PERCENT_PATTERN: RegExp;
export declare const DEVICE_TYPES_SET: Set<string>;
export declare const ORIENTATIONS_SET: Set<string>;
