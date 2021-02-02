import { TabBarItemRef } from "../tab.interface";
import anime from "animejs/lib/anime.es.js";
import { MoveChangeParams } from "../../carousel/carousel.interface";
import { Subject } from "rxjs";
import { bezierTwice } from "../../../utils";

export type UpdateFn = (p: UpdateFnParams) => void;

export interface UpdateFnParams {
  progress: number; // percent of distance
  distance: number; // move vector.
  currentPos: number; // thumb current position
}
export class ThumbMoveAn {
  el: HTMLElement;
  anInstance: any | undefined;
  duration: number;
  ease = "linear";
  updateFn: UpdateFn;
  isRunning: boolean;
  constructor(el: HTMLElement, duration: number, update: UpdateFn) {
    this.el = el;
    this.duration = duration * 1000;
    this.updateFn = update;
  }
  moveTo(fromX: number, toX: number, end?: () => void) {
    if (fromX == toX) return;
    this.isRunning = true;
    let distance = toX - fromX;
    this.anInstance = anime({
      targets: this.el,
      translateX: [fromX + "px", toX + "px"],
      duration: this.duration,
      easing: this.ease,
      update: (an: any) =>
        this.updateFn({
          progress: an.progress / 100,
          distance,
          currentPos: Math.round(fromX + (distance * an.progress) / 100),
        }),
      complete: () => {
        this.isRunning = false;
        this.anInstance = undefined;
        end && end();
      },
    });
  }
  pause() {
    if (!this.anInstance) return;
    this.isRunning = false;
    this.anInstance.pause();
  }
  resume() {
    if (!this.anInstance) return;
    this.isRunning = true;
    this.anInstance.play();
  }
}

export class ThumbMove {
  constructor(
    thumbEl: HTMLElement,
    tabBarItemRefList: TabBarItemRef[],
    moveDuration: number,
    parent: any,
  ) {
    this.parent = parent;
    this.tabBarItemRefList = tabBarItemRefList;
    this.thumbWidth = thumbEl.offsetWidth;
    this.thumbEl = thumbEl;
    this.thumbChangeEl = this.thumbEl.querySelector(
      ".voyo-tab-bar-thumb-change",
    ) as HTMLElement;
    this.moveDuration = moveDuration;
    this.setBarItemLeftDistanceList();
    this.moveAn = new ThumbMoveAn(this.thumbEl, this.moveDuration, params =>
      this.moveProgressSubject.next(params),
    );

    //thumb width change
    let moveProgress;
    const thumbWidthBezier: any = bezierTwice(0, 1.5, 0);
    this.moveProgressSubject.subscribe(v => {
      this.currentPosition = v.currentPos;
      moveProgress = Math.abs(v.progress);
      const w: any = Math.round(thumbWidthBezier(moveProgress) * 100) / 100;
      this.thumbChangeEl.style.transform = `scaleX(${w + 1})`;
    });
  }
  setBarItemLeftDistanceList() {
    const widthList = this.tabBarItemRefList.map(i => i.width);
    const thumbWidth = this.thumbWidth;
    widthList.forEach((width, index) => {
      this.barItemLeftDistanceList.push(
        (index == 0 ? 0 : widthList.slice(0, index).reduce((p, n) => p + n)) +
          (width - thumbWidth) / 2,
      );
    });
  }
  parent: any;
  barItemLeftDistanceList: number[] = [];

  /**
   * bound distance can movable.
   */
  leftMoveSpace: number;
  rightMoveSpace: number;

  moveProgressSubject: Subject<UpdateFnParams> = new Subject<UpdateFnParams>();
  moveAn: ThumbMoveAn;
  moveDuration = 300;
  thumbIndex: number;
  thumbEl: HTMLElement;
  thumbChangeEl: HTMLElement;
  thumbWidth: number;
  tabBarItemRefList: TabBarItemRef[];
  /**
   * thumb moved distance
   */
  currentPosition: number;
  indexPosition: number;
  getThumbPosByIndex(i: number): number {
    return this.barItemLeftDistanceList[i];
  }
  defineThumbPos(left: number) {
    if (left === this.currentPosition) return;
    this.currentPosition = left;
    this.thumbEl.style.transform = `translateX(${left}px)`;
  }
  animateRunning = false;

  animateToIndex(index: number, cb?: () => void) {
    const targetPosition = this.getThumbPosByIndex(index);
    if (this.currentPosition === targetPosition) return this.setIndex(index);
    /**
     * tab bar not combine with tabs
     */

    if (!this.parent.combine) {
      this.moveAn.moveTo(this.currentPosition, targetPosition, () => {
        this.setIndex(index);
        cb && cb();
      });
    } else {
      if (this.animateRunning) return;
      this.animateRunning = true;
      this.moveAn.moveTo(this.currentPosition, targetPosition);
      this.parent.willChange.next({
        value: index,
        cb: () => {
          this.animateRunning = false;
          this.setIndex(index);
          cb && cb();
        },
      });
    }
  }
  calBoundSpaceCanMove() {
    const i = this.thumbIndex,
      max = this.barItemLeftDistanceList.length - 1;
    this.leftMoveSpace =
      i == 0
        ? this.getThumbPosByIndex(0)
        : this.getThumbPosByIndex(i) - this.getThumbPosByIndex(i - 1);
    this.rightMoveSpace =
      i == max
        ? (this.tabBarItemRefList[i].width - this.thumbWidth) / 2
        : this.getThumbPosByIndex(i + 1) - this.getThumbPosByIndex(i);
  }

  /**
   *
   * @param percent tabsMove percent
   */
  pointerMove({ relativeV: percent, type }: MoveChangeParams) {
    if (type === "toIndex") return;
    if (this.moveAn.isRunning) this.moveAn.pause();
    let distance = 0;
    let endPosition;
    if (percent > 0 && percent <= 1) {
      // back.. to left
      distance = 0 - this.leftMoveSpace * percent;
    } else if (percent < 0 && percent >= -1) {
      // forward .. to right
      distance = this.rightMoveSpace * Math.abs(percent);
    }
    if (distance != 0) {
      endPosition = this.indexPosition + distance;
      this.defineThumbPos(endPosition);
      this.moveProgressSubject.next({
        progress: percent,
        currentPos: endPosition,
        distance: 0,
      });
    }
  }
  setIndex(index: number) {
    this.thumbIndex = index;
    this.defineThumbPos(this.getThumbPosByIndex(index));
    this.indexPosition = this.currentPosition;
    this.calBoundSpaceCanMove();
  }
  toIndex(index: number, cb: () => void) {
    if (this.thumbIndex === undefined) {
      this.setIndex(index);
      cb();
    } else {
      this.animateToIndex(index, cb);
    }
  }
}
