import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
import { type LaunchSource } from '../../constants';
import { type PlatformId, type PlatformMessage } from './constants';
import type { AnyRecord } from '../../utils';
import type { EventEmitter } from '../../lib/EventBus';
export interface PlatformMessageOptions {
    world?: unknown;
    level?: unknown;
    [key: string]: unknown;
}
export interface PlatformBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    platformSdk: unknown;
    platformLanguage: string;
    platformPayload: string | null;
    platformTld: string | null;
    data: AnyRecord;
    launchPostId: string | null;
    launchSource: LaunchSource | null;
    isPlatformExternalCallsSupported: boolean;
    isPlatformExternalLinksAllowed: boolean;
    isPlatformAudioEnabled: boolean;
    isPlatformPaused: boolean;
    sendMessage(message: string, options?: PlatformMessageOptions): Promise<unknown>;
    sendCustomMessage(id: string, options?: unknown): Promise<unknown>;
    getServerTime(): Promise<unknown>;
}
interface PlatformModule extends EventEmitter {
}
declare class PlatformModule extends ModuleBase<PlatformBridgeContract> {
    #private;
    get id(): PlatformId;
    get sdk(): unknown;
    get language(): string;
    get payload(): string | null;
    get data(): AnyRecord;
    get tld(): string | null;
    get launchSource(): LaunchSource | null;
    get isExternalCallsSupported(): boolean;
    get isExternalLinksAllowed(): boolean;
    get isAudioEnabled(): boolean;
    get isPaused(): boolean;
    initialize(platformBridge: PlatformBridgeContract): this;
    sendMessage(message: PlatformMessage | string, rawOptions?: PlatformMessageOptions | null): Promise<unknown>;
    sendCustomMessage(id: string, options?: unknown): Promise<unknown>;
    getServerTime(): Promise<unknown>;
}
export default PlatformModule;
