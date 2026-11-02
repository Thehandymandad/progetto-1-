import { type EventEmitter } from './EventBus';
export declare const EVENT_NAME: {
    readonly STATE_CHANGED: "state_changed";
    readonly TIME_LEFT_CHANGED: "time_left_changed";
};
export type TimerEventName = typeof EVENT_NAME[keyof typeof EVENT_NAME];
export declare const STATE: {
    readonly CREATED: "created";
    readonly STARTED: "started";
    readonly STOPPED: "stopped";
    readonly COMPLETED: "completed";
};
export type TimerState = typeof STATE[keyof typeof STATE];
interface Timer extends EventEmitter {
}
declare class Timer {
    #private;
    get state(): TimerState;
    constructor(time: number);
    start(): void;
    stop(): void;
}
export default Timer;
