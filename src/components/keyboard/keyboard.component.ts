import {
  VoyoComponent,
  VoyoEventEmitter,
  VoyoTemplateRef,
} from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ExcuteAfterConnected } from "../utils";
import { ClassManage } from "../../utils";
import { deleteSvg } from "../utils/svg";

export interface KeyItem {
  value: string | number;
  svg?: string;
}

@VoyoDor({
  template: `
<div id="keyboard-container">
  
</div>
  `,
  styles: require("./keyboard.webscss"),
})
export class KeyboardComponent extends VoyoComponent {
  @VoyoInput({ name: "dot", defaultValue: false }) useDot: boolean;
  @VoyoInput({ name: "useEnter", defaultValue: true }) set useEnter(
    v: boolean,
  ) {
    this.executeAfterContentInit.execute(() => {
      this.keyboardContentManage.replaceClass(
        "useEnter",
        v ? "__double" : "__alone",
      );
    });
  }
  value0 = "";
  @VoyoInput({ name: "value" }) set value(v: string) {
    this.value0 = v;
  }
  @VoyoOutput({ event: "keyPress" }) keyPress: VoyoEventEmitter<
    number | string
  > = new VoyoEventEmitter<number | string>();
  @VoyoOutput({ event: "valueChange" }) valueChange: VoyoEventEmitter<
    string
  > = new VoyoEventEmitter<string>();

  @VoyoTemplate({
    render(this: KeyboardComponent) {
      return `

    <article class="voyo-keyboard-content">
      <div class="_keys-wrapper">
        ${this.keys
          .map(
            (row: KeyItem[]) => `
          <div class="_keys-wrapper-row">${row
            .map((i: KeyItem) =>
              !this.useDot && i.value === "."
                ? '<span class="voyo-keyboard-item-holder"></span>'
                : `<button class="voyo-keyboard-item" data-value="${i.value}">
                ${i.svg ? i.svg : i.value}
            </button>`,
            )
            .join("")}</div>
          `,
          )
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
    insertedCallback(this: KeyboardComponent, el: HTMLElement) {
      if (!this.keyBoardInserted) {
        this.keyBoardInserted = true;
        this.keyboardContent = el.querySelector(
          ".voyo-keyboard-content",
        ) as HTMLElement;
        this.sureBtnEl = el.querySelector(
          ".voyo-keyboard-enter-btn",
        ) as HTMLButtonElement;

        this.keyboardContent.addEventListener("click", (e: any) => {
          e.voyoKeyboardClick = true;
        });
        this.sureBtnEl.addEventListener("touchstart", (e: any) => {
          this.keyPress.next(13);
        });

        this.keyboardContentManage = new ClassManage(this.keyboardContent);
        this.executeAfterContentInit.connect();
        this.listenKeyTouch(el.querySelectorAll(".voyo-keyboard-item") as any);
      }
    },
  })
  keyboardTemplate: VoyoTemplateRef;
  executeAfterContentInit: ExcuteAfterConnected = new ExcuteAfterConnected();
  keyBoardInserted: boolean;
  container: HTMLElement;
  keyboardContent: HTMLElement;
  sureBtnEl: HTMLButtonElement;
  keyboardContentManage: ClassManage;
  keys: KeyItem[][] = [
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
  created() {
    this.container = this.shadowRoot.querySelector("#keyboard-container");
  }
  listenKeyTouch(btns: HTMLButtonElement[]) {
    let v: string | undefined;
    btns.forEach(btn => {
      btn.addEventListener(
        "touchstart",
        e => {
          navigator.vibrate && navigator.vibrate(100);
          v = btn.dataset.value;
          this.keyPress.next(Number(v) || v);
          this.handleValue(v as string);
        },
        { capture: true },
      );
    });
  }
  handleValue(key: string) {
    let value: string = this.value0 ? this.value0.toString() : "";
    if (key === "del") {
      if (value === "") return;
      if (value.length) {
        value = value.slice(0, value.length - 1);
      }
    } else {
      value += key;
    }
    if (value != this.value0) {
      this.valueChange.next((this.value0 = value));
    }
  }
  insertInBody: boolean;
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
  restoreBody = false;

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
    } else {
      this.restoreBody = false;
    }
  }
}
