/** MessagePack for the room server's control messages: JSON values and byte arrays. */
export declare function encodeMsgpack(value: unknown): Uint8Array;
/** Reads one MessagePack value at start; offset is where the next value begins. */
export declare function decodeMsgpack(data: Uint8Array, start?: number): {
    value: unknown;
    offset: number;
};
