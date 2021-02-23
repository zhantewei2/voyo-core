import { __decorate } from "tslib";
import { KeepScrollContainer } from "../../utils/scroll";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../../components";
import { ClassManage } from "../../utils";
import { ExcuteAfterConnected } from "../utils/excuteAfterConnected";
let ScrollViewComponent = class ScrollViewComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.excuteAfterConnected = new ExcuteAfterConnected();
        this.scrolltolowerEvent = new VoyoEventEmitter();
        this.scrollListenered = false;
        this.containerHeight = 0;
    }
    set behavior(v) {
        this.excuteAfterConnected.execute(() => {
            this.classManager.replaceClass("voyo-behavior", v === "x" ? "overflow-x" : v === "y" ? "overflow-y" : "");
            this._behavior = v;
        });
    }
    set full(v) {
        this.excuteAfterConnected.execute(() => {
            this.classManager.toggleClass("abs-full", v);
        });
    }
    set scrollLower(useScrollLower) {
        if (!useScrollLower)
            return;
        if (!this.scrollListenered) {
            let scrollTop, scrollHeight;
            this.containerEl.addEventListener("scroll", e => {
                this.calContainerHeight();
                scrollTop = this.containerEl.scrollTop;
                scrollHeight = this.containerEl.scrollHeight;
                if (scrollHeight - scrollTop - this.containerHeight <=
                    this.lowerThreshold) {
                    if (!this.isLower) {
                        this.isLower = true;
                        this.scrolltolowerEvent.next(true);
                    }
                }
                else if (this.isLower) {
                    this.isLower = false;
                }
            }, { passive: true });
        }
    }
    mounted() {
        this.excuteAfterConnected.connect();
    }
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
        if (this.containerHeight)
            return;
        this.containerHeight = this.containerEl.clientHeight;
    }
};
__decorate([
    VoyoInput({ name: "lowerThreshold", defaultValue: 0 })
], ScrollViewComponent.prototype, "lowerThreshold", void 0);
__decorate([
    VoyoInput({ name: "behavior", defaultValue: "y" })
], ScrollViewComponent.prototype, "behavior", null);
__decorate([
    VoyoInput({ name: "full" })
], ScrollViewComponent.prototype, "full", null);
__decorate([
    VoyoInput({ name: "scrollLower", defaultValue: false })
], ScrollViewComponent.prototype, "scrollLower", null);
__decorate([
    VoyoOutput({ event: "scrolltolower" })
], ScrollViewComponent.prototype, "scrolltolowerEvent", void 0);
ScrollViewComponent = __decorate([
    VoyoDor({
        template: `
  <slot></slot>
  `,
        styles: '',
    })
], ScrollViewComponent);
export { ScrollViewComponent };
