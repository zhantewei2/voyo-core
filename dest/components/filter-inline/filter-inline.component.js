import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../../components";
import { SelectMoveEl } from "../movable-area/select-move-el";
import { sameArray } from "../../utils/array";
let FilterInlineComponent = class FilterInlineComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.itemElCollections = [];
        this.change = new VoyoEventEmitter();
    }
    set list(v) {
        if (!v)
            return;
        if (this.listContainerEl) {
            this.removeChild(this.listContainerEl);
            this.itemElCollections = [];
        }
        this.listContainerEl = document.createElement("div");
        this.listContainerEl.className = "flex-v-mid flex-row-reverse";
        this.btnList = [];
        v.forEach(i => {
            const btn = document.createElement("voyoc-btn");
            btn.innerText = i.label;
            btn.setAttribute("size", "mini");
            btn.setAttribute("type", "candy");
            btn.setAttribute("color", "gentle");
            btn.style.marginRight = "1rem";
            this.listContainerEl.appendChild(btn);
            this.itemElCollections.push(btn);
            this.btnList.push(Object.assign(Object.assign({}, i), { btn }));
        });
        this.appendChild(this.listContainerEl);
        this.listenerBtnList();
        if (this.value0 && this.value0.length)
            this.handleBtnByValue();
    }
    set value(v) {
        if (!v)
            return;
        if (v && this.value0 && (v == this.value0 || sameArray(v, this.value0)))
            return;
        this.value0 = v;
        if (this.btnList && this.btnList.length)
            this.handleBtnByValue();
    }
    handleBtnByValue(fromTap) {
        if (!this.multiple) {
            if (!this.value0 || !this.value0.length)
                return;
            const value = this.value0[0];
            if (value == undefined && this.singlePreBtn) {
                if (fromTap)
                    this.change.next([undefined]);
                this.singlePreBtn.setAttribute("color", "gentle");
                return (this.singlePreBtn = null);
            }
            const activeBtn = this.btnList.find(i => i.value === value);
            if (!activeBtn)
                return;
            activeBtn.btn.setAttribute("color", "primary");
            if (fromTap)
                this.change.next([value]);
            if (this.singlePreBtn)
                this.singlePreBtn.setAttribute("color", "gentle");
            this.singlePreBtn = activeBtn.btn;
        }
    }
    listenerBtnList() {
        this.btnList.forEach(i => {
            i.btn.addEventListener("voyoTap", () => {
                let value = i.value;
                if (i.btn === this.singlePreBtn)
                    value = undefined;
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
        let reCal = false;
        this.selectMoveEl.moveChange.subscribe(move => {
            if (!reCal) {
                this.selectMoveEl.reCalAllHeight();
                reCal = true;
            }
        });
    }
};
__decorate([
    VoyoInput({})
], FilterInlineComponent.prototype, "tag", void 0);
__decorate([
    VoyoOutput({ event: "change" })
], FilterInlineComponent.prototype, "change", void 0);
__decorate([
    VoyoInput({ name: "multiple", defaultValue: false })
], FilterInlineComponent.prototype, "multiple", void 0);
__decorate([
    VoyoInput({ name: "list" })
], FilterInlineComponent.prototype, "list", null);
__decorate([
    VoyoInput({})
], FilterInlineComponent.prototype, "value", null);
FilterInlineComponent = __decorate([
    VoyoDor({
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
        styles: '.container{-webkit-user-select:none;user-select:none;height:2.5rem}.container,.wrapper{display:flex;overflow:hidden}.wrapper{flex-grow:1;flex-shrink:1;flex-basis:0;text-align:right;align-items:center;flex-wrap:nowrap;padding:.5rem 0}.view,.wrapper{white-space:nowrap}.view{display:inline-block;min-width:100%}.suffix{padding-left:.5rem;padding-right:.5rem;position:relative;display:inline-flex;align-items:center;text-align:center;box-shadow:-6px 0 12px -3px var(--shadow-color)}',
    })
], FilterInlineComponent);
export { FilterInlineComponent };
