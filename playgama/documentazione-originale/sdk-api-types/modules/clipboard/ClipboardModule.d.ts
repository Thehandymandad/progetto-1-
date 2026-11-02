import ModuleBase, { type PlatformBridgeLike } from '../ModuleBase';
export interface ClipboardBridgeContract extends PlatformBridgeLike {
    isClipboardSupported: boolean;
    clipboardRead(): Promise<string>;
    clipboardWrite(text: string): Promise<void>;
}
declare class ClipboardModule extends ModuleBase<ClipboardBridgeContract> {
    get isSupported(): boolean;
    read(): Promise<string>;
    write(text: string): Promise<void>;
}
export default ClipboardModule;
