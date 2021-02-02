import { __decorate } from "tslib";
import { VoyoComponent } from "../../commonComponent";
import { VoyoDor } from "../../BaseComponent";
let TabGroupBody = class TabGroupBody extends VoyoComponent {
    mounted() {
        this.classList.add("voyo-tabGroup-body");
    }
};
TabGroupBody = __decorate([
    VoyoDor({
        template: `
  <slot></slot>
  `,
    })
], TabGroupBody);
export { TabGroupBody };
