import type { LoadingScreenView } from './types';
declare class RingLoadingView implements LoadingScreenView {
    #private;
    show(): void;
    setProgress(progress: number): void;
    hide(): void;
}
export default RingLoadingView;
