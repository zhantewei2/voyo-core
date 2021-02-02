import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";

@VoyoDor({
  template: `
  <slot></slot>
  `,
})
export class TabGroupBody extends VoyoComponent {
  mounted() {
    this.classList.add("voyo-tabGroup-body");
  }
}
