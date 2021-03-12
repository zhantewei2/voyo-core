import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ClassManage } from "../../utils/ClassManage";
import { EwkIySR as closeSvg } from "../../svg.js";
import { ExcuteAfterConnected } from "../utils";
import { VisualInput } from "./visual-input";
import { Input } from "./input";
import { TapInput } from "./tap-input";
let InputComponent = class InputComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.excuteAfterConnected = new ExcuteAfterConnected();
        this.valueEvent = new VoyoEventEmitter();
        this.focusEvent = new VoyoEventEmitter();
        this.blurEvent = new VoyoEventEmitter();
        this.tapEvent = new VoyoEventEmitter();
        this.enterEvent = new VoyoEventEmitter();
        this.clearEvent = new VoyoEventEmitter();
        this.prefixExists0 = false;
        this.suffixExists0 = false;
        this.footerExists0 = false;
        this.placeholderShow = undefined;
        this.isClearable = false;
        this.isFocus0 = false;
    }
    set disabled(v) {
        this._disabled = v;
        this.excuteAfterConnected.execute(() => {
            if (this.input)
                this.input.disabled = v;
        });
    }
    set size(v) {
        this.classManage.replaceClass("size", `__size-${v}`);
    }
    set color(v) {
        this.classManage.replaceClass("color", `__color-${v}`);
    }
    set type(v) {
        this.inputType = v;
        this.classManage.replaceClass("type", `__type-${v}`);
    }
    set placeholder(v) {
        this.placeholderEl.innerText = v;
    }
    // input type
    set contentType(v) {
        this.excuteAfterConnected.execute(() => {
            this.input && this.input.setType(v);
        });
    }
    set value(v) {
        this.setValue(v);
    }
    set prefixExists(v) {
        if (v === this.prefixExists0)
            return;
        this.prefixExists0 = v;
        this.classManage.toggleClass("__prefix", v);
    }
    set suffixExists(v) {
        if (v === this.suffixExists0)
            return;
        this.suffixExists0 = v;
        this.classManage.toggleClass("__suffix", v);
    }
    set footerExists(v) {
        if (v === this.footerExists0)
            return;
        this.footerExists0 = v;
        this.classManage.toggleClass("__footer", v);
    }
    getPrefixWidth() {
        return this.prefixEl.offsetWidth;
    }
    showPlaceholderRun(v) {
        this.classManage.toggleClass("__show-placeholder", v);
    }
    showPlaceHolder(v) {
        if (v === this.placeholderShow)
            return;
        this.placeholderShow = v;
        if (!this.excuteAfterConnected.isConnected) {
            this.showPlaceholderRun(v);
        }
        else {
            this.excuteAfterConnected.execute(() => {
                this.showPlaceholderRun(v);
            });
        }
    }
    watchPlaceholderShow() {
        if (!this.isFocus && !this.value0) {
            this.showPlaceHolder(true);
        }
        else {
            this.showPlaceHolder(false);
        }
    }
    watchClearable() {
        const isClearable = !!this.value0 && this.isFocus0;
        if (isClearable === this.isClearable)
            return;
        setTimeout(() => {
            this.classManage.toggleClass("__clearable", this.clearable ? isClearable : false);
        }, 10);
        this.isClearable = isClearable;
    }
    set isFocus(v) {
        this.isFocus0 = v;
        this.watchPlaceholderShow();
        this.watchClearable();
    }
    get isFocus() {
        return this.isFocus0;
    }
    focus() {
        if (this.isFocus)
            return;
        this.isFocus = true;
        this.input.toFocus();
        this.classManage.toggleClass("__focus", true);
        // this.focusEvent.next();
    }
    blur() {
        if (!this.isFocus)
            return;
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
    setValue(v, fromInput = false) {
        this.excuteAfterConnected.execute(() => {
            if (v === this.value0)
                return;
            this.value0 = v;
            if (!fromInput) {
                this.input && this.input.setValue(v);
                this.tapInput && this.tapInput.setValue(v);
            }
            else {
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
                if (!this._disabled)
                    this.tapEvent.next();
            });
            this.inputContainer.appendChild(this.tapInput.getInputEl());
        }
        else {
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
        const prefixSlot = this.shadowRoot.querySelector("slot[name='prefix']");
        const suffixSlot = this.shadowRoot.querySelector("slot[name='suffix']");
        const footerSlot = this.shadowRoot.querySelector("slot[name='footer']");
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
    handleFooterSlot() { }
};
__decorate([
    VoyoInput({ name: "onlyTap" })
], InputComponent.prototype, "onlyTap", void 0);
__decorate([
    VoyoInput({ name: "clearable", defaultValue: true })
], InputComponent.prototype, "clearable", void 0);
__decorate([
    VoyoInput({ name: "disabled" })
], InputComponent.prototype, "disabled", null);
__decorate([
    VoyoInput({ name: "size", defaultValue: "now" })
], InputComponent.prototype, "size", null);
__decorate([
    VoyoInput({ name: "color", defaultValue: "primary" })
], InputComponent.prototype, "color", null);
__decorate([
    VoyoInput({ name: "type", defaultValue: "flat" })
], InputComponent.prototype, "type", null);
__decorate([
    VoyoInput({ name: "placeholder" })
], InputComponent.prototype, "placeholder", null);
__decorate([
    VoyoInput({ name: "contentType" })
], InputComponent.prototype, "contentType", null);
__decorate([
    VoyoInput({ name: "visual" })
], InputComponent.prototype, "visual", void 0);
__decorate([
    VoyoInput({ name: "value" })
], InputComponent.prototype, "value", null);
__decorate([
    VoyoOutput({ event: "valueChange" })
], InputComponent.prototype, "valueEvent", void 0);
__decorate([
    VoyoOutput({ event: "focus" })
], InputComponent.prototype, "focusEvent", void 0);
__decorate([
    VoyoOutput({ event: "blur" })
], InputComponent.prototype, "blurEvent", void 0);
__decorate([
    VoyoOutput({ event: "tap" })
], InputComponent.prototype, "tapEvent", void 0);
__decorate([
    VoyoOutput({ event: "enter" })
], InputComponent.prototype, "enterEvent", void 0);
__decorate([
    VoyoOutput({ event: "clear" })
], InputComponent.prototype, "clearEvent", void 0);
InputComponent = __decorate([
    VoyoDor({
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
        styles: '.voyo-input-wrapper ._input{outline:none;border:none;-webkit-appearance:none;background:transparent;box-sizing:border-box;font-family:var(--font-family)}@-webkit-keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@-webkit-keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}@keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}.voyo-input-wrapper{margin:.2em 0}.voyo-input-wrapper ._clear,.voyo-input-wrapper ._prefix,.voyo-input-wrapper ._suffix{z-index:1;position:relative;height:100%;min-width:1px;display:inline-flex;justify-content:center;align-items:center;box-sizing:border-box}.voyo-input-wrapper ._container{position:relative;display:flex;align-items:center;padding:0 .5em}.voyo-input-wrapper ._input-container{position:relative;z-index:1;height:100%}.voyo-input-wrapper ._container-line{opacity:0;height:2px;width:100%;position:absolute;left:50%;bottom:0;background:var(--color-bg-deep3);transform:translate(-50%) scaleX(.1);transition:all .2s ease}.voyo-input-wrapper ._placeholder{position:absolute;top:0;left:0;padding-top:.5em;padding-left:.5em;z-index:-1;line-height:1;transition:all .3s ease-out;white-space:nowrap;width:100%;box-sizing:border-box;font-size:inherit;color:var(--color-font-assist)}.voyo-input-wrapper ._input-container{flex-grow:1;flex-shrink:1;flex-basis:0}.voyo-input-wrapper ._input{height:100%;width:100%;font-size:inherit;padding:.5em}.voyo-input-wrapper ._input.__visual-input{display:flex;align-items:center}.voyo-input-wrapper ._clear{display:none;padding:.2em .5em}.voyo-input-wrapper.__clearable ._clear{display:inline-flex}.voyo-input-wrapper.__prefix ._prefix{min-width:50px;padding:.2em .5em}.voyo-input-wrapper.__suffix ._suffix{padding:.2em .5em}.voyo-input-wrapper.__footer ._footer{min-height:1.2em;line-height:1;padding:.2em .2em 0}.voyo-input-wrapper ._close{width:1em}.voyo-input-wrapper.__type-flat ._container:after{content:"";position:absolute;height:1px;bottom:0;width:100%;left:0;transform:scaleY(.4);background:var(--color-after-border)}.voyo-input-wrapper.__type-flat ._placeholder{opacity:0;transform:translate3d(100%,.25em,0)}.voyo-input-wrapper.__type-flat.__show-placeholder ._placeholder{opacity:1}.voyo-input-wrapper.__type-candy ._placeholder{opacity:0;transform:translate3d(100%,.5em,0)}.voyo-input-wrapper.__type-candy.__show-placeholder ._placeholder{opacity:1}.voyo-input-wrapper.__type-md ._container:after{content:"";position:absolute;height:1px;bottom:0;width:100%;left:0;transform:scaleY(.4);background:var(--color-after-border)}.voyo-input-wrapper.__type-md ._input{color:var(--color-font-content)}.voyo-input-wrapper.__type-md.__focus ._container-line{opacity:1;transform:translate(-50%) scaleX(1)}.voyo-input-wrapper.__type-md ._placeholder{transform:translate3d(100%,0,0);opacity:0}.voyo-input-wrapper.__type-md.__show-placeholder ._placeholder{opacity:1;color:var(--color-font-assist);transform:translate3d(100%,.25em,0)}.voyo-input-wrapper.__type-md.__color-error ._container:after{content:"";position:absolute;height:1px;bottom:0;width:100%;left:0;transform:scaleY(.4);background:var(--color-error)}.voyo-input-wrapper.__type-md.__color-error ._container-line{background:var(--color-error)}.voyo-input-wrapper.__type-candy ._container{border-radius:2em;background:var(--color-bg3)}.voyo-input-wrapper.__size-mini{font-size:var(--size-mini)}.voyo-input-wrapper.__size-mini.__type-md ._header{height:calc(var(--size-mini)*0.2)}.voyo-input-wrapper.__size-mini.__type-flat ._container,.voyo-input-wrapper.__size-mini.__type-md ._container{height:calc(var(--size-mini)*2.5)}.voyo-input-wrapper.__size-mini.__type-candy ._container{height:calc(var(--size-mini)*3)}.voyo-input-wrapper.__size-small{font-size:var(--size-small)}.voyo-input-wrapper.__size-small.__type-md ._header{height:calc(var(--size-small)*0.2)}.voyo-input-wrapper.__size-small.__type-flat ._container,.voyo-input-wrapper.__size-small.__type-md ._container{height:calc(var(--size-small)*2.5)}.voyo-input-wrapper.__size-small.__type-candy ._container{height:calc(var(--size-small)*3)}.voyo-input-wrapper.__size-now{font-size:var(--size-now)}.voyo-input-wrapper.__size-now.__type-md ._header{height:calc(var(--size-now)*0.2)}.voyo-input-wrapper.__size-now.__type-flat ._container,.voyo-input-wrapper.__size-now.__type-md ._container{height:calc(var(--size-now)*2.5)}.voyo-input-wrapper.__size-now.__type-candy ._container{height:calc(var(--size-now)*3)}.voyo-input-wrapper.__size-medium{font-size:var(--size-medium)}.voyo-input-wrapper.__size-medium.__type-md ._header{height:calc(var(--size-medium)*0.2)}.voyo-input-wrapper.__size-medium.__type-flat ._container,.voyo-input-wrapper.__size-medium.__type-md ._container{height:calc(var(--size-medium)*2.5)}.voyo-input-wrapper.__size-medium.__type-candy ._container{height:calc(var(--size-medium)*3)}.voyo-input-wrapper.__size-strong{font-size:var(--size-strong)}.voyo-input-wrapper.__size-strong.__type-md ._header{height:calc(var(--size-strong)*0.2)}.voyo-input-wrapper.__size-strong.__type-flat ._container,.voyo-input-wrapper.__size-strong.__type-md ._container{height:calc(var(--size-strong)*2.5)}.voyo-input-wrapper.__size-strong.__type-candy ._container{height:calc(var(--size-strong)*3)}.voyo-input-wrapper.__size-large{font-size:var(--size-large)}.voyo-input-wrapper.__size-large.__type-md ._header{height:calc(var(--size-large)*0.2)}.voyo-input-wrapper.__size-large.__type-flat ._container,.voyo-input-wrapper.__size-large.__type-md ._container{height:calc(var(--size-large)*2.5)}.voyo-input-wrapper.__size-large.__type-candy ._container{height:calc(var(--size-large)*3)}@-webkit-keyframes Ficker{0%{opacity:0}to{opacity:1}}@keyframes Ficker{0%{opacity:0}to{opacity:1}}._visual-input-cursor._show{display:block;height:70%;width:2px;background:var(--color-font-base);-webkit-animation:Ficker .5s ease infinite;animation:Ficker .5s ease infinite;-webkit-animation-direction:alternate;animation-direction:alternate;margin-left:.2em}._adapter-container{height:100%;display:flex;justify-content:center;align-items:center}',
    })
], InputComponent);
export { InputComponent };
