export type AnyRecord = Record<string, unknown>;
export declare const getKeyOrNull: <T extends AnyRecord, K extends keyof T>(obj: T, key: K) => T[K] | null;
export declare function getKeysFromObject(keys: string | string[], data: AnyRecord, tryParseJson?: boolean): unknown;
export declare function resolvePlatformOptions<T extends AnyRecord>(options: T | undefined, platformId: string): T | undefined;
export declare function deepMerge<A extends AnyRecord, B extends AnyRecord>(firstObject: A, secondObject: B): A & B;
