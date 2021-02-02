import { SelectMoveEl, SelectMoveElOpts } from "./select-move-el";
import { Subject } from "rxjs";
export interface PickerItem {
    value: string | number;
    label: string;
    disable?: boolean;
}
export interface PickerItemInfo extends PickerItem {
    el: HTMLElement;
    top: number;
    bottom: number;
    midLine: number;
}
export declare class SelectMoveElPicker extends SelectMoveEl {
    list: PickerItem[];
    listInfo: PickerItemInfo[];
    findMidS: number;
    itemHeight: number;
    itemHeightHalf: number;
    uniformAccerleration: number;
    itemActive: PickerItemInfo;
    itemChange: Subject<PickerItemInfo>;
    constructor(opts: SelectMoveElOpts);
    setPickerList(list: PickerItem[], itemQueryName: string): void;
    /**
     * @override touchEndMomentSpeed
     * @param momentSpeed
     */
    touchEndMomentSpeed(momentSpeed: number): void;
    findNearItemByTargetS(targetS: number): PickerItemInfo;
    /**
     * @override
     */
    touchEndStatic(): void;
    setPickerIndexAndDefinePosition(value: number | string): void;
    setCurrentItem(pickerItemInfo: PickerItemInfo): void;
    /**
     * @override
     * @param pos
     */
    backEnd(pos: "top" | "bottom"): void;
}
