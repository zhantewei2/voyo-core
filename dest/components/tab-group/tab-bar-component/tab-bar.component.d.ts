import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { ClassManage } from "../../../utils";
import { Subject } from "rxjs";
import { MoveChangeParams } from "../../carousel/carousel.interface";
import { ThumbMove } from "./thumb-move";
import { MovableMove } from "./movable-move";
import { TabBarItemRef, LayoutController, TabgroupLayoutType } from "../tab.interface";
import { TabBarItemComponent } from "../tab-bar-item-component/tab-bar-item.component";
import { ExcuteAfterConnected } from "../../utils";
export interface WillChangeOpts {
    value: number;
    cb: () => void;
}
export declare class TabBarClassManage {
    tabBars: TabBarItemComponent[];
    preItem: TabBarItemComponent;
    preIndex: number;
    constructor(tabBars: TabBarItemComponent[]);
    setIndex(v: number): void;
}
export declare class TabBarComponent extends VoyoComponent implements LayoutController {
    set value(v: number);
    get value(): number;
    transitionTime: number;
    disableThumb: boolean;
    outputInput: VoyoEventEmitter<number>;
    excuteAfterConnected: ExcuteAfterConnected;
    tabBarClassManage: TabBarClassManage;
    classManageThis: ClassManage;
    slotEl: HTMLSlotElement;
    containerEl: HTMLElement;
    areaEl: HTMLElement;
    thumbEl: HTMLElement;
    /**
     * layout change
     * @param type
     */
    setLayout(type: TabgroupLayoutType): void;
    mounted(): void;
    pointerMoveChange: Subject<MoveChangeParams>;
    willChange: Subject<WillChangeOpts>;
    valueChange: Subject<number>;
    index0: number;
    set index(v: number);
    get index(): number;
    containerWidth: number;
    thumbWidth: number;
    scrollWidth: number;
    thumbMove: ThumbMove;
    movableMove: MovableMove;
    combine: boolean;
    setIndex(v: number): void;
    setIndexDirect(v: number): void;
    itemTap(i: number): void;
    areaWidth0: number;
    set areaWidth(v: number);
    get areaWidth(): number;
    handlePointerMove(): void;
    tabBarItemRefList: TabBarItemRef[];
    handleTabItems(end: () => void): void;
}
