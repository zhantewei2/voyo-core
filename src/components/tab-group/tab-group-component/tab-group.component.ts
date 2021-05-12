import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";
import { VoyoOutput } from "../../Output.decorator";
import { ClassManage } from "../../../utils";
import { TabsComponent } from "../tabs-component/tabs.component";
import { TabBarComponent } from "../tab-bar-component/tab-bar.component";
import { forkJoin, of } from "rxjs";
import { TabGroupLayoutManage } from "./tab-group-layout";
import { ExcuteAfterConnected } from "../../utils";
import { TabgroupLayoutType } from "../tab.interface";

@VoyoDor({
  template: `
    <slot></slot>
  `,
})
export class TabGroupComponent extends VoyoComponent {
  classManage: ClassManage;
  tabs: TabsComponent;
  tabBar: TabBarComponent;
  index = 0;
  tabGroupLayoutManage: TabGroupLayoutManage = new TabGroupLayoutManage(this);
  excuteAfterConnected: ExcuteAfterConnected = new ExcuteAfterConnected();
  @VoyoInput({ name: "value" }) set value(v: number) {
    if (v === this.index) return;
    // tab bar change from tabs
    this.tabs && this.tabs.setIndex(v);
  }
  @VoyoOutput({ event: "input" }) inputChange: VoyoEventEmitter<
      number
      > = new VoyoEventEmitter<number>();
  @VoyoInput({ defaultValue: "stiff" }) set layout(v: TabgroupLayoutType) {
    this.excuteAfterConnected.execute(() => {
      this.tabGroupLayoutManage.setLayoutType(v);
    }, "layoutType");
  }
  created() {
    this.classManage = new ClassManage(this);
  }
  mounted() {
    this.classList.add("voyo-tabGroup");

    const slots = this.shadowRoot.querySelector("slot");
    const slotNodes = slots.assignedNodes();
    const nodes = slotNodes.filter((i: Node) => {
      if (i instanceof TabBarComponent) {
        this.tabBar = i;
        return true;
      } else if (i instanceof TabsComponent) {
        this.tabs = i;
        return true;
      }
    });
    this.tabGroupLayoutManage.foundTabGroupChild(slotNodes);

    if (!this.tabs || !this.tabBar) return;
    this.tabBar.classList.add("voyo-tabGroup-tabBar");
    this.tabs.classList.add("voyo-tabGroup-tabs");
    forkJoin(
        nodes.map((i: any) =>
            i.voyoConnectCompleted ? of(true) : i.voyoConnected,
        ),
    ).subscribe(i => {
      this.tabs.setIndex(this.index);
      this.tabBar.setIndexDirect(this.index);
      this.tabBar.combine = true;

      this.tabs.progressChange.subscribe((progress: any) => {
        this.tabBar.pointerMoveChange.next(progress);
      });
      this.tabs.inputChange.subscribe((i: number) => {
        this.tabBar.setIndexDirect(i);
        this.inputChange.next(i);
      });
      this.tabBar.willChange.subscribe(({ value, cb }: any) => {
        this.tabs.setIndex(value, cb);
      });
    });
    this.excuteAfterConnected.connect();
  }
}
