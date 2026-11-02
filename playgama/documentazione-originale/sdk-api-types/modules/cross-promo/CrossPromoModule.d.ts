import ModuleBase from '../ModuleBase';
import type { Game, CrossPromoBridgeContract } from './types';
declare class CrossPromoModule extends ModuleBase<CrossPromoBridgeContract> {
    #private;
    get isVisible(): boolean;
    initialize(platformBridge: CrossPromoBridgeContract): this;
    getGames(): Promise<Game[]>;
    show(): Promise<void>;
    hide(): void;
}
export default CrossPromoModule;
