import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { VoyoOutput } from "../../components";
import {
  SelectMoveElPicker,
  PickerItem,
} from "../movable-area/select-move-el-picker";
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";

@VoyoDor({
  template: `
<div class="voyo-picker-container">
  <div class="voyo-picker-list-wrapper">
    <div class="voyo-picker-list-cover-top"></div>
    <div class="voyo-picker-list-view"></div>
    <div class="voyo-picker-list-cover-bottom"></div>
  </div>
</div>
  `,
  styles: require("./picker.webscss"),
})
export class PickerComponent extends VoyoComponent {
  @VoyoInput({ name: "pickerList" }) set pickerList(list: PickerItem[]) {
    this.createItem(list);
    setTimeout(() => {
      if (!this.selectMovePicker) {
        this.selectMovePicker = new SelectMoveElPicker({
          viewEl: this.listViewEl,
          wrapperEl: this.listWrapperEl,
          topBoundary: 0,
        });
        this.selectMovePicker.itemChange.subscribe(item => {
          this._value = item.value;
          this.valueChange.next(item.value);
        });
      }

      if (!this.firstList) this.selectMovePicker.reCalAllHeight();
      this.selectMovePicker.setPickerList(this.showList, ".voyo-picker-item");
      if (this._value != undefined)
        this.selectMovePicker.setPickerIndexAndDefinePosition(this._value);
      this.excuteAfterPickerInit.connect();
      this.firstList = false;
    });
  }
  @VoyoInput({ name: "value" }) set value(v: string | number) {
    if (v === this._value) return;
    this.setValue(v);
  }

  /**
   * disable parent container scroll while picker move
   * @param v
   */
  @VoyoInput({ name: "disableParentScroll" }) set disableParentScroll(
    v: boolean,
  ) {
    this.excuteAfterPickerInit.execute(() => {
      this.selectMovePicker.preventParentScroll = !!v;
    });
  }
  @VoyoOutput({ event: "valueChange" }) valueChange: VoyoEventEmitter<
    string | number
  > = new VoyoEventEmitter();
  firstList = true;
  containerEl: HTMLElement;
  listWrapperEl: HTMLElement;
  listViewEl: HTMLElement;
  selectMovePicker: SelectMoveElPicker;
  showList: PickerItem[];
  _value: string | number;
  excuteAfterPickerInit: ExcuteAfterConnected = new ExcuteAfterConnected();
  created() {
    this.containerEl = this.shadowRoot.querySelector(".voyo-picker-container");
    this.listWrapperEl = this.shadowRoot.querySelector(
      ".voyo-picker-list-wrapper",
    );
    this.listViewEl = this.shadowRoot.querySelector(".voyo-picker-list-view");
  }
  setValue(v: string | number) {
    if (this.selectMovePicker) {
      this.selectMovePicker.setPickerIndexAndDefinePosition(v);
    }
    this._value = v;
  }
  createItem(itemList: PickerItem[]) {
    this.showList = [
      { label: "", value: "", disable: true },
      { label: "", value: "", disable: true },
      ...itemList,
      { label: "", value: "", disable: true },
      { label: "", value: "", disable: true },
    ];
    this.listViewEl.innerHTML = `
    ${this.showList
      .map(
        i => `
      <div class="voyo-picker-item">${i.label}</div>
    `,
      )
      .join("")}
    `;
  }
}
