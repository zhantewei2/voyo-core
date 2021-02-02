import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ColorVarious, SizeVarious } from "../../types/base-types";
import { InputType } from "./input.interface";
import { ClassManage } from "../../utils/ClassManage";
import closeSvg from "../../assets/input-close.svg";
import { ExcuteAfterConnected } from "../utils";
import { VisualInput } from "./visual-input";
import { Input, InputInterface, visualInputType } from "./input";
import { TapInput } from "./tap-input";
@VoyoDor({
  template: `
<main class="voyo-input-wrapper">
    <header class="_header"></header>
    <article class="_container">
        <span class="_prefix">
            <span class="_adapter-container">
                <slot name="prefix"></slot>
            </span>
            <div class="_placeholder"></div>
        </span>
        <span class="_input-container">
            
        </span>
        <span class="_clear">
           <img class="_close" src="${closeSvg}">
        </span>
        <span class="_suffix">
            <slot name="suffix"></slot>
        </span>
        <span class="_container-line"></span>
    </article>
    <footer class="_footer">
        <slot name="footer"></slot>
    </footer>
</main>
  `,
  styles: require("./input.webscss"),
})
export class InputComponent extends VoyoComponent {
  wrapper: HTMLElement;
  inputContainer: HTMLElement;
  classManage: ClassManage;
  inputType: InputType;
  placeholderEl: HTMLElement;
  prefixEl: HTMLElement;
  clearEl: HTMLElement;
  _disabled: boolean;
  excuteAfterConnected: ExcuteAfterConnected = new ExcuteAfterConnected();
  @VoyoInput({ name: "onlyTap" }) onlyTap: boolean;
  @VoyoInput({ name: "clearable", defaultValue: true }) clearable: boolean;
  @VoyoInput({ name: "disabled" }) set disabled(v: boolean) {
    this._disabled = v;
    this.excuteAfterConnected.execute(() => {
      if (this.input) this.input.disabled = v;
    });
  }
  @VoyoInput({ name: "size", defaultValue: "now" })
  set size(v: SizeVarious) {
    this.classManage.replaceClass("size", `__size-${v}`);
  }

  @VoyoInput({ name: "color", defaultValue: "primary" })
  set color(v: ColorVarious) {
    this.classManage.replaceClass("color", `__color-${v}`);
  }
  @VoyoInput({ name: "type", defaultValue: "flat" })
  set type(v: InputType) {
    this.inputType = v;
    this.classManage.replaceClass("type", `__type-${v}`);
  }

  @VoyoInput({ name: "placeholder" }) set placeholder(v: string) {
    this.placeholderEl.innerText = v;
  }
  // input type
  @VoyoInput({ name: "contentType" }) set contentType(v: visualInputType) {
    this.excuteAfterConnected.execute(() => {
      this.input && this.input.setType(v);
    });
  }
  @VoyoInput({ name: "visual" }) visual: boolean;
  @VoyoInput({ name: "value" }) set value(v: any) {
    this.setValue(v);
  }

  @VoyoOutput({ event: "valueChange" }) valueEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  @VoyoOutput({ event: "focus" }) focusEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  @VoyoOutput({ event: "blur" }) blurEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  @VoyoOutput({ event: "tap" }) tapEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  @VoyoOutput({ event: "enter" }) enterEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  @VoyoOutput({ event: "clear" }) clearEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  prefixExists0 = false;
  input: InputInterface;
  tapInput: TapInput;

  set prefixExists(v: boolean) {
    if (v === this.prefixExists0) return;
    this.prefixExists0 = v;
    this.classManage.toggleClass("__prefix", v);
  }
  suffixExists0 = false;
  set suffixExists(v: boolean) {
    if (v === this.suffixExists0) return;
    this.suffixExists0 = v;
    this.classManage.toggleClass("__suffix", v);
  }
  footerExists0 = false;
  set footerExists(v: boolean) {
    if (v === this.footerExists0) return;
    this.footerExists0 = v;
    this.classManage.toggleClass("__footer", v);
  }

  placeholderShow: undefined | boolean = undefined;
  getPrefixWidth(): number {
    return this.prefixEl.offsetWidth;
  }
  showPlaceholderRun(v: boolean) {
    this.classManage.toggleClass("__show-placeholder", v);
  }

  showPlaceHolder(v: boolean) {
    if (v === this.placeholderShow) return;
    this.placeholderShow = v;
    if (!this.excuteAfterConnected.isConnected) {
      this.showPlaceholderRun(v);
    } else {
      this.excuteAfterConnected.execute(() => {
        this.showPlaceholderRun(v);
      });
    }
  }
  watchPlaceholderShow() {
    if (!this.isFocus && !this.value0) {
      this.showPlaceHolder(true);
    } else {
      this.showPlaceHolder(false);
    }
  }
  isClearable = false;
  watchClearable() {
    const isClearable: boolean = !!this.value0 && this.isFocus0;
    if (isClearable === this.isClearable) return;
    setTimeout(() => {
      this.classManage.toggleClass(
        "__clearable",
        this.clearable ? isClearable : false,
      );
    }, 10);
    this.isClearable = isClearable;
  }
  isFocus0 = false;
  set isFocus(v: boolean) {
    this.isFocus0 = v;
    this.watchPlaceholderShow();
    this.watchClearable();
  }
  get isFocus() {
    return this.isFocus0;
  }
  focus() {
    if (this.isFocus) return;
    this.isFocus = true;
    this.input.toFocus();
    this.classManage.toggleClass("__focus", true);
    // this.focusEvent.next();
  }
  blur() {
    if (!this.isFocus) return;
    this.isFocus = false;
    this.input.toBlur();
    this.classManage.toggleClass("__focus", false);
    // this.blurEvent.next();
  }
  toFocus() {
    this.excuteAfterConnected.execute(() => {
      this.input.toFocus();
    });
  }
  enter() {
    this.blur();
    this.enterEvent.next(true);
  }
  value0: any;
  setValue(v: any, fromInput = false) {
    this.excuteAfterConnected.execute(() => {
      if (v === this.value0) return;
      this.value0 = v;
      if (!fromInput) {
        this.input && this.input.setValue(v);
        this.tapInput && this.tapInput.setValue(v);
      } else {
        this.valueEvent.next(v.toString());
      }
      this.watchPlaceholderShow();
      this.watchClearable();
    });
  }
  clearValue() {
    this.setValue("");
    this.valueEvent.next("");
    this.clearEvent.next(true);
  }
  created() {
    this.wrapper = this.shadowRoot.querySelector(".voyo-input-wrapper");
    this.inputContainer = this.shadowRoot.querySelector("._input-container");
    this.placeholderEl = this.shadowRoot.querySelector("._placeholder");
    this.prefixEl = this.shadowRoot.querySelector("._prefix");
    this.clearEl = this.shadowRoot.querySelector("._clear");

    this.classManage = new ClassManage(this.wrapper);
    this.listenSlotChange();
  }

  mounted() {
    if (this.onlyTap) {
      this.tapInput = new TapInput();
      this.inputContainer.addEventListener("click", () => {
        if (!this._disabled) this.tapEvent.next();
      });
      this.inputContainer.appendChild(this.tapInput.getInputEl());
    } else {
      this.input = !this.visual ? new Input() : new VisualInput();
      const inputElement = this.input.getInputEl();
      inputElement.classList.add("_input");
      this.inputContainer.appendChild(inputElement);
      this.input.onFocus.subscribe(() => {
        this.focus();
      });

      this.input.onBlur.subscribe(() => {
        this.blur();
      });
      this.input.onKeypress.subscribe(e => {
        if (e === 13) {
          this.enter();
        }
      });
      this.input.onInput.subscribe(v => {
        this.setValue(v, true);
      });
    }
    this.clearEl.addEventListener("click", () => {
      this.clearValue();
    });
    this.watchPlaceholderShow();
    this.handleFooterSlot();
    this.excuteAfterConnected.connect();
  }
  disconnectedCallback() {
    this.input && this.input.destroy && this.input.destroy();
  }
  listenSlotChange() {
    const prefixSlot: HTMLSlotElement = this.shadowRoot.querySelector(
      "slot[name='prefix']",
    );
    const suffixSlot: HTMLSlotElement = this.shadowRoot.querySelector(
      "slot[name='suffix']",
    );
    const footerSlot: HTMLSlotElement = this.shadowRoot.querySelector(
      "slot[name='footer']",
    );

    prefixSlot.addEventListener("slotchange", () => {
      this.prefixExists = (prefixSlot.assignedNodes() || []).length > 0;
    });
    suffixSlot.addEventListener("slotchange", () => {
      this.suffixExists = (suffixSlot.assignedNodes() || []).length > 0;
    });
    footerSlot.addEventListener("slotchange", () => {
      this.footerExists = (footerSlot.assignedNodes() || []).length > 0;
    });
  }
  handleFooterSlot() {}
}
