import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { ButtonComponent } from "../button/button.component";
import { SelectMoveEl } from "../movable-area/select-move-el";
export interface FilterItem {
    value: string | number | undefined;
    label: string;
}
export interface FilterBtnItem extends FilterItem {
    btn: ButtonComponent;
}
export declare class FilterInlineComponent extends VoyoComponent {
    viewEl: HTMLElement;
    wrapperEl: HTMLElement;
    selectMoveEl: SelectMoveEl;
    viewSlotEl: HTMLSlotElement;
    listContainerEl: HTMLElement;
    itemElCollections: HTMLElement[];
    suffixEl: HTMLElement;
    btnList: FilterBtnItem[];
    value0: any;
    tag: boolean;
    change: VoyoEventEmitter<(string | number | undefined)[]>;
    multiple: boolean;
    set list(v: FilterItem[]);
    set value(v: (string | number)[]);
    singlePreBtn: ButtonComponent | null;
    handleBtnByValue(fromTap?: boolean): null | undefined;
    listenerBtnList(): void;
    created(): void;
    mounted(): void;
}
