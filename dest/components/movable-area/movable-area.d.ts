import { Animate } from "../../utils/index";
import { EvenModel } from "./even-model";
import { EvenModelRun } from "../../utils/animateKeyframe";
import { Subject } from "rxjs";
export interface MovableOpts {
    spaceLeft?: number;
    moveSpaceLeft?: number;
    moveSpaceRight?: number;
    spaceRight?: number;
}
export declare class MovableArea {
    eventModel: EvenModel;
    el: HTMLElement;
    container: HTMLElement;
    space: number;
    spaceLeft: number;
    spaceRight: number;
    moveSpaceLeft: number;
    moveSpaceRight: number;
    useSpaceLeft: number;
    useSpaceRight: number;
    spaceDis: number;
    animate: Animate;
    x: number;
    realX: number;
    leftBound: number;
    rightBound: number;
    eventModelRun: EvenModelRun;
    moveChange: Subject<number>;
    constructor(el: HTMLElement, container: HTMLElement, { spaceLeft, moveSpaceLeft, moveSpaceRight, spaceRight }?: MovableOpts);
    moveRun: (x: number) => void;
    move(x: number): void;
    scrollToAnime: any;
    scrollRunning: boolean;
    scrollTo(x: number, cb?: () => void, easing?: string): void;
    get preventTouchMove(): boolean;
    damps: (x: number, space: number) => number;
    leftBack: (cb?: (() => void) | undefined) => void;
    rightBack: (cb?: (() => void) | undefined) => void;
    resetSpace: () => void;
    handleArea(horizontal: boolean): void;
    handleAnimateRun: (runX: number) => void;
}
