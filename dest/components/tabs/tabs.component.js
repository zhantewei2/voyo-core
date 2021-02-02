import { __decorate } from "tslib";
import { VoyoComponent } from "../commonComponent";
import { VoyoDor } from "../BaseComponent";
let TabsComponent = class TabsComponent extends VoyoComponent {
};
TabsComponent = __decorate([
    VoyoDor({
        name: "voyo-tabs",
        template: `
<div>
    <voyoc-carousel>
    </voyoc-carousel>
</div>
  `,
    })
], TabsComponent);
export { TabsComponent };
