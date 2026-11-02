import type { MultiplayerConfig, MultiplayerCreateOptions, MultiplayerJoinOptions, MultiplayerMatchOptions, MultiplayerRoom, MultiplayerRoomsQuery, MultiplayerRoomSummary } from './types';
export default class MultiplayerRuntime {
    private http;
    private rooms;
    private joins;
    private admissions;
    constructor(config: MultiplayerConfig, headers: () => Record<string, string>);
    createRoom(options: MultiplayerCreateOptions): Promise<MultiplayerRoom>;
    joinOrCreateRoom(options: MultiplayerMatchOptions): Promise<MultiplayerRoom>;
    joinRoom(options: MultiplayerJoinOptions): Promise<MultiplayerRoom>;
    getRooms(query?: MultiplayerRoomsQuery): Promise<{
        rooms: MultiplayerRoomSummary[];
        nextCursor: string | null;
    }>;
    private enter;
    private admit;
    private createHandle;
}
