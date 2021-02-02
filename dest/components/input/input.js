import { Subject } from "rxjs";
export class InputInterface {
}
export class Input {
    constructor() {
        this.inputEl = document.createElement("input");
        this.onInput = new Subject();
        this.onFocus = new Subject();
        this.onBlur = new Subject();
        this.onKeypress = new Subject();
        this.inputEl.addEventListener("input", (e) => {
            this.onInput.next(e.target.value);
        });
        this.inputEl.addEventListener("focus", () => {
            this.onFocus.next();
        });
        this.inputEl.addEventListener("keypress", e => {
            this.onKeypress.next(e.keyCode);
        });
        this.inputEl.addEventListener("blur", () => {
            this.onBlur.next();
        });
    }
    set disabled(v) {
        this.inputEl.disabled = this._disabled = v;
    }
    toFocus() {
        this.inputEl.focus();
    }
    toBlur() {
        this.inputEl.blur();
    }
    setValue(v) {
        this.inputEl.value = v;
    }
    setType(type) {
        this.inputEl.type = type;
    }
    getInputEl() {
        return this.inputEl;
    }
}
