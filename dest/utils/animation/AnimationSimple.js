import { __awaiter } from "tslib";
import { Animation } from "./Animation";
export class AnimationSimple extends Animation {
    constructor(el, className, cbOpts, bindTransitionEl) {
        super(el, {
            enter: className + "-enter",
            enterActive: className + "-enter-active",
            enterTo: className + "-enter-to",
            leave: className + "-leave",
            leaveActive: className + "-leave-active",
            leaveTo: className + "-leave-to",
            bindTransitionEl: bindTransitionEl,
        }, cbOpts);
    }
}
export class AnimationDisplay extends AnimationSimple {
    constructor(el, className, display = "block", bindTransitionEl) {
        super(el, className, {
            enterStartCb: () => {
                el.style.display = display;
                this.enterCb && this.enterCb();
            },
            leaveEndCb: () => {
                el.style.display = "none";
                this.leaveCb && this.leaveCb();
            },
        }, bindTransitionEl);
    }
    close(force, cb) {
        const _super = Object.create(null, {
            close: { get: () => super.close }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (cb)
                this.leaveCb = cb;
            yield _super.close.call(this, force);
        });
    }
    open(delay, cb) {
        if (cb)
            this.enterCb = cb;
        super.open(delay);
    }
}
export class AnimationIf extends AnimationSimple {
    constructor(el, className, parentEl, bindTransitionEl) {
        super(el, className, {
            enterStartCb: () => {
                parentEl.appendChild(el);
            },
            leaveEndCb() {
                el.parentElement && el.parentElement.removeChild(el);
            },
        }, bindTransitionEl);
        this.parentEl = parentEl;
    }
    open() {
        super.open(40);
    }
}
