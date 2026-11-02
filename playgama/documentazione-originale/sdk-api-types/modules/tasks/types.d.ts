import type { PlatformBridgeLike } from '../ModuleBase';
import type { PlatformId } from '../platform/constants';
import type { AnyRecord } from '../../utils';
import type { TASK_TYPE } from './constants';
export type TaskType = typeof TASK_TYPE[keyof typeof TASK_TYPE];
export interface TaskTargetConfig {
    id: string;
    amount: number;
}
export interface TaskRewardConfig {
    id: string;
    amount: number;
}
export interface TaskItemConfig {
    id: string;
    targets: TaskTargetConfig[];
    rewards: TaskRewardConfig[];
}
export interface TaskGroupConfig {
    id: string;
    type: TaskType;
    items: TaskItemConfig[];
}
export type TasksConfig = TaskGroupConfig[];
export interface TargetProgress {
    id: string;
    progress: number;
}
export interface TaskProgress {
    id: string;
    targets: TargetProgress[];
    claimed: boolean;
}
export interface GroupState {
    periodKey: number;
    tasks: TaskProgress[];
}
export interface TasksState {
    groups: Record<string, GroupState>;
}
export interface TaskTarget {
    id: string;
    amount: number;
    progress: number;
    completed: boolean;
}
export interface TaskReward {
    id: string;
    amount: number;
}
export interface Task {
    id: string;
    type: TaskType;
    targets: TaskTarget[];
    rewards: TaskReward[];
    completed: boolean;
    claimed: boolean;
}
export interface TasksRewardClaimedPayload {
    taskId: string;
    groupId: string;
    type: TaskType;
    rewards: TaskReward[];
}
export interface TasksPeriodRolledOverPayload {
    groupId: string;
    type: TaskType;
    periodKey: number;
    previousPeriodKey: number;
}
export interface TasksBridgeContract extends PlatformBridgeLike {
    platformId: PlatformId;
    options?: AnyRecord;
    getServerTime(): Promise<number>;
}
