import { type LoadingScreenType, type LoadingLogoType } from './constants';
export interface LoadingScreenOptions {
    type?: LoadingScreenType;
    logo?: LoadingLogoType;
    showLoadingText?: boolean;
}
declare class LoadingScreen {
    #private;
    setHideGate(gate: Promise<unknown>): void;
    show({ type, logo, showLoadingText, }?: LoadingScreenOptions): void;
    setProgress(percent: number, isFallback?: boolean): void;
}
export default LoadingScreen;
