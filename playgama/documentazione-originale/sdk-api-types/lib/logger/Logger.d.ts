declare class Logger {
    #private;
    get enabled(): boolean;
    set enabled(value: boolean);
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    banner(message: string): void;
}
export { Logger };
declare const _default: Logger;
export default _default;
