import { isMobile } from "@ztwx/utils";
const momentSpeedActive = 3;
const momentInterval = 100;
export const touch = (opts) => {
    let touchstart, touchmove, touchend, startMove;
    const clear = () => {
        startMove = false;
    };
    let beginX, beginY, movePos, moveX, moveY, preMoveX, preMoveY, perX, perY;
    touchstart = (pos, event) => {
        clear();
        beginX = pos.pageX;
        beginY = pos.pageY;
        opts.begin && opts.begin({ beginX, beginY, event });
    };
    touchmove = (movePos, event) => {
        moveX = movePos.pageX;
        moveY = movePos.pageY;
        if (startMove) {
            opts.move &&
                opts.move({
                    moveX,
                    moveY,
                    disX: moveX - beginX,
                    disY: moveY - beginY,
                    perX: moveX - preMoveX,
                    perY: moveY - preMoveY,
                    event,
                });
        }
        preMoveX = moveX;
        preMoveY = moveY;
        startMove = true;
    };
    touchend = (event) => opts.end &&
        opts.end({
            event,
            disX: moveX - beginX,
            disY: moveY - beginY,
        });
    if (isMobile) {
        opts.element.addEventListener("touchstart", (e) => touchstart(e.touches[0], e), Object.assign({ passive: true }, (opts.eventOpts || {})));
        opts.element.addEventListener("touchmove", (e) => touchmove(e.touches[0], e), Object.assign({ passive: true }, (opts.eventOpts || {})));
        opts.end &&
            opts.element.addEventListener("touchend", touchend, Object.assign({ passive: true }, (opts.eventOpts || {})));
    }
    else {
        let moveListening, upListening;
        const mousemove = (e) => {
            touchmove(e, e);
        };
        const mouseUpHandler = (e) => {
            document.documentElement.removeEventListener("mousemove", mousemove);
            document.documentElement.removeEventListener("mouseup", mouseUpHandler);
            moveListening = upListening = false;
            touchend && touchend(e);
        };
        opts.element.addEventListener("mousedown", (e) => {
            touchstart(e, e);
            !moveListening &&
                document.documentElement.addEventListener("mousemove", mousemove, Object.assign({ passive: true }, (opts.eventOpts || {})));
            !upListening &&
                document.documentElement.addEventListener("mouseup", mouseUpHandler, Object.assign({ passive: true }, (opts.eventOpts || {})));
            moveListening = upListening = true;
        }, Object.assign({ passive: true }, (opts.eventOpts || {})));
    }
};
export class Moment {
    constructor(horizontal) {
        this.momentSpeed = 0;
        this.moveNum = 0;
        this.resetSpeed = () => (this.momentSpeed = 0);
        this.momentBegin = ({ beginX, beginY }) => {
            this.interval && this.clear();
            this.resetSpeed();
            this.moveNum = this.previousNum = this.previousTmpNum = this.horizontal
                ? beginX
                : beginY;
            this.interval = setInterval(() => {
                this.previousNum = this.previousTmpNum;
                this.previousTmpNum = this.moveNum;
            }, momentInterval);
        };
        this.horizontal = !!horizontal;
        this.momentMove = ({ moveX, moveY }) => {
            if (horizontal) {
                this.moveNum = moveX;
            }
            else {
                this.moveNum = moveY;
            }
        };
    }
    clear() {
        if (this.interval)
            clearInterval(this.interval);
        this.interval = null;
    }
    momentEnd(activeCb) {
        this.interval && this.clear();
        this.momentSpeed = this.moveNum - this.previousNum;
        activeCb(Math.abs(this.momentSpeed) >= momentSpeedActive, this.momentSpeed);
    }
}
export const forwardTouch = ({ element, begin, move, end, moment }, horizontal) => {
    let moveFn, beginFn, endFn, momentMethod, pristine = true;
    if (moment)
        momentMethod = new Moment(horizontal);
    let clear = () => {
        pristine = true;
        moment && momentMethod.clear();
    };
    beginFn = (e) => {
        clear();
        begin && begin(e);
        moment && momentMethod.momentBegin(e);
    };
    moveFn = (e) => {
        if (pristine === undefined)
            return momentMethod && momentMethod.resetSpeed();
        if (pristine) {
            const perX = Math.abs(e.perX), perY = Math.abs(e.perY);
            if ((horizontal && perX > perY) || (!horizontal && perX <= perY)) {
                move && move(e);
                moment && momentMethod.momentMove(e);
                pristine = false;
            }
            else {
                pristine = undefined;
            }
        }
        else {
            move && move(e);
            moment && momentMethod.momentMove(e);
        }
    };
    endFn = e => {
        clear();
        moment
            ? momentMethod.momentEnd((momentActive, momentSpeed) => end && end(Object.assign(Object.assign({}, e), { momentActive, momentSpeed })))
            : end && end(e);
    };
    touch({
        element,
        begin: beginFn,
        move: moveFn,
        end: endFn,
    });
};
export const horizontalTouch = (opts) => forwardTouch(opts, true);
export const verticalTouch = (opts) => forwardTouch(opts, false);
