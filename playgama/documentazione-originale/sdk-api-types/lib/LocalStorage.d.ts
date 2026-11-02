declare class LocalStorage {
    #private;
    get isAvailable(): boolean;
    constructor();
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
declare const _default: LocalStorage;
export default _default;
