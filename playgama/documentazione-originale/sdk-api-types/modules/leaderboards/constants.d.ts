export declare const LEADERBOARD_TYPE: {
    readonly NOT_AVAILABLE: "not_available";
    readonly IN_GAME: "in_game";
    readonly NATIVE: "native";
    readonly NATIVE_POPUP: "native_popup";
};
export type LeaderboardType = typeof LEADERBOARD_TYPE[keyof typeof LEADERBOARD_TYPE];
