import { type ProgressLogoPreset } from './constants';
import type { LoadingScreenView } from './types';
declare class LogoLoadingView implements LoadingScreenView {
    #private;
    constructor(preset: ProgressLogoPreset, showHints: boolean);
    show(): void;
    setProgress(progress: number): void;
    hide(): void;
}
export default LogoLoadingView;
