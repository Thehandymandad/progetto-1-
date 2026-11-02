export type RecorderPriority = 'very-low' | 'low' | 'medium' | 'high';
export interface RecorderStartOptions {
    fps?: number;
    iceServers?: RTCIceServer[];
    maxBitrate?: number;
    minBitrate?: number;
    maxFramerate?: number;
    scaleResolutionDownBy?: number;
    priority?: RecorderPriority;
    networkPriority?: RecorderPriority;
    scalabilityMode?: string;
    contentHint?: string;
}
export interface RecorderAvailability {
    available: boolean;
    reason: string | null;
}
export interface RecorderScreenshotOptions {
    type?: string;
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
}
export interface RecorderScreenshotResult {
    success: boolean;
    reason: string | null;
    data: string | null;
}
export type RecorderOfferCallback = (sdp: string | undefined) => void;
export type RecorderIceCandidateCallback = (candidate: RTCIceCandidateInit) => void;
export type RecorderStartedCallback = () => void;
export type RecorderErrorCallback = (reason: string | null) => void;
declare class Recorder {
    #private;
    set onOffer(fn: RecorderOfferCallback);
    set onIceCandidate(fn: RecorderIceCandidateCallback);
    set onStarted(fn: RecorderStartedCallback);
    set onError(fn: RecorderErrorCallback);
    checkAvailability(): RecorderAvailability;
    startCapture(options?: RecorderStartOptions): Promise<void>;
    handleAnswer({ sdp }: {
        sdp: string;
    }): Promise<void>;
    handleIce(candidate: RTCIceCandidateInit | null): Promise<void>;
    takeScreenshot(options?: RecorderScreenshotOptions): RecorderScreenshotResult;
    takeScreenshotFromSurface(options?: RecorderScreenshotOptions): Promise<RecorderScreenshotResult>;
    stopCapture(): void;
}
export default Recorder;
