import { Subject } from "rxjs";

export type visualInputType = "text" | "number" | "password";

export class InputInterface {
  onInput: Subject<any>;
  onFocus: Subject<void>;
  onBlur: Subject<void>;
  onKeypress: Subject<number>;
  toFocus: () => void;
  toBlur: () => void;
  setValue: (v: any) => void;
  setType: (type: visualInputType) => void;
  getInputEl: () => HTMLElement;
  disabled?: boolean;
  destroy?: () => void;
}
export class Input implements InputInterface {
  inputEl: HTMLInputElement = document.createElement("input");

  constructor() {
    this.inputEl.addEventListener("input", (e: any) => {
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
  _disabled: boolean;
  set disabled(v: boolean) {
    this.inputEl.disabled = this._disabled = v;
  }

  onInput: Subject<any> = new Subject<any>();
  onFocus: Subject<any> = new Subject<any>();
  onBlur: Subject<any> = new Subject<any>();
  onKeypress: Subject<number> = new Subject<number>();
  toFocus() {
    this.inputEl.focus();
  }
  toBlur() {
    this.inputEl.blur();
  }
  setValue(v: any) {
    this.inputEl.value = v;
  }
  setType(type: visualInputType) {
    this.inputEl.type = type;
  }
  getInputEl() {
    return this.inputEl;
  }
}
