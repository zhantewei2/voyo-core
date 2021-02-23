import { CarouselComponent } from "./carousel.component";
import { CarouselItemComponent } from "./carousel-item.component";
export declare class CarouselMoveManage {
    disableTouch: boolean;
    target: CarouselComponent;
    totalTransitionTime: number;
    constructor(target: CarouselComponent, totalTransitionTime?: number);
    bluntnessDistance: number;
    moveActivity: boolean;
    moveX: number;
    containerWidth: number;
    containerHalfWidth: number;
    containerInterceptWidth: number;
    initialized: boolean;
    activeCurrent: CarouselItemComponent;
    activePreItem: CarouselItemComponent;
    activeNextItem: CarouselItemComponent;
    launchFromBegin: boolean;
    interceptMoveRun: boolean;
    setTransitionTime(v: number): void;
    initializeData(): void;
    animateMoveEnd(newCurrentItem: CarouselItemComponent): void;
    getTimerByDistance(distance: number): number;
    animateMove(forward: "advance" | "back" | "advanceCancel" | "backCancel", remainDis: number, waitTransition?: boolean): void;
    move(): void;
    moveDisX(x: number): void;
    interceptMove(): void;
    cancelInterceptMove(): void;
    resetState(): void;
    watchTouch(): void;
}