import type { PlatformBridgeLike } from '../ModuleBase';
import type { CrossPromoSource } from './constants';
export interface CrossPromoGame {
    url: string;
    icon?: string;
    name?: string;
}
export interface Game {
    id?: string;
    name?: string;
    url: string;
    iconUrl?: string;
    coverUrl?: string;
    payload?: unknown;
}
export interface CrossPromoConfig {
    title?: string;
    source?: CrossPromoSource;
    games?: CrossPromoGame[];
}
export interface CrossPromoShownPayload {
    source: CrossPromoSource;
    games: Game[];
}
export interface CrossPromoBridgeContract extends PlatformBridgeLike {
    isPlatformGamesListSupported: boolean;
    getGamesList(): Promise<unknown[]>;
}
