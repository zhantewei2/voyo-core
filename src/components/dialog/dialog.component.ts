import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { ClassManage } from "../../utils";
import { handleRipple } from "../../utils/ripple";
import { AnimationDisplay } from "../../utils/animation/AnimationSimple";
import { VoyoOutput } from "../../components";

export interface DialogOpenOpts {
  header?: string;
  html?: string | HTMLElement;
}

@VoyoDor({
  name: "voyo-dialog",
  template: `
<div class="voyo-dialog-layout">
    <div class="_layout-bg">
    </div>
    <main class="voyo-dialog">
<!--        <header class="voyo-dialog-header">-->
<!--            <slot name="header"></slot>-->
<!--        </header>-->
        <article class="voyo-dialog-article">
            <slot></slot>
        </article>
        <footer class="voyo-dialog-footer">
            <div class="voyo-dialog-footer-cancel">取消</div>
            <div class="voyo-dialog-footer-confirm">确定</div>
        </footer>
    </main>
</div>
  `,
  styles: require("./dialog.webscss")
})
export class DialogComponent extends VoyoComponent {
  @VoyoInput({}) set headerString(v: string) {
    this.header.innerHTML = v;
  }
  @VoyoInput({}) set confirmText(v: string) {
    if (v) this.dialogConfirm.innerText = v;
  }
  @VoyoInput({}) set cancelText(v: string) {
    if (v) this.dialogCancel.innerText = v;
  }
  @VoyoInput({ defaultValue: 1 }) set doubleConfirm(v: number) {
    if (v !== undefined) this.classManage.toggleClass("__double-confirm", !!v);
  }
  @VoyoInput({ defaultValue: 0 }) set disableConfirm(v: number) {
    if (v !== undefined) this.classManage.toggleClass("__disable-confirm", !!v);
  }
  @VoyoInput({}) disableCancel: boolean;
  @VoyoInput({}) disableAutoClose: boolean;
  @VoyoOutput({ event: "confirm" }) confirmEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  @VoyoOutput({ event: "cancel" }) cancelEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();

  open(opts: DialogOpenOpts) {
    this.displayAnimation.open();
  }
  close() {
    this.displayAnimation.close();
  }
  container: HTMLElement;
  dialog: HTMLElement;
  dialogBg: HTMLElement;
  header: HTMLElement;
  footer: HTMLElement;
  dialogConfirm: HTMLElement;
  dialogCancel: HTMLElement;
  dialogIsConnected = false;
  connectedQueue: any[] = [];
  classManage: ClassManage;
  displayAnimation: AnimationDisplay;
  created() {
    this.container = this.shadowRoot.querySelector(".voyo-dialog-layout");
    this.dialogBg = this.shadowRoot.querySelector("._layout-bg");
    this.dialog = this.shadowRoot.querySelector(".voyo-dialog");
    this.classManage = new ClassManage(this.dialog);
    this.header = this.shadowRoot.querySelector(".voyo-dialog-header");
    this.dialogConfirm = this.shadowRoot.querySelector(
      ".voyo-dialog-footer-confirm",
    );
    this.dialogCancel = this.shadowRoot.querySelector(
      ".voyo-dialog-footer-cancel",
    );
    this.footer = this.shadowRoot.querySelector(".voyo-dialog-footer");
    this.container.style.display = "none";
    this.displayAnimation = new AnimationDisplay(
      this.container,
      "voyo-dialog-animate",
      "",
      this.dialogBg,
    );
    handleRipple(this.dialogConfirm, { autoSize: true });
    handleRipple(this.dialogCancel, { autoSize: true });

    this.dialogConfirm.addEventListener("click", () => {
      this.confirm();
    });
    this.dialogCancel.addEventListener("click", () => {
      this.cancel();
    });
    this.dialogBg.addEventListener("click", () => {
      this.cancel();
    });
  }
  cancel() {
    this.cancelEvent.next();
    if (this.disableCancel) return;
    if (this.disableAutoClose) return;
    this.close();
  }
  confirm() {
    this.confirmEvent.next();
    if (this.disableAutoClose) return;
    this.close();
  }
  mounted() {
    this.dialogIsConnected = true;
    this.connectedQueue.forEach(i => i());
  }
}
