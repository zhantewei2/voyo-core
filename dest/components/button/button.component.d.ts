import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { ColorVarious, SizeVarious, BtnTypeVarious } from "../../types/base-types";
import { ClassManage } from "../../utils/ClassManage";
import { CoreSetting } from "../../core-setting.service";
export declare class ButtonComponent extends VoyoComponent {
    coreSetting: CoreSetting;
    rippleOpts: {
        autoSize: boolean;
        css: string;
        disabled: boolean;
    };
    set block(v: number);
    set color(v: ColorVarious);
    set size(v: SizeVarious);
    set type(v: BtnTypeVarious);
    set round(v: number);
    set noRadius(v: number);
    set active(v: boolean | "");
    disabled: boolean;
    noRipple: boolean;
    voyoTap: VoyoEventEmitter<any>;
    setColor(v: string): void;
    setSize(v: string): void;
    setType(v: string): void;
    setBlock(v: any): void;
    setRound(v: any): void;
    setNoRadius(v: any): void;
    setActive(v: boolean | ""): void;
    data: string;
    classManage: ClassManage;
    created(): void;
    awaitQueue: Function[];
    connected: boolean;
    mounted(): void;
}
