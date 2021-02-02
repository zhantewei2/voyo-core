import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";
import { VoyoOutput } from "../../Output.decorator";
import { ClassManage } from "../../../utils";
import { forkJoin, of, Subject } from "rxjs";
import { MoveChangeParams } from "../../carousel/carousel.interface";
import { ThumbMove } from "./thumb-move";
import { MovableMove } from "./movable-move";
import {
  TabBarItemRef,
  LayoutController,
  TabgroupLayoutType,
} from "../tab.interface";
import {
  TabBarItemComponent,
  TabBarItemComponent as tabBarItem,
} from "../tab-bar-item-component/tab-bar-item.component";
import { ExcuteAfterConnected } from "../../utils";

export interface WillChangeOpts {
  value: number;
  cb: () => void;
}
export class TabBarClassManage {
  tabBars: TabBarItemComponent[];
  preItem: TabBarItemComponent;
  preIndex: number;
  constructor(tabBars: TabBarItemComponent[]) {
    this.tabBars = tabBars;
  }
  setIndex(v: number) {
    if (this.preIndex === v) return;
    if (this.preItem) this.preItem.disActive();
    this.preIndex = v;
    this.preItem = this.tabBars[v];
    this.preItem && this.preItem.active();
  }
}

@VoyoDor({
  template: `
<div class="voyo-tab-bar-area" id="movableArea">
    <slot id="slot"></slot>
    <div class="voyo-tab-bar-thumb" id="thumb">
        <div class="voyo-tab-bar-thumb-change"></div>
    </div>
</div>
    `,
  styles: require("./tab-bar.webscss"),
})
export class TabBarComponent extends VoyoComponent implements LayoutController {
  @VoyoInput({ name: "value" }) set value(v: number) {
    this.setIndex(Number(v));
  }
  get value() {
    return this.index;
  }
  @VoyoInput({ defaultValue: 0.4 }) transitionTime: number;
  @VoyoInput({ defaultValue: false }) disableThumb: boolean;

  @VoyoOutput({ event: "input" }) outputInput: VoyoEventEmitter<
    number
  > = new VoyoEventEmitter<number>();
  excuteAfterConnected: ExcuteAfterConnected = new ExcuteAfterConnected();
  tabBarClassManage: TabBarClassManage;
  classManageThis: ClassManage;
  slotEl: HTMLSlotElement;
  containerEl: HTMLElement;
  areaEl: HTMLElement;
  thumbEl: HTMLElement;

  /**
   * layout change
   * @param type
   */
  setLayout(type: TabgroupLayoutType) {
    type &&
      this.excuteAfterConnected.execute(() => {
        this.classManageThis.replaceClass("layout", type);
      });
  }
  mounted() {
    this.classList.add("voyo-tab-bar-container");
    this.classManageThis = new ClassManage(this);
    this.containerEl = this;
    this.thumbEl = this.shadowRoot.querySelector("#thumb");
    this.areaEl = this.shadowRoot.querySelector("#movableArea");
    this.slotEl = this.shadowRoot.querySelector("#slot");
    this.containerWidth = this.containerEl.clientWidth;
    this.thumbWidth = this.thumbEl.offsetWidth;
    if (this.disableThumb) {
      this.thumbEl.style.display = "none";
    }
    this.handleTabItems(() => {
      this.movableMove = new MovableMove(this, this.index);
      this.thumbMove = new ThumbMove(
        this.thumbEl,
        this.tabBarItemRefList,
        this.transitionTime,
        this,
      );

      this.handlePointerMove();
      this.excuteAfterConnected.connect();
    });
    // if(this.value!==undefined)this.setIndex(this.value);
  }
  pointerMoveChange: Subject<MoveChangeParams> = new Subject<
    MoveChangeParams
  >();
  willChange: Subject<WillChangeOpts> = new Subject<WillChangeOpts>();
  valueChange: Subject<number> = new Subject<number>();
  index0: number;
  set index(v: number) {
    this.valueChange.next((this.index0 = v));
    this.tabBarClassManage.setIndex(v);
  }
  get index() {
    return this.index0;
  }

  containerWidth: number;
  thumbWidth: number;
  scrollWidth: number;
  thumbMove: ThumbMove;
  movableMove: MovableMove;
  combine: boolean; //is combine with tabs
  public setIndex(v: number) {
    this.excuteAfterConnected.execute(() => {
      if (v === this.index) return;
      this.thumbMove.toIndex(v, () => {
        this.index = v;
        this.outputInput.next(v);
      });
    });
  }
  setIndexDirect(v: number) {
    this.excuteAfterConnected.execute(() => {
      if (v === this.index) return;
      this.index = v;
      this.thumbMove.setIndex(v);
    });
  }

  itemTap(i: number) {
    if (i === this.index) return;
    this.setIndex(i);
  }

  areaWidth0: number;
  set areaWidth(v: number) {
    if (v === this.areaWidth0) return;
    this.areaWidth0 = v;
    this.areaEl.style.width = v + "px";
  }
  get areaWidth() {
    return this.areaWidth0;
  }
  handlePointerMove() {
    this.pointerMoveChange.subscribe(progress => {
      this.thumbMove.pointerMove(progress);
    });
  }

  tabBarItemRefList: TabBarItemRef[];
  handleTabItems(end: () => void) {
    const slotNodes: Node[] = this.slotEl.assignedNodes();
    if (!slotNodes || !slotNodes.length) return;
    let containerWidth = 0;
    let tabBarIndex = 0;
    this.tabBarItemRefList = [];

    const tabBarNodes: tabBarItem[] = slotNodes.filter(
      node => node instanceof tabBarItem,
    ) as tabBarItem[];

    this.tabBarClassManage = new TabBarClassManage(tabBarNodes);
    this.willChange.subscribe(i => {
      this.tabBarClassManage.setIndex(i.value);
    });
    forkJoin(tabBarNodes.map(i => i.voyoConnected)).subscribe(i => {
      tabBarNodes.forEach(node => {
        const comWidth: number = node.offsetWidth;
        const ref = {
          tabBarItem: node,
          width: comWidth,
          tabBarEl: node,
          index: tabBarIndex++,
        };
        this.tabBarItemRefList.push(ref);
        node.addEventListener("click", () => this.itemTap(ref.index));
        containerWidth += comWidth;
      });
      this.areaWidth = containerWidth;
      end();
    });
  }
}
