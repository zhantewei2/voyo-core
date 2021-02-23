import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { ClassManage } from "../../utils";
import { handleRipple } from "../../utils/ripple";
import { AnimationDisplay } from "../../utils/animation/AnimationSimple";
import { VoyoOutput } from "../../components";
let DialogComponent = class DialogComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.confirmEvent = new VoyoEventEmitter();
        this.cancelEvent = new VoyoEventEmitter();
        this.dialogIsConnected = false;
        this.connectedQueue = [];
    }
    set headerString(v) {
        this.header.innerHTML = v;
    }
    set confirmText(v) {
        if (v)
            this.dialogConfirm.innerText = v;
    }
    set cancelText(v) {
        if (v)
            this.dialogCancel.innerText = v;
    }
    set doubleConfirm(v) {
        if (v !== undefined)
            this.classManage.toggleClass("__double-confirm", !!v);
    }
    set disableConfirm(v) {
        if (v !== undefined)
            this.classManage.toggleClass("__disable-confirm", !!v);
    }
    open(opts) {
        this.displayAnimation.open();
    }
    close() {
        this.displayAnimation.close();
    }
    created() {
        this.container = this.shadowRoot.querySelector(".voyo-dialog-layout");
        this.dialogBg = this.shadowRoot.querySelector("._layout-bg");
        this.dialog = this.shadowRoot.querySelector(".voyo-dialog");
        this.classManage = new ClassManage(this.dialog);
        this.header = this.shadowRoot.querySelector(".voyo-dialog-header");
        this.dialogConfirm = this.shadowRoot.querySelector(".voyo-dialog-footer-confirm");
        this.dialogCancel = this.shadowRoot.querySelector(".voyo-dialog-footer-cancel");
        this.footer = this.shadowRoot.querySelector(".voyo-dialog-footer");
        this.container.style.display = "none";
        this.displayAnimation = new AnimationDisplay(this.container, "voyo-dialog-animate", "block", this.dialogBg);
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
        if (this.disableCancel)
            return;
        if (this.disableAutoClose)
            return;
        this.close();
    }
    confirm() {
        this.confirmEvent.next();
        if (this.disableAutoClose)
            return;
        this.close();
    }
    mounted() {
        this.dialogIsConnected = true;
        this.connectedQueue.forEach(i => i());
    }
};
__decorate([
    VoyoInput({})
], DialogComponent.prototype, "headerString", null);
__decorate([
    VoyoInput({})
], DialogComponent.prototype, "confirmText", null);
__decorate([
    VoyoInput({})
], DialogComponent.prototype, "cancelText", null);
__decorate([
    VoyoInput({ defaultValue: 1 })
], DialogComponent.prototype, "doubleConfirm", null);
__decorate([
    VoyoInput({ defaultValue: 0 })
], DialogComponent.prototype, "disableConfirm", null);
__decorate([
    VoyoInput({})
], DialogComponent.prototype, "disableCancel", void 0);
__decorate([
    VoyoInput({})
], DialogComponent.prototype, "disableAutoClose", void 0);
__decorate([
    VoyoOutput({ event: "confirm" })
], DialogComponent.prototype, "confirmEvent", void 0);
__decorate([
    VoyoOutput({ event: "cancel" })
], DialogComponent.prototype, "cancelEvent", void 0);
DialogComponent = __decorate([
    VoyoDor({
        name: "voyo-dialog",
        template: `
<div class="voyo-dialog-layout">
    <div class="_layout-bg">
    </div>
    <main class="voyo-dialog" style="margin-top:40%;">
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
        styles: '.voyo-dialog-layout{position:fixed;left:0;top:0;width:100%;height:100%;background:transparent;z-index:900}.voyo-dialog-layout ._layout-bg{background:var(--color-bg-deep);z-index:-1;opacity:.6;position:absolute;top:0;left:0;width:100%;height:100%;transition:all .3s ease-out}.voyo-dialog-article{min-height:80px;padding:2rem 1.5rem;color:var(--color-font-content);font-size:var(--size-font-message);text-align:center;position:relative;display:flex;justify-content:center;align-items:center}.voyo-dialog-header{padding:.7em 1rem;color:var(--color-font-brand);font-weight:700;text-align:center}.voyo-dialog-footer{display:flex;position:relative;font-weight:700}.voyo-dialog-footer:before{content:"";position:absolute;height:1px;width:100%;left:0;top:0;transform:scaleY(.4);background:var(--color-after-border)}.voyo-dialog-footer-cancel,.voyo-dialog-footer-confirm{flex:auto;overflow:hidden;position:relative;text-align:center;font-weight:700;line-height:3.5em;color:var(--color-font-title);letter-spacing:.5em}.voyo-dialog-footer-cancel{display:none}.voyo-dialog-footer-cancel:before{content:"";position:absolute;height:100%;width:1px;top:0;right:0;transform:scaleX(.4);background:var(--color-after-border)}.voyo-dialog{transition:all .2s ease;width:85%;min-width:320px;max-width:600px;background:var(--color-bg);overflow:hidden;margin-right:auto;margin-left:auto;border-radius:var(--radius-medium)}.voyo-dialog.__double-confirm .voyo-dialog-footer-confirm{color:var(--color-font)}.voyo-dialog.__double-confirm .voyo-dialog-footer-confirm:after{content:"";position:absolute;height:100%;width:1px;top:0;right:0;transform:scaleX(.4);background:var(--color-after-border)}.voyo-dialog.__double-confirm .voyo-dialog-footer-cancel{color:var(--color-font-des);display:inline-block}.voyo-dialog.__disable-confirm{border-radius:var(--radius-medium)}.voyo-dialog.__disable-confirm .voyo-dialog-article{padding:1.5rem 1.5rem 1rem}.voyo-dialog.__disable-confirm .voyo-dialog-footer{display:none}.voyo-dialog-animate-enter ._layout-bg{opacity:0}.voyo-dialog-animate-enter .voyo-dialog{opacity:0;transform:translate3d(0,50%,0)}.voyo-dialog-animate-enter-active,.voyo-dialog-animate-leave-active{transition:all .2s ease}.voyo-dialog-animate-leave-to ._layout-bg{opacity:0}.voyo-dialog-animate-leave-to .voyo-dialog{opacity:0;transform:translate3d(0,-20%,0)}.voyo-dialog2-container{border-radius:var(--radius-medium);position:relative;padding:1rem;background-color:var(--color-bg);width:80vw;min-width:300px;max-width:500px}.voyo-dialog2-container ._header{text-align:center;font-weight:700;padding:.5rem 0 1rem;color:var(--color-font-title)}.voyo-dialog2-container ._article{position:relative;padding:.5rem .5rem 1rem;max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch}.voyo-dialog2-container ._article:after{content:"";position:absolute;height:1px;bottom:0;width:100%;left:0;transform:scaleY(.4);background:var(--color-after-border)}.voyo-dialog2-container ._footer{padding:1rem 0 0}@-webkit-keyframes Ripple-Bubbling{0%{transform:scale3d(.5,.5,.5);opacity:.1}30%{transform:scale3d(4,4,4);opacity:.15}55%{transform:scale3d(8,8,8);opacity:.2}to{transform:scale3d(10,10,10);opacity:0}}@keyframes Ripple-Bubbling{0%{transform:scale3d(.5,.5,.5);opacity:.1}30%{transform:scale3d(4,4,4);opacity:.15}55%{transform:scale3d(8,8,8);opacity:.2}to{transform:scale3d(10,10,10);opacity:0}}.ripple-bubbling{display:block;position:absolute;border-radius:50%;width:1em;height:1em;-webkit-animation:Ripple-Bubbling .4s linear;animation:Ripple-Bubbling .4s linear;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.ripple-wrapper{overflow:hidden;z-index:1;cursor:pointer;-webkit-user-select:none;user-select:none;position:absolute;top:0;left:0;width:100%;height:100%;background-color:initial;transition:background .5s ease}.ripple-wrapper-light.ripple-active{background-color:var(--color-ripple-light-bg)}.ripple-wrapper-light .ripple-bubbling{background:var(--color-ripple-light-bubbling)}.ripple-wrapper-deep.ripple-active{background-color:var(--color-ripple-deep-bg)}.ripple-wrapper-deep .ripple-bubbling{background:var(--color-ripple-deep-bubbling)}'
    })
], DialogComponent);
export { DialogComponent };
