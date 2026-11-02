import type { AnyRecord } from '../../utils';
import type { CrossPromoGame, Game } from './types';
export declare function normalizeConfigGame(game: CrossPromoGame): Game;
export declare function normalizePlatformGame(raw: AnyRecord): Game;
export declare function pickRandomGames(games: Game[], count: number): Game[];
