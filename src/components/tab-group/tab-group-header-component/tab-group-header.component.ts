import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";

@VoyoDor({
  template: `
  <slot></slot>
  `,
})
export class TabGroupHeader extends VoyoComponent {
  mounted() {
    this.classList.add("voyo-tabGroup-header");
  }
}
