export declare const DEVICE_TYPE: {
    readonly DESKTOP: "desktop";
    readonly MOBILE: "mobile";
    readonly TABLET: "tablet";
    readonly TV: "tv";
};
export type DeviceType = typeof DEVICE_TYPE[keyof typeof DEVICE_TYPE];
export declare const DEVICE_OS: {
    readonly WINDOWS: "windows";
    readonly MACOS: "macos";
    readonly LINUX: "linux";
    readonly ANDROID: "android";
    readonly IOS: "ios";
    readonly OTHER: "other";
};
export type DeviceOs = typeof DEVICE_OS[keyof typeof DEVICE_OS];
export declare const DEVICE_ORIENTATION: {
    readonly PORTRAIT: "portrait";
    readonly LANDSCAPE: "landscape";
};
export type DeviceOrientation = typeof DEVICE_ORIENTATION[keyof typeof DEVICE_ORIENTATION];
export declare const ORIENTATION_OVERLAY_ID = "bridge-orientation-overlay";
