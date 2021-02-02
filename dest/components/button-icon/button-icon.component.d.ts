import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { ColorVarious, SizeVarious, BtnTypeVarious } from "../../types/base-types";
import { ClassManage } from "../../utils/ClassManage";
import { CoreSetting } from "../../core-setting.service";
export declare class ButtonIconComponent extends VoyoComponent {
    coreSetting: CoreSetting;
    rippleOpts: {
        autoSize: boolean;
        css: string;
        disabled: boolean;
    };
    set disabled(v: any);
    set color(v: ColorVarious);
    set size(v: SizeVarious);
    set type(v: BtnTypeVarious);
    voyoTap: VoyoEventEmitter<any>;
    setColor(v: string): void;
    setSize(v: string): void;
    setType(v: string): void;
    classManage: ClassManage;
    created(): void;
    awaitQueue: Function[];
    connected: boolean;
    mounted(): void;
}
