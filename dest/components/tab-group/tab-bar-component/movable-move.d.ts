import { MovableArea } from "../../../components";
export interface TabItemRectRef {
    left: number;
    right: number;
    width: number;
    scrollPosition: number;
}
export declare class MovableMove {
    movable: MovableArea;
    parent: any;
    tabItemRectRefList: TabItemRectRef[];
    scrollBoundLeft: number;
    scrollBoundRight: number;
    scrollLeft: number;
    containerWidth: number;
    constructor(parent: any, parentIndex: number);
    defineTabItemRectRefs(): void;
    getScrollPosition(left: number, width: number): number;
}
