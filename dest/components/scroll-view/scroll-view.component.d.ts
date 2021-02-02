import { KeepScrollContainer } from "@voyo/core/utils/scroll";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { ClassManage } from "../../utils";
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";
export declare class ScrollViewComponent extends VoyoComponent {
    excuteAfterConnected: ExcuteAfterConnected;
    classManager: ClassManage;
    _behavior: "x" | "y";
    lowerThreshold: number;
    set behavior(v: "x" | "y");
    set full(v: boolean);
    set scrollLower(useScrollLower: boolean);
    mounted(): void;
    scrolltolowerEvent: VoyoEventEmitter<any>;
    containerEl: HTMLElement;
    scrollListenered: boolean;
    containerHeight: number;
    isLower: boolean;
    keepScrollContainer: KeepScrollContainer;
    created(): void;
    afterCreate(): void;
    connectedCallback(): void;
    reCalHeight(): void;
    calContainerHeight(): void;
}
