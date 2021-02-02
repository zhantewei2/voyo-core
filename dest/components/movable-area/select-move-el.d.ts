import { Subject } from "rxjs";
import { SelectMove } from "./select-move";
export interface SelectMoveElOpts {
    wrapperEl: HTMLElement;
    viewEl: HTMLElement;
    topBoundary: number;
    behavior?: "x" | "y";
}
export declare class SelectMoveEl extends SelectMove {
    viewEl: HTMLElement;
    wrapperEl: HTMLElement;
    scrollParent: HTMLElement | null;
    behavior: "x" | "y";
    realMoveDistance: number;
    moveChange: Subject<number>;
    set preventParentScroll(v: boolean);
    move(move: number): void;
    moveEffects: (move: number) => void;
    animateRunning: boolean;
    touchEndMomentSpeed(momentSpeed: number): void;
    touchEndStatic(): void;
    /**
     * 重新计算所有高度
     */
    reCalAllHeight(): void;
    constructor({ viewEl, wrapperEl, topBoundary, behavior, }: SelectMoveElOpts);
    startSpeed(momentSpeed: number): void;
    topToBack(cb?: () => void): void;
    bottomToBack(): void;
    backEnd(pos: "top" | "bottom"): void;
}
