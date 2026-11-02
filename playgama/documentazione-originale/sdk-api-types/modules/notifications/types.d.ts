export interface ScheduledNotification {
    id: string;
    title: string;
    description: string;
    delaySeconds?: number;
    image?: string;
    callToAction?: string;
    payload?: string;
}
export interface NotificationMapping {
    id: string;
    [platform: string]: string | number | undefined;
}
