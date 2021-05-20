import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../../components";
import { SelectMoveElPicker, } from "../movable-area/select-move-el-picker";
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";
let PickerComponent = class PickerComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.valueChange = new VoyoEventEmitter();
        this.firstList = true;
        this.excuteAfterPickerInit = new ExcuteAfterConnected();
    }
    set pickerList(list) {
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
            if (!this.firstList)
                this.selectMovePicker.reCalAllHeight();
            this.selectMovePicker.setPickerList(this.showList, ".voyo-picker-item");
            if (this._value != undefined)
                this.selectMovePicker.setPickerIndexAndDefinePosition(this._value);
            this.excuteAfterPickerInit.connect();
            this.firstList = false;
        });
    }
    set value(v) {
        if (v === this._value)
            return;
        this.setValue(v);
    }
    /**
     * disable parent container scroll while picker move
     * @param v
     */
    set disableParentScroll(v) {
        this.excuteAfterPickerInit.execute(() => {
            this.selectMovePicker.preventParentScroll = !!v;
        });
    }
    created() {
        this.containerEl = this.shadowRoot.querySelector(".voyo-picker-container");
        this.listWrapperEl = this.shadowRoot.querySelector(".voyo-picker-list-wrapper");
        this.listViewEl = this.shadowRoot.querySelector(".voyo-picker-list-view");
    }
    setValue(v) {
        if (this.selectMovePicker) {
            this.selectMovePicker.setPickerIndexAndDefinePosition(v);
        }
        this._value = v;
    }
    createItem(itemList) {
        this.showList = [
            { label: "", value: "", disable: true },
            { label: "", value: "", disable: true },
            ...itemList,
            { label: "", value: "", disable: true },
            { label: "", value: "", disable: true },
        ];
        this.listViewEl.innerHTML = `
    ${this.showList
            .map(i => `
      <div class="voyo-picker-item">${i.label}</div>
    `)
            .join("")}
    `;
    }
};
__decorate([
    VoyoInput({ name: "pickerList" })
], PickerComponent.prototype, "pickerList", null);
__decorate([
    VoyoInput({ name: "value" })
], PickerComponent.prototype, "value", null);
__decorate([
    VoyoInput({ name: "disableParentScroll" })
], PickerComponent.prototype, "disableParentScroll", null);
__decorate([
    VoyoOutput({ event: "valueChange" })
], PickerComponent.prototype, "valueChange", void 0);
PickerComponent = __decorate([
    VoyoDor({
        template: `
<div class="voyo-picker-container">
  <div class="voyo-picker-list-wrapper">
    <div class="voyo-picker-list-cover-top"></div>
    <div class="voyo-picker-list-view"></div>
    <div class="voyo-picker-list-cover-bottom"></div>
  </div>
</div>
  `,
        styles: 'div{box-sizing:border-box}.voyo-picker-item{text-align:center;height:3rem;line-height:3rem}.voyo-picker-list-wrapper{height:15rem;overflow:hidden;width:100%;position:relative;contain:strict;-webkit-user-select:none;user-select:none;touch-action:none}.voyo-picker-list-view{will-change:transform}.voyo-picker-list-cover-bottom,.voyo-picker-list-cover-top{background:var(--color-bg5);width:100%;height:6rem;position:absolute}.voyo-picker-list-cover-top{top:0;left:0;z-index:1;background-image:linear-gradient(0deg,var(--color-bg5),var(--color-bg4))}.voyo-picker-list-cover-top:after{content:"";position:absolute;height:1px;bottom:0;width:100%;left:0;transform:scaleY(.4);background:var(--color-after-border)}.voyo-picker-list-cover-bottom{bottom:0;left:0;z-index:1;background-image:linear-gradient(180deg,var(--color-bg5),var(--color-bg4))}.voyo-picker-list-cover-bottom:after{content:"";position:absolute;height:1px;width:100%;left:0;top:0;transform:scaleY(.4);background:var(--color-after-border)}',
    })
], PickerComponent);
export { PickerComponent };
