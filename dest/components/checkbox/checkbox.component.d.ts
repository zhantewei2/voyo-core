import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { BtnTypeVarious } from "@voyo/core/types/base-types";
export declare class CheckboxComponent extends VoyoComponent {
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
