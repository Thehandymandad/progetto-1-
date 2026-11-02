import type { PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import type { DeviceOs, DeviceType } from '../device/constants';
import type { LaunchSource } from '../../constants';
export interface AnalyticsBridgeOptions {
    sendAnalyticsEvents?: boolean;
    saas?: {
        publicToken?: string;
    } & Record<string, unknown>;
    [key: string]: unknown;
}
export interface AnalyticsBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    playerId: string | null;
    deviceType: DeviceType;
    deviceOs: DeviceOs;
    options: AnalyticsBridgeOptions;
    launchSource: LaunchSource | null;
    isPlatformExternalCallsSupported: boolean;
    isPlatformPaused: boolean;
    data?: {
        clid?: string;
    } & Record<string, unknown>;
    sendAnalyticsEvent?(eventName: string, data: Record<string, unknown>): void;
}
export interface AnalyticsSender {
    send(eventType: string, data?: Record<string, unknown>): void;
}
export interface AnalyticsEvent {
    event_name: string;
    timestamp: string;
    data: Record<string, unknown>;
}
export interface AnalyticsMeta {
    bridge_version: string;
    platform_id: PlatformId;
    game_id: string | null;
    game_version: string | null;
    session_id: string;
    player_id: string | null;
    player_guest_id: string | null;
    device_type: DeviceType;
    device_os: DeviceOs;
    clid: string;
    launch_source: LaunchSource | null;
    public_token?: string;
}
export interface AnalyticsPayload {
    meta: AnalyticsMeta;
    events: AnalyticsEvent[];
    custom_events?: AnalyticsEvent[];
}
