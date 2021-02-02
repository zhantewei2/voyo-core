import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { SelectMoveElPicker, PickerItem } from "../movable-area/select-move-el-picker";
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";
export declare class PickerComponent extends VoyoComponent {
    set pickerList(list: PickerItem[]);
    set value(v: string | number);
    /**
     * disable parent container scroll while picker move
     * @param v
     */
    set disableParentScroll(v: boolean);
    valueChange: VoyoEventEmitter<string | number>;
    firstList: boolean;
    containerEl: HTMLElement;
    listWrapperEl: HTMLElement;
    listViewEl: HTMLElement;
    selectMovePicker: SelectMoveElPicker;
    showList: PickerItem[];
    _value: string | number;
    excuteAfterPickerInit: ExcuteAfterConnected;
    created(): void;
    setValue(v: string | number): void;
    createItem(itemList: PickerItem[]): void;
}
