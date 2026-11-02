import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
import { type DeviceType, type DeviceOs, type DeviceOrientation } from './constants';
import { type SafeAreaInsets } from '../../lib/safe-area';
import type { EventEmitter } from '../../lib/EventBus';
export interface DeviceConfig {
    useBuiltInOrientationPopup?: boolean;
    supportedOrientations?: DeviceOrientation[];
    [key: string]: unknown;
}
export interface DeviceBridgeOptions {
    device?: DeviceConfig;
    [key: string]: unknown;
}
export interface DeviceBridgeContract extends PlatformBridgeLike {
    deviceType: DeviceType;
    deviceOs: DeviceOs;
    safeArea?: SafeAreaInsets | null;
    options: DeviceBridgeOptions;
}
interface DeviceModule extends EventEmitter {
}
declare class DeviceModule extends ModuleBase<DeviceBridgeContract> {
    #private;
    get type(): DeviceType;
    get os(): DeviceOs;
    get orientation(): DeviceOrientation | null;
    get safeArea(): SafeAreaInsets;
    initialize(platformBridge: DeviceBridgeContract): this;
}
export default DeviceModule;
