import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";

import { ROUTER_CHANGE_IOC_NAME } from "../../setting";
import { RouterChangeService } from "../../router";

@VoyoDor({
  name: "voyo-tabs",
  template: `
<div class="voyo-tab-group">
    <voyoc-tabs>
    </voyoc-tabs>
</div>
  `,
  styles: require("./tab-group.webscss"),
})
export class TabGroupComponent extends VoyoComponent {}
