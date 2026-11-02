import ModuleBase from '../ModuleBase';
import type { TasksBridgeContract, Task } from './types';
/**
 * Tasks module. The game configures one or more task groups, each with a
 * type — 'daily' / 'weekly' (reset every UTC day/week) or 'permanent'
 * (never resets). Every task in a group's `items` is active for the period.
 * A task has one or more `targets` (each a gameplay metric + amount) and
 * completes when ALL of its targets are met; it then grants its `rewards`.
 *
 * The game reports gameplay via addProgress(metric); the module advances every
 * matching target across all active tasks/types, persists through the storage
 * module, and exposes claim state.
 *
 * The module is data-only: it tracks numbers, not meaning. Display text, player
 * segmentation, and what a reward grants are owned by the game, keyed off the
 * target/reward ids. getTasks() always returns the full active list.
 */
declare class TasksModule extends ModuleBase<TasksBridgeContract> {
    #private;
    initialize(platformBridge: TasksBridgeContract): this;
    getTasks(): Promise<Task[]>;
    addProgress(metric: string, amount?: number): Promise<void>;
    claimReward(taskId: string): Promise<boolean>;
}
export default TasksModule;
