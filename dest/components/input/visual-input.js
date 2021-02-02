import { Subject, fromEvent } from "rxjs";
import { ExcuteAfterConnected } from "../utils";
export class VisualInput {
    constructor() {
        this.passwordWord = "*";
        this.excuteAfterKeyboard = new ExcuteAfterConnected();
        this.insertInBody = false;
        this.onInput = new Subject();
        this.onFocus = new Subject();
        this.onBlur = new Subject();
        this.onKeypress = new Subject();
        this.el = document.createElement("div");
        this.el.className = "__visual-input";
        this.el.appendChild((this.textEl = document.createElement("div")));
        this.el.appendChild((this.cursor = document.createElement("span")));
        this.textEl.className = "_visual-input-text";
        this.cursor.className = "_visual-input-cursor";
        this.el.addEventListener("click", (e) => {
            if (this._disabled)
                return;
            e.voyoVisualInput = true;
            this.focus();
        });
    }
    watchFocus() {
        if (this.isFocus) {
            this.cursor.classList.add("_show");
        }
        else {
            this.cursor.classList.remove("_show");
        }
    }
    set disabled(v) {
        if (v == this._disabled)
            return;
        this._disabled = v;
    }
    showValue(v) {
        this.textEl.innerText = v;
    }
    writeValue(v) {
        if (v === this.value)
            return;
        this.value = v;
        if (v === "") {
            this.showValue(v);
            this.onInput.next(v);
            return;
        }
        const str = v.toString();
        this.showValue(this.type === "password" ? str.replace(/.*/g, this.passwordWord) : str);
        this.onInput.next(v);
    }
    setValue(v) {
        this.writeValue(v);
        this.excuteAfterKeyboard.execute(() => (this.keyboard.value = v));
    }
    clearBodySub() {
        if (this.bodyClickSub) {
            this.bodyClickSub.unsubscribe();
            this.bodyClickSub = null;
        }
    }
    focus() {
        if (this.isFocus)
            return;
        this.isFocus = true;
        this.watchFocus();
        this.clearBodySub();
        this.bodyClickSub = fromEvent(document.body, "click").subscribe((e) => {
            if (e.voyoKeyboardClick || e.voyoVisualInput)
                return;
            this.blur();
        });
        if (!this.keyboard) {
            this.keyboard = document.createElement("voyoc-keyboard");
            this.keyboard.valueChange.subscribe(e => {
                this.writeValue(e);
            });
            this.keyboard.keyPress.subscribe((e) => {
                this.onKeypress.next(e);
            });
            this.excuteAfterKeyboard.connect();
        }
        if (!this.insertInBody) {
            document.body.appendChild(this.keyboard);
            this.insertInBody = true;
        }
        this.keyboard.show();
        this.onFocus.next();
    }
    blur() {
        if (!this.isFocus)
            return;
        this.isFocus = false;
        this.watchFocus();
        this.keyboard.hide();
        this.onBlur.next();
    }
    destroy() {
        this.keyboard && this.keyboard.disconnectedCallback();
    }
    toFocus() {
        this.focus();
    }
    toBlur() {
        this.blur();
    }
    setType(type) {
        this.type = type;
    }
    getInputEl() {
        return this.el;
    }
}
