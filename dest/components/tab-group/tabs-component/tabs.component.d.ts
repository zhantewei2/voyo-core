import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { CarouselComponent } from "../../carousel/carousel.component";
import { Subject } from "rxjs";
import { LayoutController, TabgroupLayoutType } from "../tab.interface";
import { ExcuteAfterConnected } from "../../utils";
import { ClassManage } from "../../../utils";
export declare class TabsComponent extends VoyoComponent implements LayoutController {
    set transitionTime(v: number);
    set value(v: number);
    inputChange: VoyoEventEmitter<number>;
    value0: number;
    get value(): number;
    setIndex(v: number, cb?: () => void): void;
    excuteAfterConnected: ExcuteAfterConnected;
    /**
     * layout change
     * @param type
     */
    setLayout(type: TabgroupLayoutType): void;
    classManage: ClassManage;
    carouselEl: CarouselComponent;
    slotEl: HTMLSlotElement;
    progressChange: Subject<number>;
    created(): void;
    mounted(): void;
}
