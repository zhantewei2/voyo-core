export declare const frameInterval = 16.6;
export interface AnimatePrams {
    duration: number;
    start: number;
    end: number;
    startCb?: () => void;
    endCb?: (x: number) => void;
    updateCb: (x: number) => void;
    pauseCb?: (x: number) => void;
}
export declare class Animate {
    isPause: boolean;
    isRunning: boolean;
    pause(): void;
    run: ({ start, duration, end, startCb, endCb, updateCb, pauseCb, }: AnimatePrams) => void;
}
export declare class EvenModelRun {
    isRunning: boolean;
    isPause: boolean;
    isStop: boolean;
    run: any;
    runAllFrame: number;
    runCompleteFrame: number;
    constructor(runCount: number, run: (frame: number) => void, end: () => void);
    pause(): void;
    restore(): void;
    stop(): void;
    play(): void;
}
