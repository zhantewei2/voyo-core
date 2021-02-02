import { Subject } from "rxjs";
export interface PercentOpts {
    percent: number;
    triggerPercent: number;
    distance: number;
    triggerDistancePercent: number;
}
export declare class RefreshAnimation {
    el: HTMLElement;
    s: (t: number) => number;
    coef: number;
    minDistance: number;
    maxDistance: number;
    triggerDistance: number;
    triggerPercent: number;
    triggerBreak: boolean;
    triggerWillEvent: Subject<boolean>;
    percentEvent: Subject<PercentOpts>;
    canTrigger: boolean;
    maxCount: number;
    moveDis: number;
    movePercent: number;
    movePercentStore: number;
    _movePercent: number | null;
    isBacking: boolean;
    pauseImmediate: boolean;
    breakTriggering: boolean;
    breakTriggeringRun: boolean;
    triggerWill0: boolean;
    set triggerWill(v: boolean);
    get isDefault(): boolean;
    constructor(el: HTMLElement, maxDistance?: number, triggerDistance?: number);
    getMovePercent(x: number): number;
    touchMove(): void;
    /**
     *
     * @param movePercent
     * @param fromBack
     * @return isTriggerBreak;
     */
    transformMove(movePercent: number, fromBack?: boolean): boolean | undefined;
    pause(): void;
    back(end: () => void, pause?: () => void): void;
    end(): void;
    run(count: number, end: () => void, pause?: () => void): void;
    preDistance: number;
    whenTriggerBreak(distance: number): boolean;
    setTriggerBreak(): void;
    clearTriggerBreak(end: () => void): void;
}
