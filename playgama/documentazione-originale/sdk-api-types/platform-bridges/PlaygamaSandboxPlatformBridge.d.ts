import StandalonePlatformBridge from './StandalonePlatformBridge';
import { type PlatformId } from '../modules/platform/constants';
declare class PlaygamaSandboxPlatformBridge extends StandalonePlatformBridge {
    get platformId(): PlatformId;
}
export default PlaygamaSandboxPlatformBridge;
