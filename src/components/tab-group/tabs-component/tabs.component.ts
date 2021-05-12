import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";
import { VoyoOutput } from "../../Output.decorator";
import { CarouselComponent } from "../../carousel/carousel.component";
import { Subject } from "rxjs";
import { LayoutController, TabgroupLayoutType } from "../tab.interface";
import { ExcuteAfterConnected } from "../../utils";
import { ClassManage } from "../../../utils";

@VoyoDor({
  template: `
 <voyoc-carousel class="tabs-carousel-container">
    <slot></slot>    
 </voyoc-carousel>
    `,
  styles: require("./tabs.webscss"),
})
export class TabsComponent extends VoyoComponent implements LayoutController {
  @VoyoInput({}) set transitionTime(v: number) {
    this.carouselEl.setAttribute("transitionTime", v + "");
  }
  @VoyoInput({}) set value(v: number) {
    this.setIndex(Number(v));
  }
  @VoyoOutput({ event: "input" }) inputChange: VoyoEventEmitter<
      number
      > = new VoyoEventEmitter<number>();
  value0: number;
  get value() {
    return this.value0;
  }
  setIndex(v: number, cb?: () => void) {
    if (v === this.value0) return;
    if (
        !this.carouselEl.isConnected ||
        this.carouselEl.activeIndex === undefined
    ) {
      this.value0 = this.carouselEl.activeOrder = v;
      cb && cb();
    } else {
      this.carouselEl.activeOrder = v;
      this.carouselEl.carouselByIndex(v, () => {
        this.value0 = v;
        cb && cb();
      });
    }
  }
  excuteAfterConnected: ExcuteAfterConnected = new ExcuteAfterConnected();

  /**
   * layout change
   * @param type
   */
  setLayout(type: TabgroupLayoutType) {
    type &&
    this.excuteAfterConnected.execute(() => {
      this.classManage.replaceClass("layout", type);
    });
  }
  classManage: ClassManage;
  carouselEl: CarouselComponent;
  slotEl: HTMLSlotElement;
  progressChange: Subject<number> = new Subject<number>();
  created() {
    this.carouselEl = this.shadowRoot.querySelector("voyoc-carousel");
    this.slotEl = this.shadowRoot.querySelector("tabs-slot");
    this.carouselEl.addEventListener("activeOrderChange", (e: any) => {
      this.inputChange.next((this.value0 = e.detail));
    });
    this.carouselEl.addEventListener("touchChange", (e: any) => {
      this.progressChange.next(e.detail);
    });
  }
  mounted() {
    this.classManage = new ClassManage(this);
    this.classList.add("carousel-container");
    this.excuteAfterConnected.connect();
  }
  // appendChild<T extends Node>(newChild: T): T {
  //   this.carouselEl.appendChild(newChild);
  //   return newChild;
  // }
}
