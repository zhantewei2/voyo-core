import { forwardTouch, Animate } from "../../utils/index";
import { EvenModel } from "./even-model";
import { EvenModelRun } from "../../utils/animateKeyframe";
import { Subject } from "rxjs";
import anime from "animejs/lib/anime.es.js";

export interface MovableOpts {
  spaceLeft?: number;
  moveSpaceLeft?: number;
  moveSpaceRight?: number;
  spaceRight?: number;
}

export class MovableArea {
  eventModel: EvenModel = new EvenModel();
  el: HTMLElement;
  container: HTMLElement;
  space = 50;
  spaceLeft: number;
  spaceRight: number;
  moveSpaceLeft: number;
  moveSpaceRight: number;
  useSpaceLeft: number;
  useSpaceRight: number;
  spaceDis = 5;
  animate: Animate = new Animate();
  x = 0;
  realX: number;
  leftBound = 0;
  rightBound: number;
  eventModelRun: EvenModelRun;
  moveChange: Subject<number> = new Subject<number>();

  constructor(
    el: HTMLElement,
    container: HTMLElement,
    { spaceLeft, moveSpaceLeft, moveSpaceRight, spaceRight }: MovableOpts = {},
  ) {
    this.el = el;
    this.container = container;
    this.useSpaceLeft = this.spaceLeft = spaceLeft || this.space;
    this.useSpaceRight = this.spaceRight = spaceRight || this.space;
    this.moveSpaceLeft = moveSpaceLeft || this.space;
    this.moveSpaceRight = moveSpaceRight || this.space;
  }
  moveRun: (x: number) => void;
  move(x: number) {
    this.moveRun(x);
    this.moveChange.next(x);
  }
  scrollToAnime: any;
  scrollRunning = false;
  scrollTo(x: number, cb?: () => void, easing = "easeInOutCubic") {
    if (this.scrollToAnime) {
      this.scrollToAnime.pause();
    }
    if (this.eventModelRun && this.eventModelRun.isRunning) {
      this.eventModelRun.stop();
    }
    if (this.animate.isRunning) {
      this.animate.pause();
    }
    this.scrollRunning = true;
    const startX = this.x;
    const distance = x - this.x;
    this.scrollToAnime = anime({
      target: null,
      translate: distance,
      easing,
      duration: 300,
      update: (e: any) => {
        this.handleAnimateRun((e.progress / 100) * distance + startX);
        // this.handleAnimateRun(e.progress*x/100);
      },
      complete: () => {
        this.scrollRunning = false;
        this.scrollToAnime = null;
        cb && cb();
      },
    });
  }
  get preventTouchMove() {
    return this.scrollRunning;
  }
  damps = (x: number, space: number): number => {
    return (-1 / Math.pow(1.1, x / 10)) * space + space;
  };
  leftBack = (cb?: () => void) => {
    this.animate.run({
      duration: 300,
      start: this.x,
      end: 0,
      updateCb: this.handleAnimateRun,
      endCb: (runX: number) => {
        this.realX = this.x = 0;
        this.resetSpace();
        cb && cb();
      },
    });
  };
  rightBack = (cb?: () => void) => {
    this.animate.run({
      duration: 400,
      start: this.x,
      end: this.rightBound,
      updateCb: this.handleAnimateRun,
      endCb: () => {
        this.realX = this.x = this.rightBound;
        this.resetSpace();
        cb && cb();
      },
    });
  };
  resetSpace = () => {
    this.useSpaceRight = this.spaceRight;
    this.useSpaceLeft = this.spaceLeft;
  };
  handleArea(horizontal: boolean) {
    if (horizontal) {
      this.moveRun = (x: number) =>
        (this.el.style.transform = `translateX(${x}px)`);
      this.rightBound = 0 - this.el.offsetWidth + this.container.clientWidth;
    } else {
      this.moveRun = (y: number) =>
        (this.el.style.transform = `translateY(${y}px)`);
      this.rightBound = 0 - this.el.offsetHeight + this.container.clientHeight;
    }

    forwardTouch(
      {
        element: this.el,
        moment: true,
        begin: () => {
          if (this.preventTouchMove) return;
          if (this.eventModelRun) this.eventModelRun.stop();
          if (this.animate.isRunning) {
            this.animate.pause();
          }
        },
        move: ({ perX, perY }) => {
          if (this.preventTouchMove) return;
          this.x += horizontal ? perX : perY;
          if (this.x > 0) {
            this.useSpaceLeft = this.moveSpaceLeft;
            this.realX = this.damps(this.x, this.useSpaceLeft);
          } else if (this.x < this.rightBound) {
            this.useSpaceRight = this.spaceRight;
            this.realX =
              this.rightBound -
              this.damps(this.rightBound - this.x, this.useSpaceRight);
          } else {
            this.realX = this.x;
            this.resetSpace();
          }
          this.move(this.realX);
        },
        end: ({ momentSpeed }) => {
          if (this.preventTouchMove) return;

          if (momentSpeed) {
            this.eventModelRun = this.eventModel.frameRun({
              advance: momentSpeed > 0,
              v0: momentSpeed,
              startJourney: this.x,
              update: (v, s) => {
                this.handleAnimateRun(s);
              },
              end: () => {
                if (this.x > 0) {
                  this.leftBack();
                } else if (this.x < this.rightBound) {
                  this.rightBack();
                } else {
                  this.resetSpace();
                }
              },
            });
          } else if (this.x > 0) {
            this.leftBack();
          } else if (this.x < this.rightBound) {
            this.rightBack();
          } else {
            this.resetSpace();
          }
        },
      },
      horizontal,
    );
  }
  handleAnimateRun = (runX: number) => {
    this.x = runX;
    if (runX >= this.leftBound) {
      this.realX = this.damps(this.x, this.useSpaceLeft);
      if (
        this.realX > this.spaceLeft - this.spaceDis &&
        this.eventModelRun &&
        this.eventModelRun.isRunning
      ) {
        this.eventModelRun.stop();
      } else {
        this.move(this.realX);
      }
    } else if (runX <= this.rightBound) {
      this.realX =
        this.rightBound -
        this.damps(this.rightBound - this.x, this.useSpaceRight);
      if (
        this.realX < this.rightBound - this.spaceRight + this.spaceDis &&
        this.eventModelRun &&
        this.eventModelRun.isRunning
      ) {
        this.eventModelRun.stop();
      } else {
        this.move(this.realX);
      }
    } else {
      this.move(runX);
    }
  };
}
