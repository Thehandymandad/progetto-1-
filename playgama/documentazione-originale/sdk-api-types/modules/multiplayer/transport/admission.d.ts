import HttpClient from './HttpClient';
import type { Reservation, Session } from './protocol';
export declare const terminalAdmissionError: (error: unknown) => boolean;
/** Shared create/join/rejoin response handling; the caller owns its handle and cancellation. */
export declare function admit<T>(options: {
    http: HttpClient;
    session: Session;
    path: string;
    body: object;
    deadline: number;
    signal?: AbortSignal;
    existing?: (roomId: string) => T | undefined;
    connect: (reservation: Reservation, timeoutMs: number) => Promise<T>;
}): Promise<T>;
