export declare const LAUNCH_SOURCE: {
    readonly NOTIFICATION: "notification";
    readonly POST: "post";
};
export type LaunchSource = typeof LAUNCH_SOURCE[keyof typeof LAUNCH_SOURCE];
