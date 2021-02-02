import { KeepScrollContainer } from "@voyo/core/utils/scroll";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../../components";
import { ClassManage } from "../../utils";
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";

@VoyoDor({
  template: `
  <slot></slot>
  `,
  styles: require("./scroll-view.webscss"),
})
export class ScrollViewComponent extends VoyoComponent {
  excuteAfterConnected: ExcuteAfterConnected = new ExcuteAfterConnected();
  classManager: ClassManage;
  _behavior: "x" | "y";
  @VoyoInput({ name: "lowerThreshold", defaultValue: 0 })
  lowerThreshold: number;
  @VoyoInput({ name: "behavior", defaultValue: "y" }) set behavior(
    v: "x" | "y",
  ) {
    this.excuteAfterConnected.execute(() => {
      this.classManager.replaceClass(
        "voyo-behavior",
        v === "x" ? "overflow-x" : v === "y" ? "overflow-y" : "",
      );
      this._behavior = v;
    });
  }
  @VoyoInput({ name: "full" }) set full(v: boolean) {
    this.excuteAfterConnected.execute(() => {
      this.classManager.toggleClass("abs-full", v);
    });
  }
  @VoyoInput({ name: "scrollLower", defaultValue: false }) set scrollLower(
    useScrollLower: boolean,
  ) {
    if (!useScrollLower) return;
    if (!this.scrollListenered) {
      let scrollTop: number, scrollHeight: number;
      this.containerEl.addEventListener(
        "scroll",
        e => {
          this.calContainerHeight();
          scrollTop = this.containerEl.scrollTop;
          scrollHeight = this.containerEl.scrollHeight;
          if (
            scrollHeight - scrollTop - this.containerHeight <=
            this.lowerThreshold
          ) {
            if (!this.isLower) {
              this.isLower = true;
              this.scrolltolowerEvent.next(true);
            }
          } else if (this.isLower) {
            this.isLower = false;
          }
        },
        { passive: true },
      );
    }
  }
  mounted() {
    this.excuteAfterConnected.connect();
  }
  @VoyoOutput({ event: "scrolltolower" }) scrolltolowerEvent: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();

  containerEl: HTMLElement;
  scrollListenered = false;
  containerHeight = 0;
  isLower: boolean;
  keepScrollContainer: KeepScrollContainer;
  created() {
    // this.containerEl=this.shadowRoot.querySelector("#scroll-container");
    this.containerEl = this;
    this.classManager = new ClassManage(this.containerEl);
  }
  afterCreate() {
    this.keepScrollContainer = new KeepScrollContainer({
      scrollContainer: this.containerEl,
      behavior: this._behavior,
    });
    this.keepScrollContainer.listen();
  }
  connectedCallback() {
    this.keepScrollContainer.restore();
  }
  reCalHeight() {
    this.containerHeight = 0;
  }
  calContainerHeight() {
    if (this.containerHeight) return;
    this.containerHeight = this.containerEl.clientHeight;
  }
}
