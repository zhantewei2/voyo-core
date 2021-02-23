import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { ClassManage } from "../../utils";
import { VoyoOutput } from "../../components";
import { ButtonComponent } from "../button/button.component";
import { SelectMoveEl } from "../movable-area/select-move-el";
import { sameArray } from "../../utils/array";
export interface FilterItem {
  value: string | number | undefined;
  label: string;
}
export interface FilterBtnItem extends FilterItem {
  btn: ButtonComponent;
}

@VoyoDor({
  template: `
  <main class="container">
    <div class="wrapper" style="position:relative;width:100%">
      <div class="view">
        <slot id="viewSlot"></slot>
      </div>
    </div>
    <nav class="suffix">
      <slot name="suffix"> </slot>
    </nav>
  </main>
  `,
  styles: require("./filter-inline.webscss"),
})
export class FilterInlineComponent extends VoyoComponent {
  viewEl: HTMLElement;
  wrapperEl: HTMLElement;
  selectMoveEl: SelectMoveEl;
  viewSlotEl: HTMLSlotElement;
  listContainerEl: HTMLElement;
  itemElCollections: HTMLElement[] = [];
  suffixEl: HTMLElement;
  btnList: FilterBtnItem[];
  value0: any;
  @VoyoInput({}) tag: boolean;
  @VoyoOutput({ event: "change" }) change: VoyoEventEmitter<
    (string | number | undefined)[]
  > = new VoyoEventEmitter<(string | number | undefined)[]>();
  @VoyoInput({ name: "multiple", defaultValue: false }) multiple: boolean;
  @VoyoInput({ name: "list" }) set list(v: FilterItem[]) {
    if (!v) return;
    if (this.listContainerEl) {
      this.removeChild(this.listContainerEl);
      this.itemElCollections = [];
    }
    this.listContainerEl = document.createElement("div");
    this.listContainerEl.className = "flex-v-mid flex-row-reverse";
    this.btnList = [];
    v.forEach(i => {
      const btn: ButtonComponent = document.createElement(
        "voyoc-btn",
      ) as ButtonComponent;
      btn.innerText = i.label;
      btn.setAttribute("size", "mini");
      btn.setAttribute("type", "candy");
      btn.setAttribute("color", "gentle");
      btn.style.marginRight = "1rem";
      this.listContainerEl.appendChild(btn);
      this.itemElCollections.push(btn);
      this.btnList.push({
        ...i,
        btn,
      });
    });
    this.appendChild(this.listContainerEl);
    this.listenerBtnList();
    if (this.value0 && this.value0.length) this.handleBtnByValue();
  }

  @VoyoInput({}) set value(v: (string | number)[]) {
    if (!v) return;

    if (v && this.value0 && (v == this.value0 || sameArray(v, this.value0)))
      return;
    this.value0 = v;
    if (this.btnList && this.btnList.length) this.handleBtnByValue();
  }
  singlePreBtn: ButtonComponent | null;
  handleBtnByValue(fromTap?: boolean) {
    if (!this.multiple) {
      if (!this.value0 || !this.value0.length) return;
      const value = this.value0[0];
      if (value == undefined && this.singlePreBtn) {
        if (fromTap) this.change.next([undefined]);
        this.singlePreBtn.setAttribute("color", "gentle");
        return (this.singlePreBtn = null);
      }
      const activeBtn = this.btnList.find(i => i.value === value);
      if (!activeBtn) return;
      activeBtn.btn.setAttribute("color", "primary");
      if (fromTap) this.change.next([value]);
      if (this.singlePreBtn) this.singlePreBtn.setAttribute("color", "gentle");
      this.singlePreBtn = activeBtn.btn;
    }
  }
  listenerBtnList() {
    this.btnList.forEach(i => {
      i.btn.addEventListener("voyoTap", () => {
        let value = i.value;
        if (i.btn === this.singlePreBtn) value = undefined;
        this.value0 = [value];
        this.handleBtnByValue(true);
      });
    });
  }

  created() {
    this.viewEl = this.shadowRoot.querySelector(".view");
    this.wrapperEl = this.shadowRoot.querySelector(".wrapper");
    this.viewSlotEl = this.shadowRoot.querySelector("#viewSlot");
    this.suffixEl = this.shadowRoot.querySelector(".suffix");
  }
  mounted() {
    this.selectMoveEl = new SelectMoveEl({
      viewEl: this.viewEl,
      wrapperEl: this.wrapperEl,
      behavior: "x",
      topBoundary: 0,
    });

    let reCal: boolean = false;
    this.selectMoveEl.moveChange.subscribe(move => {
      if (!reCal) {
        this.selectMoveEl.reCalAllHeight();
        reCal = true;
      }
    });
  }
}
