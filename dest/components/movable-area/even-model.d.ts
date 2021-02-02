import { EvenModelRun } from "../../utils/animateKeyframe";
export declare type FrameRunCb = (currentV: number) => void;
export interface FrameRun {
    advance: boolean;
    v0: number;
    startJourney: number;
    end?: () => void;
    update: (v: number, s: number) => void;
}
export declare class EvenModel {
    a: number;
    vc: number;
    isRunning: boolean;
    getRealV(v: number): number;
    getRealA: (advance: boolean) => number;
    getTimeByV(v0: number, a: number): number;
    getJourneyByTime(v0: number, a: number, t: number): number;
    roundingValue(v: number): number;
    frameRun({ v0, update, advance, end, startJourney }: FrameRun): EvenModelRun;
}
