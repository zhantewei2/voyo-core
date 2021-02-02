import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";
import { handleRipple, ClassManage } from "../../../utils";

@VoyoDor({
  template: `
    <slot></slot> 
    `,
})
export class TabBarItemComponent extends VoyoComponent {
  index: number;
  classManage: ClassManage;
  created() {
    this.classManage = new ClassManage(this);
  }
  mounted() {
    this.classList.add("voyo-tab-bar-item");
    handleRipple(this, { autoSize: true });
  }
  active() {
    this.classManage.toggleClass("active", true);
  }
  disActive() {
    this.classManage.toggleClass("active", false);
  }
}
