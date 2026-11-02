export declare const POST_REWARD_TYPE: {
    readonly VISIT: "visit";
    readonly AUTHOR: "author";
};
export type PostRewardType = typeof POST_REWARD_TYPE[keyof typeof POST_REWARD_TYPE];
export declare const CONTENT_FIELDS: readonly ["text", "image", "url"];
