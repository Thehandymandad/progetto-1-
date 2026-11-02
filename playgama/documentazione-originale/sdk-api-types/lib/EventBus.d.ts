export type EventListener = (...args: any[]) => void;
export interface EventEmitter {
    on(eventName: string, callback: EventListener): void;
    off(eventName: string, callback?: EventListener): void;
    once(eventName: string, callback: EventListener): void;
    emit(eventName: string, ...args: unknown[]): void;
}
export declare function applyLocalEventMixin(target: object): void;
declare const eventBus: EventEmitter;
export declare function applyEventBusMixin(target: object): void;
export default eventBus;
