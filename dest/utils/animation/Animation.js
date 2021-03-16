import { __awaiter } from "tslib";
export const delayDefault = 40;
export class Animation {
    constructor(el, opts, cbs) {
        this.isEnter = false;
        this.isEnterWait = false;
        this.isLeave = false;
        this.hasEnter = false;
        this.waitTransition = true;
        this.el = el;
        this.opts = opts;
        this.cbs = cbs;
        const transitionEl = opts.bindTransitionEl || this.el;
        transitionEl.addEventListener("transitionend", (e) => {
            if (e.target !== transitionEl)
                return;
            if (this.isEnter) {
                this.hasEnter = true;
                this.enterEnd();
            }
            else if (this.isLeave) {
                this.hasEnter = false;
                this.leaveEnd();
            }
            this.isEnter = this.isLeave = false;
        });
    }
    reset0() {
        this.isEnterWait = this.isLeave = this.isEnter = false;
    }
    reset(leave) {
        this.reset0();
        this.hasEnter = leave;
    }
    enter() {
        this.el.classList.add(this.opts.enter || "", this.opts.enterActive);
        this.cbs.enterStartCb && this.cbs.enterStartCb();
    }
    enterClearAllClass() {
        this.opts.enterTo
            ? this.el.classList.remove(this.opts.enterTo, this.opts.enterActive)
            : this.el.classList.remove(this.opts.enterActive);
    }
    enterStart() {
        this.reset0();
        this.enterClearAllClass();
        this.leaveClearAllClass();
    }
    enterNext() {
        if (this.opts.enterTo)
            this.el.classList.add(this.opts.enterTo);
        this.opts.enter && this.el.classList.remove(this.opts.enter);
    }
    enterEnd() {
        this.enterClearAllClass();
        this.cbs.enterEndCb && this.cbs.enterEndCb();
        this.openEndCb && this.openEndCb();
    }
    leave() {
        this.el.classList.add(this.opts.leave || "", this.opts.leaveActive);
    }
    leaveClearAllClass() {
        this.opts.leaveTo
            ? this.el.classList.remove(this.opts.leaveTo, this.opts.leaveActive)
            : this.el.classList.remove(this.opts.leaveActive);
    }
    leaveStart() {
        this.reset0();
        this.enterClearAllClass();
        this.leaveClearAllClass();
    }
    leaveNext() {
        this.opts.leave && this.el.classList.remove(this.opts.leave);
        if (this.opts.leaveTo)
            this.el.classList.add(this.opts.leaveTo);
    }
    leaveEnd() {
        this.leaveClearAllClass();
        this.cbs.leaveEndCb && this.cbs.leaveEndCb();
        this.closeEndCb && this.closeEndCb();
    }
    open(delay = delayDefault) {
        if (this.isEnter || (this.waitTransition && this.isEnter))
            return;
        if (this.isLeave)
            this.cancelLeave();
        if (!this.isLeave && this.hasEnter)
            return;
        this.enterStart();
        this.enter();
        this.isEnterWait = this.isEnter = true;
        setTimeout(() => {
            this.isEnterWait = false;
            this.enterNext();
        }, delay);
    }
    cancelEnter() {
        this.reset(true);
        this.enterEnd();
    }
    cancelLeave() {
        this.reset(false);
        this.clearCloseTimeout();
        this.leaveEnd();
    }
    close(force) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLeave ||
                (!force && this.waitTransition && this.isLeave))
                return;
            if (!this.isEnter && !this.hasEnter)
                return;
            this.clearCloseTimeout();
            let delay = 1;
            if (this.isEnter) {
                delay = delayDefault;
                const isEnterWait = this.isEnterWait;
                this.cancelEnter();
                if (isEnterWait)
                    yield new Promise((resolve, reject) => (this.closeWaitTimeout = setTimeout(() => {
                        clearTimeout(this.closeWaitTimeout);
                        this.closeWaitTimeout = null;
                        resolve(true);
                    }, delayDefault)));
            }
            this.leaveStart();
            this.leave();
            this.isLeave = true;
            this.closeNextTimeout = setTimeout(() => {
                this.leaveNext();
                this.closeNextTimeout = null;
            }, delay);
        });
    }
    clearCloseTimeout() {
        if (this.closeWaitTimeout)
            clearTimeout(this.closeWaitTimeout);
        this.closeWaitTimeout = null;
        if (this.closeNextTimeout)
            clearTimeout(this.closeNextTimeout);
        this.closeNextTimeout = null;
    }
}
