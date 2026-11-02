import ModuleBase from '../ModuleBase';
import type { AnalyticsBridgeContract, AnalyticsSender } from './types';
export declare const internalAnalytics: AnalyticsSender;
declare class AnalyticsModule extends ModuleBase<AnalyticsBridgeContract> {
    #private;
    set gameVersion(value: string | null);
    constructor();
    initialize(platformBridge: AnalyticsBridgeContract): this;
    send(eventName: string, data?: Record<string, unknown>): void;
}
declare const analyticsModule: AnalyticsModule;
export default analyticsModule;
