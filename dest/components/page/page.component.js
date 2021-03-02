import { __decorate } from "tslib";
import { VoyoComponent } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { ClassManage } from "../../utils";
let PageComponent = class PageComponent extends VoyoComponent {
    set bg(v) {
        this.classManage.replaceClass("bg", v);
    }
    set bgBlur(v) {
        this.classManage.toggleClass("__blur", v);
    }
    set iosHeight(v) {
        this.classManage.toggleClass("iosHeight", v);
    }
    created() {
        this.pageEl = this.shadowRoot.querySelector(".voyo-page");
        this.classManage = new ClassManage(this.pageEl);
    }
};
__decorate([
    VoyoInput({})
], PageComponent.prototype, "name", void 0);
__decorate([
    VoyoInput({ name: "bg" })
], PageComponent.prototype, "bg", null);
__decorate([
    VoyoInput({})
], PageComponent.prototype, "bgBlur", null);
__decorate([
    VoyoInput({ defaultValue: true })
], PageComponent.prototype, "iosHeight", null);
PageComponent = __decorate([
    VoyoDor({
        name: "voyo-page",
        template: `
<div class="voyo-page">
    <slot></slot>
</div>
  `,
        styles: '@-webkit-keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@-webkit-keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}@keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}.voyo-page{left:0;top:0;height:100%;width:100%;display:flex;position:absolute;flex-direction:column;overflow:hidden;z-index:0;contain:style;background:var(--color-bg);padding:0;margin:0;overscroll-behavior-y:contain}.voyo-page.gentle{background:var(--color-bg3)}.voyo-page.transparent{background:transparent}.voyo-page.inner{bottom:0}.voyo-page.scroll{overflow-y:auto;-webkit-overflow-scrolling:touch}.voyo-page.__blur{-webkit-filter:blur(var(--blur-size));filter:blur(var(--blur-size));transform:scale(1.1)}.voyo-page.iosHeight{height:100%;height:calc(100% - constant(safe-area-inset-bottom));height:calc(100% - env(safe-area-inset-bottom))}',
    })
], PageComponent);
export { PageComponent };
