import { Subject } from "rxjs";
import { horizontalTouch, verticalTouch } from "../../utils/hammer";
import { SelectMove } from "./select-move";
import { getScrollParent } from "../../utils/scroll";

export interface SelectMoveElOpts {
  wrapperEl: HTMLElement;
  viewEl: HTMLElement;
  topBoundary: number;
  behavior?: "x" | "y";
}
export class SelectMoveEl extends SelectMove {
  viewEl: HTMLElement;
  wrapperEl: HTMLElement;
  scrollParent: HTMLElement | null = null;
  behavior: "x" | "y";
  realMoveDistance: number; //真实移动距离
  moveChange: Subject<number> = new Subject<number>();

  set preventParentScroll(v: boolean) {
    if (this.wrapperEl && v && !this.scrollParent)
      this.scrollParent = getScrollParent(this.wrapperEl);
    if (!v) this.scrollParent = null;
  }

  /*
   * @Override
   */
  public move(move: number) {
    move = Math.round(move * 100) / 100;
    this.moveEffects && this.moveEffects(move);
    this.moveChange.next((this.realMoveDistance = move));
  }
  public moveEffects: (move: number) => void;
  public animateRunning = false;
  public touchEndMomentSpeed(momentSpeed: number) {
    this.startSpeed(momentSpeed * 0.15);
  }
  public touchEndStatic() {}

  /**
   * 重新计算所有高度
   */
  public reCalAllHeight() {
    if (this.behavior === "x") {
      this.moveViewHeight = this.viewEl.offsetWidth;
      this.moveWrapperHeight = this.wrapperEl.clientWidth;
    } else {
      this.moveViewHeight = this.viewEl.offsetHeight;
      this.moveWrapperHeight = this.wrapperEl.clientHeight;
    }
    console.log("relCal", this.moveViewHeight);
    this.calBottomBoundary();
  }
  constructor({
    viewEl,
    wrapperEl,
    topBoundary,
    behavior = "y",
  }: SelectMoveElOpts) {
    super({
      moveViewHeight:
        behavior === "x" ? viewEl.offsetWidth : viewEl.offsetHeight,
      moveWrapperHeight:
        behavior === "x" ? wrapperEl.clientWidth : wrapperEl.clientHeight,
      topBoundary: topBoundary,
    });
    this.behavior = behavior;
    this.wrapperEl = wrapperEl;
    this.viewEl = viewEl;
    const begin = (event: any) => {
      event.stopPropagation();
      if (this.animateRunning) {
        this.breakSpeed();
        this.animateRunning = false;
      }
      if (this.scrollParent) this.scrollParent.style.overflowY = "hidden";
    };
    const end = (momentSpeed: number | undefined) => {
      if (this.currentS > this.topBoundary) {
        this.topToBack();
      } else if (this.currentS < this.bottomBoundary) {
        this.bottomToBack();
      } else if (momentSpeed) {
        this.touchEndMomentSpeed(momentSpeed);
      } else {
        this.touchEndStatic();
      }
      if (this.scrollParent) this.scrollParent.style.overflowY = "auto";
    };
    if (behavior === "x") {
      horizontalTouch({
        element: this.wrapperEl,
        moment: true,
        begin: ({ event }) => begin(event),
        move: ({ perX }) => this.touchMove(perX),
        end: ({ momentSpeed }) => end(momentSpeed),
      });

      this.moveEffects = (y: number) => {
        this.viewEl.style.transform = `translate3d(${y}px,0,0)`;
      };
    } else {
      verticalTouch({
        element: this.wrapperEl,
        moment: true,
        begin: ({ event }) => begin(event),
        move: ({ perY }) => this.touchMove(perY),
        end: ({ momentSpeed }) => end(momentSpeed),
      });
      this.moveEffects = (y: number) => {
        this.viewEl.style.transform = `translate3d(0,${y}px,0)`;
      };
    }
  }
  startSpeed(momentSpeed: number) {
    this.animateRunning = true;
    this.startBySpeed(momentSpeed, () => {
      this.animateRunning = false;
    });
  }
  topToBack(cb?: () => void) {
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

  backEnd(pos: "top" | "bottom") {}
}
