import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter, } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { getScrollParent, AnimationDisplay } from "../../utils";
import { getActivePage } from "../utils/selector";
let maskCount = 0;
let MaskCoverComponent = class MaskCoverComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.showChange = new VoyoEventEmitter();
        this.readyRemoveRootListener = false;
        this.restoreListener = false;
        this.autoCloseListener = (e) => {
            if (!e[this.preventClickName])
                this.toHide();
        };
    }
    set show1(v) {
        const r = !!v;
        if (r == this.show0)
            return;
        v ? this.toShow() : this.toHide();
        this.show0 = r;
    }
    created() {
        this.preventClickName = "voyo-mask-cover-prevent-click" + ++maskCount;
        this.maskEl = this.shadowRoot.querySelector(".voyo-mask-cover");
        this.animation = new AnimationDisplay(this.maskEl, "voyo-animation-fade");
        this.contentEl = this.shadowRoot.querySelector(".voyo-mask-cover-content");
    }
    afterCreate() {
        if (this.autoClose) {
            this.contentEl.addEventListener("click", (e) => {
                e[this.preventClickName] = true;
            });
        }
    }
    mounted() {
        const { pageEmbeddedContainer } = getActivePage();
        this.rootEl = pageEmbeddedContainer;
    }
    disconnectedCallback() {
        this.cleanCloseListener();
    }
    connectedCallback() {
        if (this.restoreListener) {
            this.defineAutoClose();
        }
    }
    getRelEl() {
        this.relEl =
            this.relativeElement ||
                (this.relative === "next"
                    ? this.nextElementSibling
                    : this.relative === "previous"
                        ? this.previousElementSibling
                        : null);
        this.relEl.addEventListener("click", (e) => (e[this.preventClickName] = true));
    }
    defineAutoClose() {
        if (!this.readyRemoveRootListener)
            setTimeout(() => {
                this.rootEl.addEventListener("click", this.autoCloseListener);
                this.readyRemoveRootListener = true;
            });
    }
    cleanCloseListener() {
        if (this.readyRemoveRootListener) {
            this.rootEl.removeEventListener("click", this.autoCloseListener, {
                capture: false,
            });
            this.readyRemoveRootListener = false;
            this.restoreListener = this.show0;
        }
    }
    displayInRoot() {
        this.rootEl.appendChild(this);
    }
    hiddenInRoot() {
        this.rootEl.removeChild(this);
    }
    trigger() {
        if (!this.show0) {
            this.toShow();
        }
        else if (this.autoClose) {
            return;
        }
        else {
            this.toHide();
        }
    }
    toShow() {
        if (this.show0)
            return;
        if (!this.relEl)
            this.getRelEl();
        if (!this.scrollParent) {
            this.scrollParent = getScrollParent(this.relEl);
        }
        this.scrollParent.style.overflowY = "hidden";
        this.setMaskPosition();
        if (this.displayRoot)
            this.displayInRoot();
        this.animation.open();
        this.showChange.next((this.show0 = true));
        if (this.autoClose)
            this.defineAutoClose();
    }
    setMaskPosition() {
        const mask = this.maskEl;
        const rect = this.relEl.getBoundingClientRect();
        mask.style.top = rect.bottom + "px";
    }
    toHide() {
        if (!this.show0)
            return;
        this.scrollParent.style.overflowY = "auto";
        this.animation.close(false, () => {
            this.hiddenInRoot();
        });
        this.showChange.next((this.show0 = false));
        this.cleanCloseListener();
    }
};
__decorate([
    VoyoInput({ name: "relative-element" })
], MaskCoverComponent.prototype, "relativeElement", void 0);
__decorate([
    VoyoInput({ name: "relative" })
], MaskCoverComponent.prototype, "relative", void 0);
__decorate([
    VoyoInput({ name: "show" })
], MaskCoverComponent.prototype, "show1", null);
__decorate([
    VoyoInput({ name: "autoClose", defaultValue: true })
], MaskCoverComponent.prototype, "autoClose", void 0);
__decorate([
    VoyoInput({ name: "displayRoot", defaultValue: true })
], MaskCoverComponent.prototype, "displayRoot", void 0);
__decorate([
    VoyoOutput({ event: "showChange" })
], MaskCoverComponent.prototype, "showChange", void 0);
MaskCoverComponent = __decorate([
    VoyoDor({
        template: `
<div class="voyo-mask-cover">
  <div class="_layout-bg"></div>
  <div class="voyo-mask-cover-content">
    <slot></slot>
  </div>
</div>
  `,
        styles: '@-webkit-keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@-webkit-keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}@keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}.voyo-mask-cover{bottom:0;left:0;width:100%;position:fixed;display:none;z-index:501}.voyo-mask-cover ._layout-bg{background:var(--color-bg-deep);opacity:.6;position:absolute;top:0;left:0;width:100%;height:100%;transition:all .3s ease-out}.voyo-animation-fade-enter{opacity:0;transform:translate3d(0,10%,0)}.voyo-animation-fade-enter-active{transition:all .3s ease}.voyo-animation-fade-enter-to{opacity:1}.voyo-animation-fade-leave-active{opacity:0;transform:translate3d(0,10%,0);transition:all .3s ease}.voyo-mask-cover-content{position:relative}',
    })
], MaskCoverComponent);
export { MaskCoverComponent };
