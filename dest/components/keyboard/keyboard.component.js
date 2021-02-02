import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter, } from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ExcuteAfterConnected } from "../utils";
import { ClassManage } from "../../utils";
import { deleteSvg } from "../utils/svg";
let KeyboardComponent = class KeyboardComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.value0 = "";
        this.keyPress = new VoyoEventEmitter();
        this.valueChange = new VoyoEventEmitter();
        this.executeAfterContentInit = new ExcuteAfterConnected();
        this.keys = [
            [{ value: "1" }, { value: "2" }, { value: "3" }],
            [{ value: "4" }, { value: "5" }, { value: "6" }],
            [{ value: "7" }, { value: "8" }, { value: "9" }],
            [
                { value: "." },
                { value: "0" },
                {
                    value: "del",
                    svg: deleteSvg("var(--color-font-content)", "voyo-keyboard-item-icon"),
                },
            ],
        ];
        this.restoreBody = false;
    }
    set useEnter(v) {
        this.executeAfterContentInit.execute(() => {
            this.keyboardContentManage.replaceClass("useEnter", v ? "__double" : "__alone");
        });
    }
    set value(v) {
        this.value0 = v;
    }
    created() {
        this.container = this.shadowRoot.querySelector("#keyboard-container");
    }
    listenKeyTouch(btns) {
        let v;
        btns.forEach(btn => {
            btn.addEventListener("touchstart", e => {
                navigator.vibrate && navigator.vibrate(100);
                v = btn.dataset.value;
                this.keyPress.next(Number(v) || v);
                this.handleValue(v);
            }, { capture: true });
        });
    }
    handleValue(key) {
        let value = this.value0 ? this.value0.toString() : "";
        if (key === "del") {
            if (value === "")
                return;
            if (value.length) {
                value = value.slice(0, value.length - 1);
            }
        }
        else {
            value += key;
        }
        if (value != this.value0) {
            this.valueChange.next((this.value0 = value));
        }
    }
    show() {
        if (!this.insertInBody) {
            document.body.appendChild(this);
            this.insertInBody = true;
        }
        this.keyboardTemplate.insert(this.container, "voyo-keyboard-an-in");
    }
    hide() {
        this.keyboardTemplate.remove("voyo-keyboard-an-out");
    }
    connectedCallback() {
        if (this.restoreBody && !this.insertInBody) {
            document.body.appendChild(this);
            this.insertInBody = true;
        }
    }
    disconnectedCallback() {
        if (this.insertInBody) {
            this.parentElement && this.parentElement.removeChild(this);
            this.insertInBody = false;
            this.restoreBody = true;
        }
        else {
            this.restoreBody = false;
        }
    }
};
__decorate([
    VoyoInput({ name: "dot", defaultValue: false })
], KeyboardComponent.prototype, "useDot", void 0);
__decorate([
    VoyoInput({ name: "useEnter", defaultValue: true })
], KeyboardComponent.prototype, "useEnter", null);
__decorate([
    VoyoInput({ name: "value" })
], KeyboardComponent.prototype, "value", null);
__decorate([
    VoyoOutput({ event: "keyPress" })
], KeyboardComponent.prototype, "keyPress", void 0);
__decorate([
    VoyoOutput({ event: "valueChange" })
], KeyboardComponent.prototype, "valueChange", void 0);
__decorate([
    VoyoTemplate({
        render() {
            return `

    <article class="voyo-keyboard-content">
      <div class="_keys-wrapper">
        ${this.keys
                .map((row) => `
          <div class="_keys-wrapper-row">${row
                .map((i) => !this.useDot && i.value === "."
                ? '<span class="voyo-keyboard-item-holder"></span>'
                : `<button class="voyo-keyboard-item" data-value="${i.value}">
                ${i.svg ? i.svg : i.value}
            </button>`)
                .join("")}</div>
          `)
                .join("")}
      </div>
      <div class="_enter-wrapper">
        <button class="voyo-keyboard-enter-btn">
          <span>确定</span>
        </button>
      </div>
    </article>
 
    `;
        },
        tag: "div",
        className: "voyo-keyboard",
        insertedCallback(el) {
            if (!this.keyBoardInserted) {
                this.keyBoardInserted = true;
                this.keyboardContent = el.querySelector(".voyo-keyboard-content");
                this.sureBtnEl = el.querySelector(".voyo-keyboard-enter-btn");
                this.keyboardContent.addEventListener("click", (e) => {
                    e.voyoKeyboardClick = true;
                });
                this.sureBtnEl.addEventListener("touchstart", (e) => {
                    this.keyPress.next(13);
                });
                this.keyboardContentManage = new ClassManage(this.keyboardContent);
                this.executeAfterContentInit.connect();
                this.listenKeyTouch(el.querySelectorAll(".voyo-keyboard-item"));
            }
        },
    })
], KeyboardComponent.prototype, "keyboardTemplate", void 0);
KeyboardComponent = __decorate([
    VoyoDor({
        template: `
<div id="keyboard-container">
  
</div>
  `,
        styles: '@-webkit-keyframes KeyboardSlideIn{0%{transform:translate3d(0,100%,0) scale(1.2)}}@keyframes KeyboardSlideIn{0%{transform:translate3d(0,100%,0) scale(1.2)}}@-webkit-keyframes KeyboardSlideOut{to{transform:translate3d(0,50%,0);opacity:0}}@keyframes KeyboardSlideOut{to{transform:translate3d(0,50%,0);opacity:0}}.voyo-keyboard-an-in{-webkit-animation:KeyboardSlideIn .2s cubic-bezier(.09,.34,.48,.97);animation:KeyboardSlideIn .2s cubic-bezier(.09,.34,.48,.97)}.voyo-keyboard-an-out{-webkit-animation:KeyboardSlideOut .2s cubic-bezier(.79,.07,.98,1);animation:KeyboardSlideOut .2s cubic-bezier(.79,.07,.98,1);-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.voyo-keyboard{position:fixed;bottom:0;left:0;width:100%;z-index:600;background:var(--color-bg3)}.voyo-keyboard:after{content:"";position:absolute;height:1px;width:100%;left:0;top:0;transform:scaleY(.4);background:var(--color-after-border)}.voyo-keyboard.__closebar .voyo-keyboard-content{padding-top:0!important}.voyo-keyboard-closebar{display:flex;justify-content:center;align-items:center;padding:.2rem 0;transition:all .3s ease-out}.voyo-keyboard-closebar:active{background:var(--color-ripple-light-hover)}.voyo-keyboard-content{padding:1rem .6rem .5rem}.voyo-keyboard-content ._keys-wrapper{display:none}.voyo-keyboard-content ._keys-wrapper-row{display:flex}.voyo-keyboard-content ._enter-wrapper{display:none;padding:.2rem}.voyo-keyboard-content.__double{display:flex}.voyo-keyboard-content.__double ._keys-wrapper{display:block;flex-basis:76%}.voyo-keyboard-content.__double ._enter-wrapper{display:block;flex-basis:24%}.voyo-keyboard-content.__double .voyo-keyboard-item{height:6.5vh}.voyo-keyboard-content.__alone ._keys-wrapper{display:block;flex-basis:100%}.voyo-keyboard-content.__alone .voyo-keyboard-item{height:6.8vh}.voyo-keyboard-item,.voyo-keyboard-item-holder{flex-basis:33.3%;margin:.2rem}.voyo-keyboard-item{box-sizing:border-box;outline:none;position:relative;-webkit-appearance:none;appearance:none;border:none;display:inline-block;text-align:center;cursor:pointer;line-height:1;-webkit-tap-highlight-color:transparent;white-space:nowrap;overflow:hidden;-webkit-user-select:none;user-select:none;transition:all .2s ease;background-color:var(--color-bg);font-weight:700;font-size:var(--size-strong);color:var(--color-font-content);border-radius:var(--radius-base);display:inline-flex;justify-content:center;align-items:center;margin-left:3px;margin-right:3px}.voyo-keyboard-item:focus{outline:none}.voyo-keyboard-item:after{content:none;border-radius:var(--radius-base);position:absolute;top:0;left:0;width:100%;height:100%;transform:none}.voyo-keyboard-item .voyo-keyboard-item-icon{height:1.5em;width:1.5em}.voyo-keyboard-item:active{background:var(--color-ripple-light-hover);transform:scale3d(.9,.9,.9)}.voyo-keyboard-enter-btn{box-sizing:border-box;outline:none;position:relative;-webkit-appearance:none;appearance:none;border:none;display:inline-block;text-align:center;cursor:pointer;line-height:1;-webkit-tap-highlight-color:transparent;white-space:nowrap;overflow:hidden;-webkit-user-select:none;user-select:none;margin-left:unset;margin-right:unset;transition:all .2s ease;height:100%;width:100%;color:var(--color-primary-font);background-image:linear-gradient(90deg,var(--color-primary),var(--color-primary-light))!important;border-radius:var(--radius-base);font-size:var(--size-medium);letter-spacing:.2em;display:flex;justify-content:center;align-items:center}.voyo-keyboard-enter-btn:focus{outline:none}.voyo-keyboard-enter-btn:after{content:none;border-radius:var(--radius-base);position:absolute;top:0;left:0;width:100%;height:100%;transform:none}',
    })
], KeyboardComponent);
export { KeyboardComponent };
