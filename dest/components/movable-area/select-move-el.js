import { Subject } from "rxjs";
import { horizontalTouch, verticalTouch } from "../../utils/hammer";
import { SelectMove } from "./select-move";
import { getScrollParent } from "../../utils/scroll";
export class SelectMoveEl extends SelectMove {
    constructor({ viewEl, wrapperEl, topBoundary, behavior = "y", }) {
        super({
            moveViewHeight: behavior === "x" ? viewEl.offsetWidth : viewEl.offsetHeight,
            moveWrapperHeight: behavior === "x" ? wrapperEl.clientWidth : wrapperEl.clientHeight,
            topBoundary: topBoundary,
        });
        this.scrollParent = null;
        this.moveChange = new Subject();
        this.animateRunning = false;
        this.behavior = behavior;
        this.wrapperEl = wrapperEl;
        this.viewEl = viewEl;
        const begin = (event) => {
            event.stopPropagation();
            if (this.animateRunning) {
                this.breakSpeed();
                this.animateRunning = false;
            }
            if (this.scrollParent)
                this.scrollParent.style.overflowY = "hidden";
        };
        const end = (momentSpeed) => {
            if (this.currentS > this.topBoundary) {
                this.topToBack();
            }
            else if (this.currentS < this.bottomBoundary) {
                this.bottomToBack();
            }
            else if (momentSpeed) {
                this.touchEndMomentSpeed(momentSpeed);
            }
            else {
                this.touchEndStatic();
            }
            if (this.scrollParent)
                this.scrollParent.style.overflowY = "auto";
        };
        if (behavior === "x") {
            horizontalTouch({
                element: this.wrapperEl,
                moment: true,
                begin: ({ event }) => begin(event),
                move: ({ perX }) => this.touchMove(perX),
                end: ({ momentSpeed }) => end(momentSpeed),
            });
            this.moveEffects = (y) => {
                this.viewEl.style.transform = `translate3d(${y}px,0,0)`;
            };
        }
        else {
            verticalTouch({
                element: this.wrapperEl,
                moment: true,
                begin: ({ event }) => begin(event),
                move: ({ perY }) => this.touchMove(perY),
                end: ({ momentSpeed }) => end(momentSpeed),
            });
            this.moveEffects = (y) => {
                this.viewEl.style.transform = `translate3d(0,${y}px,0)`;
            };
        }
    }
    set preventParentScroll(v) {
        if (this.wrapperEl && v && !this.scrollParent)
            this.scrollParent = getScrollParent(this.wrapperEl);
        if (!v)
            this.scrollParent = null;
    }
    /*
     * @Override
     */
    move(move) {
        move = Math.round(move * 100) / 100;
        this.moveEffects && this.moveEffects(move);
        this.moveChange.next((this.realMoveDistance = move));
    }
    touchEndMomentSpeed(momentSpeed) {
        this.startSpeed(momentSpeed * 0.15);
    }
    touchEndStatic() { }
    /**
     * 重新计算所有高度
     */
    reCalAllHeight() {
        if (this.behavior === "x") {
            this.moveViewHeight = this.viewEl.offsetWidth;
            this.moveWrapperHeight = this.wrapperEl.clientWidth;
        }
        else {
            this.moveViewHeight = this.viewEl.offsetHeight;
            this.moveWrapperHeight = this.wrapperEl.clientHeight;
        }
        console.log("relCal", this.moveViewHeight);
        this.calBottomBoundary();
    }
    startSpeed(momentSpeed) {
        this.animateRunning = true;
        this.startBySpeed(momentSpeed, () => {
            this.animateRunning = false;
        });
    }
    topToBack(cb) {
        this.cleanTmp();
        this.animateRunning = true;
        this.runBySpeed(0, this.currentS, -1, () => {
            this.animateRunning = false;
            this.backEnd("top");
        });
    }
    bottomToBack() {
        this.cleanTmp();
        this.animateRunning = true;
        this.runBySpeed(0, this.currentS, 1, () => {
            this.animateRunning = false;
            this.backEnd("bottom");
        });
    }
    backEnd(pos) { }
}
