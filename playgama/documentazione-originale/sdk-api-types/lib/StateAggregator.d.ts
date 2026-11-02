export type StateAggregatorCallback = (aggregatedState: boolean) => void;
declare class StateAggregator<TKey extends string = string> {
    #private;
    constructor(stateKeys: readonly TKey[], callback: StateAggregatorCallback);
    setState(key: TKey, value: boolean): void;
    getState(key: TKey): boolean;
    getAggregatedState(): boolean;
    resetAll(): void;
}
export default StateAggregator;
