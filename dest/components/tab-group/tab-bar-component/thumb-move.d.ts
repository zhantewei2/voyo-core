import { TabBarItemRef } from "../tab.interface";
import { MoveChangeParams } from "../../carousel/carousel.interface";
import { Subject } from "rxjs";
export declare type UpdateFn = (p: UpdateFnParams) => void;
export interface UpdateFnParams {
    progress: number;
    distance: number;
    currentPos: number;
}
export declare class ThumbMoveAn {
    el: HTMLElement;
    anInstance: any | undefined;
    duration: number;
    ease: string;
    updateFn: UpdateFn;
    isRunning: boolean;
    constructor(el: HTMLElement, duration: number, update: UpdateFn);
    moveTo(fromX: number, toX: number, end?: () => void): void;
    pause(): void;
    resume(): void;
}
export declare class ThumbMove {
    constructor(thumbEl: HTMLElement, tabBarItemRefList: TabBarItemRef[], moveDuration: number, parent: any);
    setBarItemLeftDistanceList(): void;
    parent: any;
    barItemLeftDistanceList: number[];
    /**
     * bound distance can movable.
     */
    leftMoveSpace: number;
    rightMoveSpace: number;
    moveProgressSubject: Subject<UpdateFnParams>;
    moveAn: ThumbMoveAn;
    moveDuration: number;
    thumbIndex: number;
    thumbEl: HTMLElement;
    thumbChangeEl: HTMLElement;
    thumbWidth: number;
    tabBarItemRefList: TabBarItemRef[];
    /**
     * thumb moved distance
     */
    currentPosition: number;
    indexPosition: number;
    getThumbPosByIndex(i: number): number;
    defineThumbPos(left: number): void;
    animateRunning: boolean;
    animateToIndex(index: number, cb?: () => void): void;
    calBoundSpaceCanMove(): void;
    /**
     *
     * @param percent tabsMove percent
     */
    pointerMove({ relativeV: percent, type }: MoveChangeParams): void;
    setIndex(index: number): void;
    toIndex(index: number, cb: () => void): void;
}
