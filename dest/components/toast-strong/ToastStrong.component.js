import { __decorate } from "tslib";
import { VoyoComponent } from "../commonComponent";
import { VoyoDor } from "../BaseComponent";
import { AIPlJFRw as completeSvg } from "../../svg.js";
import { XOPlJFR as loadColousSvg2 } from "../../svg.js";
import { BOPlJFR as loseSvg } from "../../svg.js";
import { IOCAutowired } from "../../ioc";
import { SETTING_IOC_NAME } from "../../setting";
import { AnimationDisplay } from "../../utils";
export const toastStrongTypeImage = {
    load: loadColousSvg2,
    completed: completeSvg,
    lose: loseSvg,
};
let ToastStrongComponent = class ToastStrongComponent extends VoyoComponent {
    set imgSource(v) {
        if (v !== this.imgSource0) {
            this.articleImg.src = v;
        }
        this.imgSource0 = v;
    }
    set footerHtmlContent(htmlText) {
        if (htmlText === this.footerHtmlContent0)
            return;
        this.footerContent.innerHTML = htmlText || "";
        this.footerHtmlContent0 = htmlText;
        this.footerDisplay = !!htmlText;
    }
    set footerDisplay(v) {
        if (v === this._footerDisplay)
            return;
        this.footerContent.style.display = v ? "block" : "none";
        this._footerDisplay = v;
    }
    created() {
        this.container = this.shadowRoot.querySelector(".voyo-toastStrong-layout");
        this.footerContent = this.shadowRoot.querySelector(".voyo-toastStrong-footer");
        this.articleImg = this.shadowRoot.querySelector(".voyo-toastStrong-article-image");
        this.main = this.shadowRoot.querySelector(".voyo-toastStrong");
        this.displayAnimate = new AnimationDisplay(this.container, "voyo-toastStrong-container", "block", this.main);
        this.displayAnimate.waitTransition = false;
        this.container.style.display = "none";
    }
    open({ message, type, durationTime }) {
        this.clearAutoClose();
        const toastType = type || this.coreSetting.toastStrongTypeDefault;
        durationTime =
            durationTime === undefined && toastType !== "load"
                ? this.coreSetting.toastStrongDurationTime
                : durationTime;
        this.imgSource = toastStrongTypeImage[toastType];
        this.footerHtmlContent = message;
        this.displayAnimate.open();
        if (durationTime) {
            this.setAutoClose(durationTime);
        }
    }
    close() {
        this.clearAutoClose();
        this.displayAnimate.close(true);
    }
    setAutoClose(timeout) {
        this.autoClose = setTimeout(() => {
            this.close();
        }, timeout);
    }
    clearAutoClose() {
        if (this.autoClose) {
            clearTimeout(this.autoClose);
            this.autoClose = null;
        }
    }
};
__decorate([
    IOCAutowired({ name: SETTING_IOC_NAME })
], ToastStrongComponent.prototype, "coreSetting", void 0);
ToastStrongComponent = __decorate([
    VoyoDor({
        name: "voyo-toast-strong",
        template: `
<div class="voyo-toastStrong-layout">
  <div class="_layout-bg"></div>
  <main class="voyo-toastStrong">
        <img class="voyo-toastStrong-article-image"/>
        <footer class="voyo-toastStrong-footer">
           
        </footer>
  </main>
</div>
  `,
        styles: '.voyo-toastStrong-layout{position:fixed;left:0;top:0;width:100%;height:100%;background:transparent;z-index:950}.voyo-toastStrong-layout ._layout-bg{background:transparent;z-index:-1;opacity:.6;position:absolute;top:0;left:0;width:100%;height:100%;transition:all .3s ease-out}.voyo-toastStrong{position:absolute;top:50%;left:50%;will-change:opacity,transform;transform:translate3d(-50%,-50%,0);box-sizing:border-box;align-items:center;background:var(--color-bg-deep3);transform-origin:0 0;display:flex;flex-flow:column;justify-content:center;color:var(--color-font-brand-reverse);padding:.5rem 1rem;box-shadow:0 8px 26px -12px var(--color-bg-deep3);border-radius:var(--radius-base)}.voyo-toastStrong-footer{text-align:center;padding:.5rem;border-radius:var(--radius-large);font-size:var(--size-font-small);font-weight:700}.voyo-toastStrong-article-image{height:4rem;width:4rem}.voyo-toastStrong-container-enter ._layout-bg{opacity:0}.voyo-toastStrong-container-enter .voyo-toastStrong{opacity:0;transform:scale(.9) translate3d(-50%,-50%,0)}.voyo-toastStrong-container-enter-active .voyo-toastStrong,.voyo-toastStrong-container-leave-active .voyo-toastStrong{transition:all .2s ease}.voyo-toastStrong-container-leave-to ._layout-bg{opacity:0}.voyo-toastStrong-container-leave-to .voyo-toastStrong{opacity:0;transform:scale(.9) translate3d(-50%,-50%,0)}',
    })
], ToastStrongComponent);
export { ToastStrongComponent };
