import type { LoadingSoundConfig } from '../bridge-config/types';
declare class LoadingSound {
    #private;
    get finished(): Promise<void>;
    constructor({ url }: LoadingSoundConfig);
    play(): void;
    cancel(): void;
}
export default LoadingSound;
