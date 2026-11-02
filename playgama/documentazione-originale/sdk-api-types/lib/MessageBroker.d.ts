export type MessageListener = (event: MessageEvent) => void;
export default class MessageBroker {
    send(message: unknown, target?: string): void;
    addListener(callback: MessageListener): void;
    removeListener(callback: MessageListener): void;
    generateMessageId(): string;
}
