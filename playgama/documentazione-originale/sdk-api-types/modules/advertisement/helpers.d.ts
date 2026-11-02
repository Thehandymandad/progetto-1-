import type { PlacementMapping } from './types';
export declare function parseDelay(value: unknown): number | null;
export declare function getPlatformPlacement(id: string | null | undefined, placements: PlacementMapping[] | undefined, platformId: string): string | null;
