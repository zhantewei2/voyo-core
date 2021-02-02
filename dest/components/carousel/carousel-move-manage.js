import { horizontalTouch } from "../../utils/hammer";
export class CarouselMoveManage {
    constructor(target, totalTransitionTime = 0.4) {
        this.bluntnessDistance = 10;
        this.containerInterceptWidth = 100;
        this.launchFromBegin = false;
        this.interceptMoveRun = false;
        this.target = target;
        this.totalTransitionTime = totalTransitionTime;
    }
    setTransitionTime(v) {
        this.totalTransitionTime = v;
    }
    initializeData() {
        if (!this.initialized) {
            this.containerWidth = this.target.offsetWidth;
            this.containerHalfWidth = this.containerWidth / 2;
            this.containerInterceptWidth =
                this.containerInterceptWidth > this.containerHalfWidth
                    ? this.containerHalfWidth
                    : this.containerInterceptWidth;
        }
    }
    animateMoveEnd(newCurrentItem) {
        this.target.moveRunning = false;
        if (this.activeCurrent && this.activeCurrent !== newCurrentItem)
            this.activeCurrent.hid();
        if (this.activePreItem && this.activePreItem !== newCurrentItem)
            this.activePreItem.hid();
        if (this.activeNextItem && this.activeNextItem !== newCurrentItem)
            this.activeNextItem.hid();
        this.resetState();
        this.target.carouselListManage.setActiveIndex(newCurrentItem.index);
    }
    getTimerByDistance(distance) {
        // return '.1s';
        let time = (distance / this.containerWidth) * 2 * this.totalTransitionTime;
        time = time < 0.1 ? 0.1 : time;
        time = time > this.totalTransitionTime ? this.totalTransitionTime : time;
        time = Math.round(time * 100) / 100;
        return time * 1000;
    }
    animateMove(forward, remainDis, waitTransition = false) {
        const timer = this.getTimerByDistance(remainDis);
        const activeCurrent = this
            .activeCurrent;
        this.target.moveRunning = true;
        if (forward === "advance") {
            activeCurrent.animateTo(timer, "right", () => {
                this.animateMoveEnd(this.activePreItem);
            });
            this.activePreItem.animateTo(timer, "mid", () => { });
        }
        else if (forward === "back") {
            activeCurrent.animateTo(timer, "left", () => {
                this.animateMoveEnd(this.activeNextItem);
            });
            this.activeNextItem.animateTo(timer, "mid", () => { });
        }
        else if (forward == "advanceCancel") {
            activeCurrent.clearTransformStyleAn(timer, () => {
                this.animateMoveEnd(activeCurrent);
            });
            this.activePreItem &&
                this.activePreItem.clearTransformStyleAn(timer, () => { });
        }
        else if (forward == "backCancel") {
            activeCurrent.clearTransformStyleAn(timer, () => {
                this.animateMoveEnd(activeCurrent);
            });
            this.activeNextItem &&
                this.activeNextItem.clearTransformStyleAn(timer, () => { });
        }
    }
    move() {
        this.cancelInterceptMove();
        this.moveDisX(this.moveX);
    }
    moveDisX(x) {
        if (this.activeCurrent) {
            this.activeCurrent.transformMove(x);
        }
        if (this.activeNextItem) {
            this.activeNextItem.transformMove(x);
        }
        if (this.activePreItem) {
            this.activePreItem.transformMove(x);
        }
        const percent = x / this.containerWidth;
        this.target.touchChange.next({
            v: percent,
            relativeV: percent,
            type: "touchMove",
        });
    }
    interceptMove() {
        this.interceptMoveRun = true;
        let x = this.moveX;
        if (x > this.containerInterceptWidth)
            x = this.containerInterceptWidth;
        if (x < 0 - this.containerInterceptWidth)
            x = 0 - this.containerInterceptWidth;
        this.moveDisX(x);
    }
    cancelInterceptMove() {
        this.interceptMoveRun = false;
    }
    resetState() {
        this.moveX = 0;
        this.moveActivity = this.interceptMoveRun = false;
        this.activeCurrent = this.activePreItem = this
            .activeNextItem = undefined;
    }
    watchTouch() {
        horizontalTouch({
            element: this.target,
            moment: true,
            begin: () => {
                if (this.disableTouch)
                    return;
                this.target.touchRunning = true;
                if (this.target.moveRunning)
                    return;
                this.launchFromBegin = true;
                this.initializeData();
                this.activeCurrent = this.target.carouselListManage.getCurrent();
                this.activeCurrent.atMid();
            },
            move: ({ disX }) => {
                if (this.disableTouch)
                    return;
                if (this.target.moveRunning || !this.launchFromBegin)
                    return;
                this.moveX = disX;
                if (!this.moveActivity && Math.abs(disX) <= this.bluntnessDistance) {
                    this.moveX = 0;
                    return;
                }
                this.moveActivity = true;
                this.moveX = disX - this.bluntnessDistance;
                /**
                 * ban cross  border
                 */
                // if(this.moveX>this.containerWidth)this.moveX=this.containerWidth;
                // if(this.moveX<0-this.containerWidth)this.moveX=0-this.containerWidth;
                if (this.moveX > this.containerWidth ||
                    this.moveX < 0 - this.containerWidth) {
                    return;
                }
                if (this.moveX > 0 && !this.activePreItem) {
                    const preItem = this.target.carouselListManage.getPre();
                    if (!preItem)
                        return this.interceptMove();
                    this.activePreItem = preItem;
                    this.activePreItem.atLeft();
                }
                else if (this.moveX < 0 && !this.activeNextItem) {
                    const nextItem = this.target.carouselListManage.getNext();
                    if (!nextItem)
                        return this.interceptMove();
                    this.activeNextItem = nextItem;
                    this.activeNextItem.atRight();
                }
                this.move();
            },
            end: ({ momentSpeed, momentActive }) => {
                if (this.disableTouch)
                    return;
                this.target.touchRunning = false;
                if (this.target.moveRunning || !this.launchFromBegin)
                    return;
                this.launchFromBegin = false;
                if (!this.moveActivity)
                    return;
                if (this.moveX > this.containerHalfWidth && !this.interceptMoveRun) {
                    //advance
                    if (this.moveX != this.containerWidth) {
                        this.animateMove("advance", this.containerWidth - this.moveX);
                    }
                    else {
                        this.animateMoveEnd(this.activePreItem);
                    }
                }
                else if (this.moveX < 0 - this.containerHalfWidth &&
                    !this.interceptMoveRun) {
                    //back
                    if (this.moveX != 0 - this.containerWidth) {
                        this.animateMove("back", this.containerWidth + this.moveX);
                    }
                    else {
                        this.animateMoveEnd(this.activePreItem);
                    }
                }
                else if (momentActive &&
                    momentSpeed !== undefined &&
                    this.moveX != 0 &&
                    !this.interceptMoveRun) {
                    if (this.moveX > 0) {
                        /**
                         * moment maybe not trigger
                         */
                        // if(!this.activePreItem){
                        //   this.activePreItem=this.target.carouselListManage.getPre();
                        //   this.activePreItem.atLeft();
                        // }
                        this.animateMove("advance", this.containerWidth - this.moveX);
                    }
                    else {
                        // if(!this.activeNextItem){
                        //   this.activeNextItem=this.target.carouselListManage.getNext();
                        //   this.activeNextItem.atRight();
                        // }
                        this.animateMove("back", this.containerWidth + this.moveX);
                    }
                }
                else if (this.moveX > 0) {
                    this.animateMove("advanceCancel", this.moveX);
                }
                else if (this.moveX < 0) {
                    this.animateMove("backCancel", 0 - this.moveX);
                }
                else {
                    this.animateMoveEnd(this.activeCurrent);
                }
            },
        });
    }
}
