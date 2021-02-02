import { __decorate } from "tslib";
import { VoyoEventEmitter, VoyoComponent } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { CarouselItemComponent } from "./carousel-item.component";
import { CarouselListManage } from "./carousel-list-manage";
import { CarouselMoveManage } from "./carousel-move-manage";
/**
 *  . Change index after animation
 *  . Must specify activeOrder. no defaults;
 *
 */
let CarouselComponent = class CarouselComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.carouselMoveManage = new CarouselMoveManage(this, 
        // @ts-ignore
        this.transitionDuration);
        // @VoyoInput({})lock: string;
        this.activeOrderChange = new VoyoEventEmitter();
        this.touchChange = new VoyoEventEmitter();
        this.moveRunning = false;
        this.touchRunning = false;
    }
    set disableTouch(v) {
        this.carouselMoveManage.disableTouch = !!v;
    }
    set transitionTime(v) {
        this.transitionDuration = v * 1000;
        this.carouselMoveManage && this.carouselMoveManage.setTransitionTime(v);
    }
    created() {
        this.container = this.shadowRoot.querySelector("#carousel-main");
    }
    set activeOrder(i) {
        i = Number(i);
        if (i == undefined)
            throw new Error("activeOrder must be number");
        if (this.carouselListManage) {
            this.carouselByIndex(i, () => {
                this.carouselListManage.setActiveIndex(i);
                this.activeIndex = i;
            });
        }
        else {
            this.activeIndex = i;
        }
    }
    getItemList(nodes) {
        this.itemList = nodes
            .filter(i => i instanceof CarouselItemComponent)
            .map((i, index) => {
            i.index = index;
            return i;
        });
    }
    /**
     * can not support dynamic inject component
     */
    mounted() {
        this.classList.add("carousel-container");
        const slot = this.shadowRoot.querySelector("#contentSlot");
        const nodes = slot.assignedNodes();
        this.getItemList(nodes);
        /**
         * from slot
         */
        if (this.itemList && !this.itemList.length && nodes.length) {
            const slotChild = nodes.find((i) => {
                return i.tagName && i.tagName.toLowerCase() === "slot";
            });
            slotChild && this.getItemList(slotChild.assignedNodes());
        }
        this.carouselListManage = new CarouselListManage(this.itemList, this.activeIndex, this.infiniteCarousel);
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
        if (!currentItem)
            return;
        currentItem.visible();
        currentItem.atMid();
    }
    visbileIndex(index, cb) {
        const { item, position } = this.carouselListManage.getItem(index);
        item.visible();
        if (position === "right") {
            item.atRight();
        }
        else if (position === "left") {
            item.atLeft();
        }
        cb && cb(item, position);
    }
    move(type) {
        if (this.moveRunning)
            return;
        if (typeof type === "number") {
            this.carouselByIndex(type);
        }
        else if (type === "siblingAdvance") {
            this.siblingAdvance();
        }
        else if (type === "siblingBack") {
            this.siblingBack();
        }
    }
    animateAdvance(currentItem, nextItem, cb, transitionDuration = this.transitionDuration) {
        this.moveRunning = true;
        currentItem.atMid();
        nextItem.atLeft();
        currentItem.animateTo(transitionDuration, "right", () => {
            this.moveRunning = false;
            cb && cb();
        }, true);
        nextItem.animateTo(transitionDuration, "mid");
    }
    animateBack(currentItem, nextItem, cb, transitionDuration = this.transitionDuration) {
        this.moveRunning = true;
        currentItem.atMid();
        nextItem.atRight();
        nextItem.animateTo(transitionDuration, "mid");
        currentItem.animateTo(transitionDuration, "left", () => {
            this.moveRunning = false;
            cb && cb();
        }, true);
    }
    /**
     * carousel by arrow
     */
    siblingAdvance() {
        const p1 = this.carouselListManage.getCurrent();
        const p2 = this.carouselListManage.getPre();
        if (!p2)
            return;
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
        if (!p2)
            return;
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
    carouselByIndex(index, cb) {
        if (index === this.carouselListManage.getCurrentIndex())
            return cb && cb();
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
        }
        else if (position === "left") {
            this.animateAdvance(p1, p2, () => {
                p1.hid();
                this.carouselListManage.setActiveIndex(index);
                cb && cb();
            });
        }
    }
};
__decorate([
    VoyoInput({ name: "disableTouch" })
], CarouselComponent.prototype, "disableTouch", null);
__decorate([
    VoyoInput({
        name: "transitionTime",
        defaultValue: 0.4,
    })
], CarouselComponent.prototype, "transitionTime", null);
__decorate([
    VoyoOutput({ event: "activeOrderChange" })
], CarouselComponent.prototype, "activeOrderChange", void 0);
__decorate([
    VoyoOutput({ event: "touchChange" })
], CarouselComponent.prototype, "touchChange", void 0);
__decorate([
    VoyoInput({ name: "activeOrder" })
], CarouselComponent.prototype, "activeOrder", null);
__decorate([
    VoyoInput({ name: "infinite", defaultValue: false })
], CarouselComponent.prototype, "infiniteCarousel", void 0);
CarouselComponent = __decorate([
    VoyoDor({
        template: `
<slot id="contentSlot"></slot>
  `,
        styles: '.voyo-carousel-container{position:relative;display:block;overflow:hidden;width:100%}',
    })
], CarouselComponent);
export { CarouselComponent };
