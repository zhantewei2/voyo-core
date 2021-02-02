import { __decorate } from "tslib";
import { VoyoComponent } from "../../commonComponent";
import { VoyoDor } from "../../BaseComponent";
let TabGroupHeader = class TabGroupHeader extends VoyoComponent {
    mounted() {
        this.classList.add("voyo-tabGroup-header");
    }
};
TabGroupHeader = __decorate([
    VoyoDor({
        template: `
  <slot></slot>
  `,
    })
], TabGroupHeader);
export { TabGroupHeader };
