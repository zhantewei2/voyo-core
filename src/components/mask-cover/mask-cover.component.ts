import {
  VoyoComponent,
  VoyoEventEmitter,
  VoyoTemplateRef,
} from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { getScrollParent, AnimationDisplay } from "../../utils";
import { getActivePage } from "../utils/selector";
let maskCount = 0;
@VoyoDor({
  template: `
<div class="voyo-mask-cover">
  <div class="_layout-bg"></div>
  <div class="voyo-mask-cover-content">
    <slot></slot>
  </div>
</div>
  `,
  styles: require("./mask-cover.webscss"),
})
export class MaskCoverComponent extends VoyoComponent {
  @VoyoInput({ name: "relative-element" }) relativeElement: HTMLElement;
  @VoyoInput({ name: "relative" }) relative: "next" | "previous";
  @VoyoInput({ name: "show" }) set show1(v: number) {
    const r = !!v;
    if (r == this.show0) return;
    v ? this.toShow() : this.toHide();
    this.show0 = r;
  }
  @VoyoInput({ name: "autoClose", defaultValue: true }) autoClose: boolean;
  @VoyoInput({ name: "displayRoot", defaultValue: true }) displayRoot: boolean;

  @VoyoOutput({ event: "showChange" }) showChange: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();

  show0: boolean;
  preventClickName: string;
  scrollParent: HTMLElement;
  maskEl: HTMLElement;
  contentEl: HTMLElement;
  animation: AnimationDisplay;
  relEl: HTMLElement | any;
  readyRemoveRootListener = false;
  rootEl: HTMLElement;
  restoreListener = false;
  created() {
    this.preventClickName = "voyo-mask-cover-prevent-click" + ++maskCount;
    this.maskEl = this.shadowRoot.querySelector(".voyo-mask-cover");
    this.animation = new AnimationDisplay(this.maskEl, "voyo-animation-fade");
    this.contentEl = this.shadowRoot.querySelector(".voyo-mask-cover-content");
  }
  afterCreate() {
    if (this.autoClose) {
      this.contentEl.addEventListener("click", (e: any) => {
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

    this.relEl.addEventListener(
      "click",
      (e: any) => (e[this.preventClickName] = true),
    );
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
  autoCloseListener = (e: any) => {
    if (!e[this.preventClickName]) this.toHide();
  };
  displayInRoot() {
    this.rootEl.appendChild(this);
  }
  hiddenInRoot() {
    this.rootEl.removeChild(this);
  }
  trigger() {
    if (!this.show0) {
      this.toShow();
    } else if (this.autoClose) {
      return;
    } else {
      this.toHide();
    }
  }
  toShow() {
    if (this.show0) return;
    if (!this.relEl) this.getRelEl();
    if (!this.scrollParent) {
      this.scrollParent = getScrollParent(this.relEl);
    }
    this.scrollParent.style.overflowY = "hidden";
    this.setMaskPosition();
    if (this.displayRoot) this.displayInRoot();
    this.animation.open();
    this.showChange.next((this.show0 = true));
    if (this.autoClose) this.defineAutoClose();
  }
  setMaskPosition() {
    const mask = this.maskEl;
    const rect = this.relEl.getBoundingClientRect();
    mask.style.top = rect.bottom + "px";
  }

  toHide() {
    if (!this.show0) return;
    this.scrollParent.style.overflowY = "auto";
    this.animation.close(false, () => {
      this.hiddenInRoot();
    });
    this.showChange.next((this.show0 = false));
    this.cleanCloseListener();
  }
}
