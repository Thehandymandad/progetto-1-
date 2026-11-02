declare class Deferred<T = unknown> {
    #private;
    get promise(): Promise<T>;
    constructor();
    resolve(data: T): void;
    reject(error?: unknown): void;
}
export default Deferred;
