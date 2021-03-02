import { __decorate } from "tslib";
import { VoyoComponent } from "../commonComponent";
import { VoyoDor } from "../BaseComponent";
let TabGroupComponent = class TabGroupComponent extends VoyoComponent {
};
TabGroupComponent = __decorate([
    VoyoDor({
        name: "voyo-tabs",
        template: `
<div class="voyo-tab-group">
    <voyoc-tabs>
    </voyoc-tabs>
</div>
  `,
        styles: '@-webkit-keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@-webkit-keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}@keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}.voyo-tab-group{position:absolute;top:0;left:0;width:100%;height:100%}',
    })
], TabGroupComponent);
export { TabGroupComponent };
