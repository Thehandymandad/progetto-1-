declare class GameplayMilestoneTracker {
    #private;
    constructor(send: (eventName: string) => void);
    start(): void;
    setPauseState(isPaused: boolean): void;
}
export default GameplayMilestoneTracker;
