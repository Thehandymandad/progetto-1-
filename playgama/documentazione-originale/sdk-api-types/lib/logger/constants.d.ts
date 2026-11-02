export declare const LOG_LEVEL: {
    readonly INFO: "info";
    readonly WARN: "warn";
    readonly ERROR: "error";
};
export type LogLevel = typeof LOG_LEVEL[keyof typeof LOG_LEVEL];
export declare const LOGGER_BADGE_LABEL = "PlaygamaBridge";
export declare const LOGGER_BRAND_COLOR = "#9747FF";
export declare const LOGGER_BADGE_STYLE = "background: #9747FF; color: #fff; padding: 1px 6px; border-radius: 4px";
export declare const LOGGER_RESET_STYLE = "";
export declare const LOGGER_BANNER_STYLE = "background: #9747FF; color: white; padding: 1px 6px; border-radius: 4px";
export declare const DEBUG_QUERY_PARAM = "debug";
export declare const LOGGER_IGNORED_MODULE_METHODS: readonly string[];
export declare const LOGGER_IGNORED_SCOPED_METHODS: readonly string[];
export declare const LOGGER_IGNORED_EVENTS: readonly string[];
