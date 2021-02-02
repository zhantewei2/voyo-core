import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";

import { ROUTER_CHANGE_IOC_NAME } from "../../setting";
import { RouterChangeService } from "../../router";

@VoyoDor({
  name: "voyo-tabs",
  template: `
<div>
    <voyoc-carousel>
    </voyoc-carousel>
</div>
  `,
})
export class TabsComponent extends VoyoComponent {}
