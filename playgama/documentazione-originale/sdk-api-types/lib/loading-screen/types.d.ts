export interface LoadingScreenView {
    show(): void;
    setProgress(progress: number): void;
    hide(): void;
}
