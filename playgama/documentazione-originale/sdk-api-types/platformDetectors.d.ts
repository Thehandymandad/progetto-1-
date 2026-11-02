import { type PlatformId } from './modules/platform/constants';
export interface PlatformDetectorContext {
    url: URL;
    hostname: string;
    hash: string;
    searchParams: URLSearchParams;
    referrer: string;
    win: Window;
}
export interface PlatformDetector {
    platformId: PlatformId;
    predicate: (ctx: PlatformDetectorContext) => boolean;
}
export declare const PLATFORM_DETECTORS: PlatformDetector[];
export declare function detectPlatformId(forciblySetPlatformId?: string): PlatformId;
