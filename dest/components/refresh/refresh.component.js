import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter, } from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { listenScroll, verticalTouch, getScrollParent, ClassManage, disableIOSDebounce, } from "../../utils";
import { VoyoOutput } from "../../components";
import { RefreshAnimation } from "./refresh-animation";
import { Subject } from "rxjs";
import { ExcuteAfterConnected } from "../utils";
let RefeshComponent = class RefeshComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.refresherRefresh = new VoyoEventEmitter();
        this.refreshEnd = new VoyoEventEmitter();
        this.refreshRunning = false;
        this.refreshTriggerSubject = new Subject();
        this.executeAfterConnected = new ExcuteAfterConnected();
        this.parentScrollBePrevented = false;
    }
    pauseRefresh() {
        this.refreshAnimation.pause();
    }
    get disableTouch() {
        return (this.disabledScroll ||
            this.refreshAnimation.breakTriggering ||
            this.refreshAnimation.triggerBreak ||
            this.refreshAnimation.breakTriggeringRun);
    }
    get disableEndTouch() {
        return (this.refreshAnimation.breakTriggering ||
            this.refreshAnimation.triggerBreak ||
            this.refreshAnimation.breakTriggeringRun);
    }
    get canMove() {
        return this._canMove || this.refreshRunning;
    }
    preventParentScroll() {
        if (this.parentScrollBePrevented)
            return;
        this.scrollContainer.style.overflowY = "hidden";
        this.parentScrollBePrevented = true;
    }
    restoreParentScroll() {
        if (!this.parentScrollBePrevented)
            return;
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
        let preP;
        this.refreshAnimation.percentEvent.subscribe(({ triggerDistancePercent }) => {
            if (triggerDistancePercent === preP)
                return;
            this.containerEl.style.transform = `scale(${triggerDistancePercent},${triggerDistancePercent})`;
            preP = triggerDistancePercent;
        });
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
        this.refreshAnimation = new RefreshAnimation(this.articleEl, this.maxDistance, this.triggerDistance);
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
                if (this.disableTouchStart)
                    return;
                if (this.refreshAnimation.isBacking) {
                    this.moveStartY = undefined;
                    this.pauseRefresh();
                }
            },
            move: e => {
                if (this.disableTouch || this.disableTouchStart)
                    return;
                if (this.scrollContainerTop === 0) {
                    if (this.moveStartY === undefined)
                        this.moveStartY = e.moveY;
                    this.refreshAnimation.getMovePercent(e.moveY - this.moveStartY);
                    if (this.refreshAnimation.movePercent > 0) {
                        this.preventParentScroll();
                    }
                    else {
                        this.restoreParentScroll();
                    }
                    this.refreshAnimation.touchMove();
                }
            },
            end: e => {
                if (this.disableTouchStart)
                    return (this.disableTouchStart = false);
                this.disableTouchStart = false;
                if (this.disableEndTouch)
                    return;
                if (this.refreshAnimation.isDefault) {
                    this.refresherEnd();
                }
                else {
                    if (this.refreshAnimation.canTrigger &&
                        !this.refreshAnimation.breakTriggering) {
                        this.refreshTrigger();
                        this.refresherRefresh.next(() => this.refreshTriggerEnd());
                    }
                    this.refreshAnimation.back(() => this.refresherEnd());
                }
            },
        });
        this.executeAfterConnected.connect();
    }
};
__decorate([
    VoyoInput({ name: "effects" })
], RefeshComponent.prototype, "defaultEffects", void 0);
__decorate([
    VoyoInput({ name: "vibrate", defaultValue: true })
], RefeshComponent.prototype, "vibrate", void 0);
__decorate([
    VoyoInput({ name: "maxDistance", defaultValue: 150 })
], RefeshComponent.prototype, "maxDistance", void 0);
__decorate([
    VoyoInput({ name: "triggerDistance", defaultValue: 100 })
], RefeshComponent.prototype, "triggerDistance", void 0);
__decorate([
    VoyoInput({ name: "disabled", defaultValue: false })
], RefeshComponent.prototype, "disabledScroll", void 0);
__decorate([
    VoyoOutput({ event: "refresherRefresh" })
], RefeshComponent.prototype, "refresherRefresh", void 0);
__decorate([
    VoyoOutput({ event: "refreshEnd" })
], RefeshComponent.prototype, "refreshEnd", void 0);
__decorate([
    VoyoTemplate({
        tag: "span",
        render: "下拉刷新",
    })
], RefeshComponent.prototype, "downTemplate", void 0);
__decorate([
    VoyoTemplate({
        tag: "span",
        render: "刷新中",
    })
], RefeshComponent.prototype, "runningTemplate", void 0);
__decorate([
    VoyoTemplate({
        tag: "span",
        render: "释放刷新",
    })
], RefeshComponent.prototype, "willTemplate", void 0);
RefeshComponent = __decorate([
    VoyoDor({
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
        styles: '@-webkit-keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@keyframes VoyoMenuShow{0%{transform:scale3d(.5,.5,.5);opacity:.1}}@-webkit-keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}@keyframes VoyoMenuHide{to{transform:scale3d(.5,.5,.5);opacity:0}}.voyo-refresh-container{position:absolute;top:0;left:0;width:100%;will-change:transform;transform:scale(0);transform-origin:50% 0;display:flex;justify-content:center;align-items:center}.voyo-refresh-down,.voyo-refresh-running,.voyo-refresh-will{display:none;flex-flow:column;justify-content:center}.voyo-refresh-container.__running .voyo-refresh-running,.voyo-refresh-down{display:flex}.voyo-refresh-container.__running .voyo-refresh-down{display:none}.voyo-refresh-container.__will .voyo-refresh-will{display:flex}.voyo-refresh-container.__will .voyo-refresh-down{display:none}',
    })
], RefeshComponent);
export { RefeshComponent };
