import { type PlatformId } from './modules/platform/constants';
import PlatformBridgeBase from './platform-bridges/PlatformBridgeBase';
type PlatformBridgeConstructor = new (...args: never[]) => PlatformBridgeBase;
export declare function fetchPlatformBridge(platformId: PlatformId): Promise<PlatformBridgeConstructor>;
export {};
