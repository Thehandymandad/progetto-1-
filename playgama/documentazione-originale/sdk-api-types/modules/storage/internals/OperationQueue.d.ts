declare class OperationQueue {
    #private;
    enqueue<T>(operation: () => Promise<T>): Promise<T>;
}
export default OperationQueue;
