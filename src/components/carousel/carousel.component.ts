import { VoyoEventEmitter, VoyoComponent } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { CarouselItemComponent } from "./carousel-item.component";
import { CarouselListManage } from "./carousel-list-manage";
import { EndOpts, horizontalTouch, MoveOpts } from "../../utils/hammer";
import { CarouselMoveManage } from "./carousel-move-manage";
import { MoveChangeParams } from "./carousel.interface";

export type MoveType = "siblingAdvance" | "siblingBack" | number;

/**
 *  . Change index after animation
 *  . Must specify activeOrder. no defaults;
 *
 */
@VoyoDor({
  template: `
<slot id="contentSlot"></slot>
  `,
  styles: require("./carousel.component.webscss"),
})
export class CarouselComponent extends VoyoComponent {
  @VoyoInput({ name: "disableTouch" }) set disableTouch(v: boolean) {
    this.carouselMoveManage.disableTouch = !!v;
  }
  @VoyoInput({
    name: "transitionTime",
    defaultValue: 0.4,
  })
  set transitionTime(v: number) {
    this.transitionDuration = v * 1000;
    this.carouselMoveManage && this.carouselMoveManage.setTransitionTime(v);
  }
  transitionDuration: number;
  container: HTMLElement;
  carouselListManage: CarouselListManage<CarouselItemComponent>;

  carouselMoveManage: CarouselMoveManage = new CarouselMoveManage(
    this,
    // @ts-ignore
    this.transitionDuration,
  );
  created() {
    this.container = this.shadowRoot.querySelector("#carousel-main");
  }
  // @VoyoInput({})lock: string;
  @VoyoOutput({ event: "activeOrderChange" })
  activeOrderChange: VoyoEventEmitter<number> = new VoyoEventEmitter();
  @VoyoOutput({ event: "touchChange" }) touchChange: VoyoEventEmitter<
    MoveChangeParams
  > = new VoyoEventEmitter<MoveChangeParams>();
  @VoyoInput({ name: "activeOrder" })
  set activeOrder(i: number) {
    i = Number(i);
    if (i == undefined) throw new Error("activeOrder must be number");
    if (this.carouselListManage) {
      this.carouselByIndex(i, () => {
        this.carouselListManage.setActiveIndex(i);
        this.activeIndex = i;
      });
    } else {
      this.activeIndex = i;
    }
  }
  @VoyoInput({ name: "infinite", defaultValue: false })
  infiniteCarousel: boolean;

  activeIndex: number;
  itemList: CarouselItemComponent[];
  getItemList(nodes: Node[]) {
    this.itemList = nodes
      .filter(i => i instanceof CarouselItemComponent)
      .map((i: any, index) => {
        i.index = index;
        return i;
      }) as any;
  }
  /**
   * can not support dynamic inject component
   */
  mounted() {
    this.classList.add("carousel-container");
    const slot = this.shadowRoot.querySelector("#contentSlot");
    const nodes: Node[] = slot.assignedNodes();
    this.getItemList(nodes);
    /**
     * from slot
     */
    if (this.itemList && !this.itemList.length && nodes.length) {
      const slotChild: any = nodes.find((i: any) => {
        return i.tagName && i.tagName.toLowerCase() === "slot";
      });
      slotChild && this.getItemList(slotChild.assignedNodes());
    }
    this.carouselListManage = new CarouselListManage<CarouselItemComponent>(
      this.itemList,
      this.activeIndex,
      this.infiniteCarousel,
    );
    this.carouselListManage.activeIndexChange.subscribe(index => {
      this.activeOrderChange.next(index);
    });
    this.visibleCurrent();
    this.carouselMoveManage.watchTouch();

    this.itemList.forEach((item, index) => {
      item.animateMoveChange.subscribe(p => {
        if (index === this.carouselListManage.activeIndex) {
          this.touchChange.next(p);
        }
      });
    });
  }
  visibleCurrent() {
    const currentItem = this.carouselListManage.getCurrent();
    if (!currentItem) return;
    currentItem.visible();
    currentItem.atMid();
  }

  visbileIndex(
    index: number,
    cb?: (i: CarouselItemComponent, position: "left" | "mid" | "right") => void,
  ) {
    const { item, position } = this.carouselListManage.getItem(index);
    item.visible();
    if (position === "right") {
      item.atRight();
    } else if (position === "left") {
      item.atLeft();
    }
    cb && cb(item, position);
  }
  moveRunning = false;
  touchRunning = false;
  move(type: MoveType) {
    if (this.moveRunning) return;
    if (typeof type === "number") {
      this.carouselByIndex(type);
    } else if (type === "siblingAdvance") {
      this.siblingAdvance();
    } else if (type === "siblingBack") {
      this.siblingBack();
    }
  }
  animateAdvance(
    currentItem: CarouselItemComponent,
    nextItem: CarouselItemComponent,
    cb?: () => void,
    transitionDuration: number = this.transitionDuration,
  ) {
    this.moveRunning = true;
    currentItem.atMid();
    nextItem.atLeft();
    currentItem.animateTo(
      transitionDuration,
      "right",
      () => {
        this.moveRunning = false;
        cb && cb();
      },
      true,
    );
    nextItem.animateTo(transitionDuration, "mid");
  }
  animateBack(
    currentItem: CarouselItemComponent,
    nextItem: CarouselItemComponent,
    cb?: () => void,
    transitionDuration: number = this.transitionDuration,
  ) {
    this.moveRunning = true;
    currentItem.atMid();
    nextItem.atRight();
    nextItem.animateTo(transitionDuration, "mid");
    currentItem.animateTo(
      transitionDuration,
      "left",
      () => {
        this.moveRunning = false;
        cb && cb();
      },
      true,
    );
  }

  /**
   * carousel by arrow
   */
  siblingAdvance() {
    const p1 = this.carouselListManage.getCurrent();
    const p2 = this.carouselListManage.getPre();
    if (!p2) return;
    p1.visible();
    p2.visible();
    this.animateAdvance(p1, p2, () => {
      p1.hid();
      this.carouselListManage.advance();
    });
  }

  /**
   * carousel by arrow
   */
  siblingBack() {
    const p1 = this.carouselListManage.getCurrent();
    const p2 = this.carouselListManage.getNext();
    if (!p2) return;
    p1.visible();
    p2.visible();
    this.animateBack(p1, p2, () => {
      p1.hid();
      this.carouselListManage.back();
    });
  }

  /**
   * carousel by index
   * @param index
   * @param cb
   */
  carouselByIndex(index: number, cb?: () => void) {
    if (index === this.carouselListManage.getCurrentIndex()) return cb && cb();
    const p1 = this.carouselListManage.getCurrent();
    /***
     * if not specify default index before carousel run.
     */
    if (!p1) {
      this.carouselListManage.setActiveIndex(index);
      this.visibleCurrent();
      return cb && cb();
    }
    const { item: p2, position } = this.carouselListManage.getItem(index);
    p1.visible();
    p2.visible();
    if (position === "right") {
      this.animateBack(p1, p2, () => {
        p1.hid();
        this.carouselListManage.setActiveIndex(index);
        cb && cb();
      });
    } else if (position === "left") {
      this.animateAdvance(p1, p2, () => {
        p1.hid();
        this.carouselListManage.setActiveIndex(index);
        cb && cb();
      });
    }
  }
}
