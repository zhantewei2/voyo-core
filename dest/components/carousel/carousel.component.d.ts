import { VoyoEventEmitter, VoyoComponent } from "../commonComponent";
import { CarouselItemComponent } from "./carousel-item.component";
import { CarouselListManage } from "./carousel-list-manage";
import { CarouselMoveManage } from "./carousel-move-manage";
import { MoveChangeParams } from "./carousel.interface";
export declare type MoveType = "siblingAdvance" | "siblingBack" | number;
/**
 *  . Change index after animation
 *  . Must specify activeOrder. no defaults;
 *
 */
export declare class CarouselComponent extends VoyoComponent {
    set disableTouch(v: boolean);
    set transitionTime(v: number);
    transitionDuration: number;
    container: HTMLElement;
    carouselListManage: CarouselListManage<CarouselItemComponent>;
    carouselMoveManage: CarouselMoveManage;
    created(): void;
    activeOrderChange: VoyoEventEmitter<number>;
    touchChange: VoyoEventEmitter<MoveChangeParams>;
    set activeOrder(i: number);
    infiniteCarousel: boolean;
    activeIndex: number;
    itemList: CarouselItemComponent[];
    getItemList(nodes: Node[]): void;
    /**
     * can not support dynamic inject component
     */
    mounted(): void;
    visibleCurrent(): void;
    visbileIndex(index: number, cb?: (i: CarouselItemComponent, position: "left" | "mid" | "right") => void): void;
    moveRunning: boolean;
    touchRunning: boolean;
    move(type: MoveType): void;
    animateAdvance(currentItem: CarouselItemComponent, nextItem: CarouselItemComponent, cb?: () => void, transitionDuration?: number): void;
    animateBack(currentItem: CarouselItemComponent, nextItem: CarouselItemComponent, cb?: () => void, transitionDuration?: number): void;
    /**
     * carousel by arrow
     */
    siblingAdvance(): void;
    /**
     * carousel by arrow
     */
    siblingBack(): void;
    /**
     * carousel by index
     * @param index
     * @param cb
     */
    carouselByIndex(index: number, cb?: () => void): void;
}
