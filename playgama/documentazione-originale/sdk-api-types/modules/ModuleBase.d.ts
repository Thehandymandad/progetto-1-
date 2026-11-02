import { type EventEmitter } from '../lib/EventBus';
export type PlatformBridgeLike = EventEmitter & Record<string, unknown>;
declare class ModuleBase<TPlatformBridge extends PlatformBridgeLike = PlatformBridgeLike> {
    protected _platformBridge: TPlatformBridge;
    initialize(platformBridge: TPlatformBridge): this;
    protected _forwardEvent(eventName: string): void;
    protected _isSaas(feature: string): boolean;
}
export default ModuleBase;
