/**
 * Retrieves the server timestamp only once per session and derives every
 * subsequent value from the cached offset against the local clock.
 * Concurrent calls share a single in-flight retrieval; a failed retrieval is
 * not cached, so a later call may retry it.
 */
declare class ServerTimeCache {
    #private;
    constructor(retrieve: () => Promise<number>);
    getServerTime(): Promise<number>;
}
export default ServerTimeCache;
