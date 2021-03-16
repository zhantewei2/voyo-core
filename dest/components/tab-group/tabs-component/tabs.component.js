import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";
import { VoyoOutput } from "../../Output.decorator";
import { Subject } from "rxjs";
import { ExcuteAfterConnected } from "../../utils";
import { ClassManage } from "../../../utils";
let TabsComponent = class TabsComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.inputChange = new VoyoEventEmitter();
        this.excuteAfterConnected = new ExcuteAfterConnected();
        this.progressChange = new Subject();
        // appendChild<T extends Node>(newChild: T): T {
        //   this.carouselEl.appendChild(newChild);
        //   return newChild;
        // }
    }
    set transitionTime(v) {
        this.carouselEl.setAttribute("transitionTime", v + "");
    }
    set value(v) {
        this.setIndex(Number(v));
    }
    get value() {
        return this.value0;
    }
    setIndex(v, cb) {
        if (v === this.value0)
            return;
        if (!this.carouselEl.isConnected ||
            this.carouselEl.activeIndex === undefined) {
            this.value0 = this.carouselEl.activeOrder = v;
            cb && cb();
        }
        else {
            this.carouselEl.activeOrder = v;
            this.carouselEl.carouselByIndex(v, () => {
                this.value0 = v;
                cb && cb();
            });
        }
    }
    /**
     * layout change
     * @param type
     */
    setLayout(type) {
        type &&
            this.excuteAfterConnected.execute(() => {
                this.classManage.replaceClass("layout", type);
            });
    }
    created() {
        this.carouselEl = this.shadowRoot.querySelector("voyoc-carousel");
        this.slotEl = this.shadowRoot.querySelector("tabs-slot");
        this.carouselEl.addEventListener("activeOrderChange", (e) => {
            this.inputChange.next((this.value0 = e.detail));
        });
        this.carouselEl.addEventListener("touchChange", (e) => {
            this.progressChange.next(e.detail);
        });
    }
    mounted() {
        this.classManage = new ClassManage(this);
        this.classList.add("carousel-container");
        this.excuteAfterConnected.connect();
    }
};
__decorate([
    VoyoInput({})
], TabsComponent.prototype, "transitionTime", null);
__decorate([
    VoyoInput({})
], TabsComponent.prototype, "value", null);
__decorate([
    VoyoOutput({ event: "input" })
], TabsComponent.prototype, "inputChange", void 0);
TabsComponent = __decorate([
    VoyoDor({
        template: `
 <voyoc-carousel>
    <slot></slot>    
 </voyoc-carousel>
    `,
        styles: '.carousel-page{position:absolute;top:0;left:0;width:100%;height:100%;contain:strict;will-change:transform;opacity:1;overflow-y:auto}.no-display{display:none!important}.carousel-container{display:block;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%}',
    })
], TabsComponent);
export { TabsComponent };
