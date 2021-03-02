import { __decorate } from "tslib";
import { VoyoComponent, } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { RelativeFixed } from "../../utils/RelativeFixed";
export class ForElement extends HTMLElement {
}
let MenuComponent = class MenuComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.relativeFixed = new RelativeFixed();
    }
    set forEl(el) {
        if (el instanceof HTMLElement) {
            if (el.voyocMenuForElListenerName)
                return;
            if (this.clickTrigger) {
                el.voyocMenuForElListenerName = (e) => { this.open(e); };
                el.addEventListener("click", el.voyocMenuForElListenerName);
            }
        }
    }
    ;
    created() {
        this.wrapperEl = this.shadowRoot.querySelector("voyo-menu-wrapper");
    }
    open(e) {
        document.body.appendChild(this.wrapperEl);
    }
};
__decorate([
    VoyoInput({ name: "clickTrigger", defaultValue: true })
], MenuComponent.prototype, "clickTrigger", void 0);
__decorate([
    VoyoInput({ name: "forEl" })
], MenuComponent.prototype, "forEl", null);
MenuComponent = __decorate([
    VoyoDor({
        template: `
<span>
  <div class="voyo-menu-wrapper">
    <div class="_layout-bg"></div>
    <article>
      <slot name="menu"></slot>
    </article>
  </div>
</span>
  `
    })
], MenuComponent);
export { MenuComponent };
