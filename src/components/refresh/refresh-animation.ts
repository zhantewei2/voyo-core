import { bezierCube } from "../../utils";
import { Subject } from "rxjs";

export interface PercentOpts {
  percent: number;
  triggerPercent: number;
  distance: number;
  triggerDistancePercent: number;
}

export class RefreshAnimation {
  el: HTMLElement;
  s: (t: number) => number;
  coef = 2;
  minDistance = 0;
  maxDistance: number;
  triggerDistance: number;
  triggerPercent: number;
  triggerBreak = false;
  triggerWillEvent: Subject<boolean> = new Subject<boolean>();
  percentEvent: Subject<PercentOpts> = new Subject<PercentOpts>();
  canTrigger: boolean;
  maxCount = 50;
  moveDis = 0; // real move distance;
  movePercent = 0;
  movePercentStore = 0;
  _movePercent: number | null;
  isBacking = false;
  pauseImmediate = false;
  breakTriggering = false;
  breakTriggeringRun = false;
  triggerWill0: boolean;
  set triggerWill(v: boolean) {
    if (v === this.triggerWill0) return;
    this.triggerWillEvent.next(v);
    this.triggerWill0 = v;
  }

  get isDefault() {
    return this.movePercent === 0;
  }
  constructor(el: HTMLElement, maxDistance = 150, triggerDistance = 0) {
    this.maxDistance = maxDistance;
    this.triggerDistance = triggerDistance;
    this.triggerPercent = triggerDistance / this.maxDistance;
    this.el = el;
    this.s = bezierCube(
      0,
      this.maxDistance * 0.75,
      this.maxDistance,
      this.maxDistance,
    );
  }
  getMovePercent(x: number) {
    this.movePercent = x / this.maxDistance / this.coef + this.movePercentStore;
    if (this.movePercent <= 0) this.movePercent = 0;
    if (this.movePercent >= 1) this.movePercent = 1;
    return this.movePercent;
  }
  touchMove() {
    this.transformMove(this.movePercent, false);
  }

  /**
   *
   * @param movePercent
   * @param fromBack
   * @return isTriggerBreak;
   */
  transformMove(movePercent: number, fromBack = false): boolean | undefined {
    if (movePercent === this._movePercent) return;
    this._movePercent = movePercent;
    // this.moveDis=movePercent*this.maxDistance;
    this.moveDis = this.s(movePercent);
    let isTrigger: boolean | undefined;
    if (fromBack && this.triggerDistance) {
      if (this.moveDis < this.triggerDistance) {
        this.breakTriggeringRun = false;
      }
      if (this.whenTriggerBreak(this.moveDis)) {
        isTrigger = true;
        this.moveDis = this.triggerDistance;
        this.breakTriggering = true;
      }
    } else {
      if (this.triggerDistance)
        this.triggerWill = this.canTrigger =
          this.moveDis > this.triggerDistance;
    }
    const triggerDistancePercent = this.moveDis / this.triggerDistance;
    this.percentEvent.next({
      percent: movePercent,
      triggerPercent: this.triggerPercent,
      distance: this.moveDis,
      triggerDistancePercent:
        triggerDistancePercent > 1 ? 1 : triggerDistancePercent,
    });
    this.el.style.transform = `translate3d(0,${this.moveDis}px,0)`;
    return isTrigger;
  }
  pause() {
    this.pauseImmediate = true;
    this.movePercentStore = this.movePercent;
  }
  back(end: () => void, pause?: () => void) {
    if (this.breakTriggering) return;
    if (this.movePercent <= 0) return end();
    let count = Math.ceil(this.movePercent * this.maxCount);
    this.canTrigger = this.triggerWill = this.pauseImmediate = false;
    this.run(count, () => end(), pause);
  }
  end() {
    this.triggerWill = this.canTrigger = this.isBacking = this.pauseImmediate = false;
    this.preDistance = this.movePercent = this.movePercentStore = 0;
    this._movePercent = null;
  }
  run(count: number, end: () => void, pause?: () => void) {
    this.isBacking = true;
    const run = () => {
      if (this.pauseImmediate) return pause && pause();
      if (--count < 0) {
        this.end();
        return end();
      }
      this.movePercent = count / this.maxCount;

      if (!this.transformMove(this.movePercent, true))
        requestAnimationFrame(run);
    };
    run();
  }
  preDistance = 0;
  whenTriggerBreak(distance: number): boolean {
    if (!this.triggerDistance) return false;
    if (
      this.triggerBreak &&
      (distance === this.triggerDistance ||
        (distance < this.triggerDistance &&
          this.preDistance > this.triggerDistance))
    ) {
      this.preDistance = distance;
      return true;
    } else {
      this.preDistance = distance;
      return false;
    }
  }
  setTriggerBreak() {
    this.triggerBreak = true;
    this.breakTriggeringRun = true;
  }
  clearTriggerBreak(end: () => void) {
    this.triggerBreak = false;
    if (this.breakTriggering) {
      this.breakTriggering = false;
      this.back(end);
    }
  }
}
