import ModuleBase from '../ModuleBase';
import type { DailyRewardsBridgeContract } from './types';
/**
 * Daily rewards module. The game developer configures the ordered list of reward
 * ids (one per day) through the bridge options. The module tracks the current day
 * using the platform server time (converted to a UTC epoch-day number, with a local
 * Date.now() fallback), persists progress through the storage module, and resets the
 * streak back to the first day when one or more days are missed.
 *
 * Claim and streak-reset activity is emitted on the global event bus
 * (EVENT_NAME.DAILY_REWARDS_CLAIMED / DAILY_REWARDS_STREAK_RESET) — the same bus
 * the public bridge.on() is wired to, like every other module event — so both
 * game code and bridges that surface it to an external tool (e.g. QA Tool)
 * can subscribe.
 *
 * Every public operation reads the clock exactly once up front and passes the
 * epoch day down. Each state check runs in the same synchronous block as the
 * write it guards, so concurrent operations cannot interleave between a check
 * and its write.
 */
declare class DailyRewardsModule extends ModuleBase<DailyRewardsBridgeContract> {
    #private;
    initialize(platformBridge: DailyRewardsBridgeContract): this;
    getRewards(): Promise<string[]>;
    getCurrentDay(): Promise<number>;
    getCurrentReward(): Promise<string | null>;
    claimCurrentReward(): Promise<boolean>;
}
export default DailyRewardsModule;
