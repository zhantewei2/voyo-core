import {
  VoyoComponent,
  VoyoEventEmitter,
  VoyoTemplateRef,
} from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import {
  listenScroll,
  verticalTouch,
  getScrollParent,
  ClassManage,
  ScrollListenerEvent,
  disableIOSDebounce,
} from "../../utils";
import { VoyoOutput } from "../../components";
import { RefreshAnimation } from "./refresh-animation";
import { Observable, Subject } from "rxjs";
import { ExcuteAfterConnected } from "../utils";

@VoyoDor({
  template: `
<header class="voyo-refresh-container">
    <div class="voyo-refresh-running">
      <slot name="running"></slot>
    </div>
    <div class="voyo-refresh-will">
      <slot name="will"></slot>
    </div>
    <div class="voyo-refresh-down">
      <slot name="down"></slot>
    </div>
    <slot name="refresher"></slot>
</header>
<article id="refresh-article">
  <slot></slot>
</article>
    `,
  styles: require("./refresh.webscss"),
})
export class RefeshComponent extends VoyoComponent {
  @VoyoInput({ name: "effects" }) defaultEffects: any;
  @VoyoInput({ name: "vibrate", defaultValue: true }) vibrate: boolean;
  @VoyoInput({ name: "maxDistance", defaultValue: 150 }) maxDistance: number;
  @VoyoInput({ name: "triggerDistance", defaultValue: 100 })
  triggerDistance: number;
  @VoyoInput({ name: "disabled", defaultValue: false }) disabledScroll: boolean;
  @VoyoOutput({ event: "refresherRefresh" }) refresherRefresh: VoyoEventEmitter<
    () => void
  > = new VoyoEventEmitter<() => void>();
  @VoyoOutput({ event: "refreshEnd" }) refreshEnd: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  containerManage: ClassManage;
  containerEl: HTMLElement;
  runningEl: HTMLElement;
  willEl: HTMLElement;
  downEl: HTMLElement;
  articleEl: HTMLElement;
  refreshAnimation: RefreshAnimation;
  public scrollContainer: HTMLElement;
  scrollContainerTop: number;
  refreshRunning = false;
  moveStartY: number | undefined;
  refreshTriggerSubject: Subject<boolean> = new Subject<boolean>();
  public executeAfterConnected: ExcuteAfterConnected = new ExcuteAfterConnected();
  public listenScroll: Observable<ScrollListenerEvent>;
  pauseRefresh() {
    this.refreshAnimation.pause();
  }
  _canMove: boolean;
  disableTouchStart: boolean;
  @VoyoTemplate({
    tag: "span",
    render: "下拉刷新",
  })
  downTemplate: VoyoTemplateRef;

  @VoyoTemplate({
    tag: "span",
    render: "刷新中",
  })
  runningTemplate: VoyoTemplateRef;

  @VoyoTemplate({
    tag: "span",
    render: "释放刷新",
  })
  willTemplate: VoyoTemplateRef;

  get disableTouch(): boolean {
    return (
      this.disabledScroll ||
      this.refreshAnimation.breakTriggering ||
      this.refreshAnimation.triggerBreak ||
      this.refreshAnimation.breakTriggeringRun
    );
  }
  get disableEndTouch(): boolean {
    return (
      this.refreshAnimation.breakTriggering ||
      this.refreshAnimation.triggerBreak ||
      this.refreshAnimation.breakTriggeringRun
    );
  }
  get canMove(): boolean {
    return this._canMove || this.refreshRunning;
  }
  parentScrollBePrevented = false;
  preventParentScroll() {
    if (this.parentScrollBePrevented) return;
    this.scrollContainer.style.overflowY = "hidden";
    this.parentScrollBePrevented = true;
  }
  restoreParentScroll() {
    if (!this.parentScrollBePrevented) return;
    this.scrollContainer.style.overflowY = "auto";
    this.parentScrollBePrevented = false;
  }
  refreshTrigger() {
    this.refreshTriggerSubject.next(true);
    this.refreshAnimation.setTriggerBreak();
  }
  refreshTriggerEnd() {
    this.refreshTriggerSubject.next(false);
    this.refreshAnimation.clearTriggerBreak(() => this.refresherEnd());
  }
  refresherEnd() {
    this.moveStartY = undefined;
    this.refreshAnimation.end();
    this.restoreParentScroll();
  }
  created() {
    this.runningEl = this.shadowRoot.querySelector(".voyo-refresh-running");
    this.downEl = this.shadowRoot.querySelector(".voyo-refresh-down");
    this.willEl = this.shadowRoot.querySelector(".voyo-refresh-will");
    this.containerEl = this.shadowRoot.querySelector(".voyo-refresh-container");
    this.articleEl = this.shadowRoot.querySelector("#refresh-article");
    this.containerManage = new ClassManage(this.containerEl);
  }

  handlerRefreshContainer() {
    let preP: number;
    this.refreshAnimation.percentEvent.subscribe(
      ({ triggerDistancePercent }) => {
        if (triggerDistancePercent === preP) return;
        this.containerEl.style.transform = `scale(${triggerDistancePercent},${triggerDistancePercent})`;
        preP = triggerDistancePercent;
      },
    );
  }
  handlerSlot() {
    const runningSlot = this.shadowRoot.querySelector("slot[name='running']");
    const willSlot = this.shadowRoot.querySelector("slot[name='will']");
    const downSlot = this.shadowRoot.querySelector("slot[name='down']");
    if (this.defaultEffects) {
      if (!willSlot.assignedNodes().length) {
        this.willTemplate.insert(this.willEl);
      }
      if (!runningSlot.assignedNodes().length) {
        this.runningTemplate.insert(this.runningEl);
      }
      if (!downSlot.assignedNodes().length) {
        this.downTemplate.insert(this.downEl);
      }
    }
  }
  mounted() {
    this.scrollContainer = getScrollParent(this);
    disableIOSDebounce(this.scrollContainer);
    this.listenScroll = listenScroll(this.scrollContainer);
    this.refreshAnimation = new RefreshAnimation(
      this.articleEl,
      this.maxDistance,
      this.triggerDistance,
    );
    this.containerEl.style.height = this.triggerDistance + "px";

    this.refreshAnimation.triggerWillEvent.subscribe(v => {
      if (this.vibrate && v) {
        navigator.vibrate && navigator.vibrate(100);
      }
      this.containerManage.toggleClass("__will", v);
    });
    this.refreshTriggerSubject.subscribe(v => {
      this.containerManage.toggleClass("__running", v);
    });
    this.handlerRefreshContainer();
    this.handlerSlot();

    this.listenScroll.subscribe(({ v }) => {
      this.scrollContainerTop = v;
    });

    verticalTouch({
      element: this.scrollContainer,
      begin: e => {
        this.disableTouchStart =
          this.disabledScroll ||
          this.refreshAnimation.breakTriggering ||
          this.refreshAnimation.triggerBreak ||
          this.refreshAnimation.breakTriggeringRun;
        if (this.disableTouchStart) return;
        if (this.refreshAnimation.isBacking) {
          this.moveStartY = undefined;
          this.pauseRefresh();
        }
      },
      move: e => {
        if (this.disableTouch || this.disableTouchStart) return;
        if (this.scrollContainerTop === 0) {
          if (this.moveStartY === undefined) this.moveStartY = e.moveY;
          this.refreshAnimation.getMovePercent(e.moveY - this.moveStartY);
          if (this.refreshAnimation.movePercent > 0) {
            this.preventParentScroll();
          } else {
            this.restoreParentScroll();
          }
          this.refreshAnimation.touchMove();
        }
      },
      end: e => {
        if (this.disableTouchStart) return (this.disableTouchStart = false);
        this.disableTouchStart = false;
        if (this.disableEndTouch) return;

        if (this.refreshAnimation.isDefault) {
          this.refresherEnd();
        } else {
          if (
            this.refreshAnimation.canTrigger &&
            !this.refreshAnimation.breakTriggering
          ) {
            this.refreshTrigger();
            this.refresherRefresh.next(() => this.refreshTriggerEnd());
          }
          this.refreshAnimation.back(() => this.refresherEnd());
        }
      },
    });
    this.executeAfterConnected.connect();
  }
}
