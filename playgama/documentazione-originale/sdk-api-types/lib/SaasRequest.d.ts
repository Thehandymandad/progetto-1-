import type { JsonValue } from '../utils';
export interface SaasBridgeLike {
    playerId?: string | null;
    platformId: string;
}
export interface SaasRequestApi {
    get<T = unknown>(url: string): Promise<T>;
    post<T = unknown>(url: string, data: JsonValue): Promise<T>;
}
export default class SaasRequest {
    #private;
    get baseUrl(): string;
    get xHeaders(): Record<string, string>;
    constructor(bridge: SaasBridgeLike);
    get<T = unknown>(url: string): Promise<T>;
    post<T = unknown>(url: string, data: JsonValue): Promise<T>;
}
