import { KeyboardComponent } from "../keyboard/keyboard.component";
import { Subject, fromEvent, Observable, Subscription } from "rxjs";
import { InputInterface, visualInputType } from "./input";
import { ExcuteAfterConnected } from "../utils";

export class VisualInput implements InputInterface {
  el: HTMLElement;
  cursor: HTMLElement;
  textEl: HTMLElement;
  keyboard: KeyboardComponent;
  passwordWord = "*";
  type: visualInputType;
  isFocus: boolean;
  watchFocus() {
    if (this.isFocus) {
      this.cursor.classList.add("_show");
    } else {
      this.cursor.classList.remove("_show");
    }
  }
  value: any;
  excuteAfterKeyboard: ExcuteAfterConnected = new ExcuteAfterConnected();
  constructor() {
    this.el = document.createElement("div");
    this.el.className = "__visual-input";
    this.el.appendChild((this.textEl = document.createElement("div")));
    this.el.appendChild((this.cursor = document.createElement("span")));
    this.textEl.className = "_visual-input-text";
    this.cursor.className = "_visual-input-cursor";
    this.el.addEventListener("click", (e: any) => {
      if (this._disabled) return;
      e.voyoVisualInput = true;
      this.focus();
    });
  }
  _disabled: boolean;
  set disabled(v: boolean) {
    if (v == this._disabled) return;
    this._disabled = v;
  }
  insertInBody = false;
  showValue(v: string) {
    this.textEl.innerText = v;
  }
  writeValue(v: string) {
    if (v === this.value) return;
    this.value = v;
    if (v === "") {
      this.showValue(v);
      this.onInput.next(v);
      return;
    }
    const str = v.toString();
    this.showValue(
      this.type === "password" ? str.replace(/.*/g, this.passwordWord) : str,
    );
    this.onInput.next(v);
  }
  setValue(v: string) {
    this.writeValue(v);
    this.excuteAfterKeyboard.execute(() => (this.keyboard.value = v));
  }
  bodyClickSub: Subscription | null;
  clearBodySub() {
    if (this.bodyClickSub) {
      this.bodyClickSub.unsubscribe();
      this.bodyClickSub = null;
    }
  }
  focus() {
    if (this.isFocus) return;
    this.isFocus = true;
    this.watchFocus();
    this.clearBodySub();
    this.bodyClickSub = fromEvent(document.body, "click").subscribe(
      (e: any) => {
        if (e.voyoKeyboardClick || e.voyoVisualInput) return;
        this.blur();
      },
    );
    if (!this.keyboard) {
      this.keyboard = document.createElement(
        "voyoc-keyboard",
      ) as KeyboardComponent;
      this.keyboard.valueChange.subscribe(e => {
        this.writeValue(e);
      });
      this.keyboard.keyPress.subscribe((e: any) => {
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
    if (!this.isFocus) return;
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
  setType(type: visualInputType) {
    this.type = type;
  }
  getInputEl() {
    return this.el;
  }
  onInput: Subject<any> = new Subject<any>();
  onFocus: Subject<any> = new Subject<any>();
  onBlur: Subject<any> = new Subject<any>();
  onKeypress: Subject<number> = new Subject<number>();
}
