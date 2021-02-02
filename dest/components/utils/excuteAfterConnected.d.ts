export declare type ExcuteAfterConnectedWait = (() => void) | {
    uniqueKey: string;
    run: () => void;
};
export declare class ExcuteAfterConnected {
    isConnected: boolean;
    waitQueue: Array<ExcuteAfterConnectedWait>;
    connect(): void;
    execute(cb: () => void, uniqueKey?: string): void;
}
