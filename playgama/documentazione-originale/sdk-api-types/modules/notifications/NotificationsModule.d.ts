import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import type { ScheduledNotification } from './types';
export interface NotificationsBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    isNotificationsSupported: boolean;
    notificationsSchedule(notification: ScheduledNotification, platformValue?: string | number): Promise<unknown>;
    notificationsCancel(id: string, platformValue?: string | number): Promise<void>;
    notificationsCancelAll(): Promise<void>;
}
declare class NotificationsModule extends ModuleBase<NotificationsBridgeContract> {
    #private;
    get isSupported(): boolean;
    schedule(notification: ScheduledNotification): Promise<unknown>;
    cancel(id: string): Promise<void>;
    cancelAll(): Promise<void>;
}
export default NotificationsModule;
