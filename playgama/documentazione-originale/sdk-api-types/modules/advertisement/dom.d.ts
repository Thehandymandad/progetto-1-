import { type BannerPosition } from './constants';
import type { AdvancedBannerConfig } from './types';
export declare function createAdvertisementBannerContainer(position: BannerPosition): HTMLDivElement;
export declare function createAdvancedBannerContainers(banners: AdvancedBannerConfig[]): string[];
export declare function removeAdvancedBannerContainers(): void;
export declare function createAdContainer(containerId: string): HTMLDivElement;
export declare function findGameCanvas(): HTMLCanvasElement | null;
export declare function showInfoPopup(message: string): Promise<void>;
export declare function showAdFailurePopup(): Promise<void>;
