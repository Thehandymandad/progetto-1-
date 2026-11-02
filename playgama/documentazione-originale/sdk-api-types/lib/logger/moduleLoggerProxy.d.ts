/**
 * Wraps a module instance in a Proxy that logs every public method call and
 * its outcome through the shared logger. Property getters are passed through
 * untouched, so only actual method invocations are reported.
 */
export declare function createModuleLoggerProxy<T extends object>(scope: string, target: T): T;
