import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { BtnTypeVarious } from "../../types/base-types";
export declare class CheckradioComponent extends VoyoComponent {
    voyoTap: VoyoEventEmitter<any>;
    set value(v: BtnTypeVarious);
    checkboxIdEl: HTMLInputElement;
    headerWrapper: HTMLElement;
    box: HTMLElement;
    checkPic: HTMLElement;
    boxOutline: HTMLElement;
    created(): void;
    subtm(e: any): void;
}
