import { Animation, AnimationOptions, CbOptions } from "./Animation";
export class AnimationSimple extends Animation {
  constructor(
    el: HTMLElement,
    className: string,
    cbOpts: CbOptions,
    bindTransitionEl?: HTMLElement,
  ) {
    super(
      el,
      {
        enter: className + "-enter",
        enterActive: className + "-enter-active",
        enterTo: className + "-enter-to",
        leave: className + "-leave",
        leaveActive: className + "-leave-active",
        leaveTo: className + "-leave-to",
        bindTransitionEl: bindTransitionEl,
      },
      cbOpts,
    );
  }
}

export class AnimationDisplay extends AnimationSimple {
  leaveCb: () => void;
  enterCb: () => void;
  constructor(
    el: HTMLElement,
    className: string,
    display = "block",
    bindTransitionEl?: HTMLElement,
  ) {
    super(
      el,
      className,
      {
        enterStartCb: () => {
          el.style.display = display;
          this.enterCb && this.enterCb();
        },
        leaveEndCb: () => {
          el.style.display = "none";
          this.leaveCb && this.leaveCb();
        },
      },
      bindTransitionEl,
    );
  }
  async close(force?: boolean, cb?: () => void) {
    if (cb) this.leaveCb = cb;
    await super.close(force);
  }
  open(delay?: number, cb?: () => void) {
    if (cb) this.enterCb = cb;
    super.open(delay);
  }
}
export class AnimationIf extends AnimationSimple {
  parentEl: HTMLElement;
  constructor(
    el: HTMLElement,
    className: string,
    parentEl: HTMLElement,
    bindTransitionEl?: HTMLElement,
  ) {
    super(
      el,
      className,
      {
        enterStartCb: () => {
          parentEl.appendChild(el);
        },
        leaveEndCb() {
          el.parentElement && el.parentElement.removeChild(el);
        },
      },
      bindTransitionEl,
    );
    this.parentEl = parentEl;
  }
  open() {
    super.open(40);
  }
  // open(){
  //     this.parentEl.appendChild(this.el);
  //     super.open();
  // }
}
