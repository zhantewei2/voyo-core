import { __decorate } from "tslib";
import { VoyoComponent } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { ClassManage } from "../../utils";
import { Subject } from "rxjs";
import anime from "animejs/lib/anime.es.js";
let CarouselItemComponent = class CarouselItemComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.isVisible = false;
        this.animateRun = false;
        this.animateMoveChange = new Subject();
        this.positionStateCurrent = "mid";
        this.positionStatePre = "mid";
        this.moveDis = 0;
    }
    transformMove(disX) {
        this.visible();
        if (this.positionState === "right") {
            disX = this.containerWidth + disX;
        }
        else if (this.positionState === "left") {
            disX = 0 - this.containerWidth + disX;
        }
        this.moveDis = disX;
        this.style.transform = `translateX(${disX}px)`;
    }
    listenAnimate(startPos, targetPos, indexPos, moveType, progress) {
        let relativeV = 0;
        progress = progress / 100;
        if (moveType === "to" || moveType === "toIndex") {
            relativeV =
                (startPos + (targetPos - startPos) * progress) / this.containerWidth;
        }
        else if (moveType === "reset") {
            const dis = targetPos - startPos;
            relativeV = (dis - dis * progress) / this.containerWidth;
            relativeV = startPos > 0 ? Math.abs(relativeV) : 0 - Math.abs(relativeV);
        }
        this.animateMoveChange.next({
            v: (targetPos - startPos > 0 ? progress : 0 - progress) / 100,
            relativeV: relativeV,
            type: moveType,
        });
    }
    created() {
        this.classM = new ClassManage(this);
    }
    connectedCallback() {
        this.containerWidth = this.parentNode.offsetWidth;
        if (!this.containerWidth) {
            setTimeout(() => (this.containerWidth = this.parentNode.offsetWidth));
        }
        this.classList.add("carousel-page");
        if (!this.isVisible)
            this.classList.add("no-display");
    }
    visible() {
        if (this.isVisible)
            return;
        this.isVisible = true;
        this.classList.remove("no-display");
    }
    hid() {
        if (!this.isVisible)
            return;
        this.isVisible = false;
        this.classList.add("no-display");
    }
    set positionState(v) {
        this.positionStatePre = this.positionStateCurrent;
        this.positionStateCurrent = v;
    }
    get positionState() {
        return this.positionStateCurrent;
    }
    atLeft() {
        if (this.positionState === "left")
            return;
        this.style.transform = "translateX(-100%)";
        this.positionState = "left";
        this.moveDis = 0 - this.containerWidth;
    }
    atRight() {
        if (this.positionState === "right")
            return;
        this.style.transform = "translateX(100%)";
        this.positionState = "right";
        this.moveDis = this.containerWidth;
    }
    atMid() {
        // if(this.positionState==="mid")return;
        this.style.transform = "translateX(0)";
        this.positionState = "mid";
        this.moveDis = 0;
    }
    atPosition(pos) {
        if (pos === "mid") {
            this.atMid();
        }
        else if (pos === "left") {
            this.atLeft();
        }
        else if (pos === "right") {
            this.atRight();
        }
    }
    switchTransform(pos) {
        if (pos === "mid") {
            return 0;
        }
        else if (pos === "left") {
            return 0 - this.containerWidth;
        }
        else if (pos === "right") {
            return this.containerWidth;
        }
        return 0;
    }
    animateTo(transitionDuration, pos, animateEnd, specifyIndex) {
        if (pos === this.positionState)
            return;
        this.animateRun = true;
        const startPos = this.moveDis;
        const targetPos = this.switchTransform(pos);
        anime({
            targets: this,
            translateX: [startPos + "px", targetPos + "px"],
            duration: transitionDuration,
            easing: "easeOutQuart",
            update: (an) => this.listenAnimate(startPos, targetPos, this.switchTransform(this.positionState), specifyIndex ? "toIndex" : "to", an.progress),
            complete: (an) => {
                this.animateRun = false;
                this.atPosition(pos);
                animateEnd && animateEnd();
            },
        });
    }
    clearTransformStyleAn(duration, animateEnd) {
        this.animateRun = true;
        const startPos = this.moveDis;
        const targetPos = this.switchTransform(this.positionState);
        anime({
            targets: this,
            translateX: [this.moveDis, this.switchTransform(this.positionState)],
            duration,
            easing: "linear",
            update: (an) => this.listenAnimate(startPos, targetPos, targetPos, "reset", an.progress),
            complete: (an) => {
                this.animateRun = false;
                animateEnd && animateEnd();
            },
        });
    }
};
__decorate([
    VoyoInput({ name: "order" })
], CarouselItemComponent.prototype, "order", void 0);
CarouselItemComponent = __decorate([
    VoyoDor({
        template: `
<slot></slot>
  `,
    })
], CarouselItemComponent);
export { CarouselItemComponent };
