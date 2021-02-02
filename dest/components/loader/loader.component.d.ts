import { VoyoComponent, VoyoEventEmitter, VoyoTemplateRef } from "../commonComponent";
import { ClassManage } from "../../utils";
import { SizeVarious } from "../../types/base-types";
import { ExcuteAfterConnected } from "../utils";
export declare class LoaderComponent extends VoyoComponent {
    img: string;
    set size(v: SizeVarious);
    set abs(v: boolean | "");
    set fixCenter(v: boolean | "");
    set absCenter(v: boolean | "");
    set cover(v: boolean | "");
    set type(v: "block" | "inline");
    set show(v: boolean);
    showChange: VoyoEventEmitter<any>;
    svgTemplateRef: VoyoTemplateRef;
    excuteAfterRender: ExcuteAfterConnected;
    inserted: boolean;
    container: HTMLElement;
    wrapperEl: HTMLElement;
    wrapperManage: ClassManage;
    containerManage: ClassManage;
    created(): void;
}
