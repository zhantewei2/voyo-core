import { forwardTouch, Animate } from "../../utils/index";
import { EvenModel } from "./even-model";
import { Subject } from "rxjs";
import anime from "animejs/lib/anime.es.js";
export class MovableArea {
    constructor(el, container, { spaceLeft, moveSpaceLeft, moveSpaceRight, spaceRight } = {}) {
        this.eventModel = new EvenModel();
        this.space = 50;
        this.spaceDis = 5;
        this.animate = new Animate();
        this.x = 0;
        this.leftBound = 0;
        this.moveChange = new Subject();
        this.scrollRunning = false;
        this.damps = (x, space) => {
            return (-1 / Math.pow(1.1, x / 10)) * space + space;
        };
        this.leftBack = (cb) => {
            this.animate.run({
                duration: 300,
                start: this.x,
                end: 0,
                updateCb: this.handleAnimateRun,
                endCb: (runX) => {
                    this.realX = this.x = 0;
                    this.resetSpace();
                    cb && cb();
                },
            });
        };
        this.rightBack = (cb) => {
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
        this.resetSpace = () => {
            this.useSpaceRight = this.spaceRight;
            this.useSpaceLeft = this.spaceLeft;
        };
        this.handleAnimateRun = (runX) => {
            this.x = runX;
            if (runX >= this.leftBound) {
                this.realX = this.damps(this.x, this.useSpaceLeft);
                if (this.realX > this.spaceLeft - this.spaceDis &&
                    this.eventModelRun &&
                    this.eventModelRun.isRunning) {
                    this.eventModelRun.stop();
                }
                else {
                    this.move(this.realX);
                }
            }
            else if (runX <= this.rightBound) {
                this.realX =
                    this.rightBound -
                        this.damps(this.rightBound - this.x, this.useSpaceRight);
                if (this.realX < this.rightBound - this.spaceRight + this.spaceDis &&
                    this.eventModelRun &&
                    this.eventModelRun.isRunning) {
                    this.eventModelRun.stop();
                }
                else {
                    this.move(this.realX);
                }
            }
            else {
                this.move(runX);
            }
        };
        this.el = el;
        this.container = container;
        this.useSpaceLeft = this.spaceLeft = spaceLeft || this.space;
        this.useSpaceRight = this.spaceRight = spaceRight || this.space;
        this.moveSpaceLeft = moveSpaceLeft || this.space;
        this.moveSpaceRight = moveSpaceRight || this.space;
    }
    move(x) {
        this.moveRun(x);
        this.moveChange.next(x);
    }
    scrollTo(x, cb, easing = "easeInOutCubic") {
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
            update: (e) => {
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
    handleArea(horizontal) {
        if (horizontal) {
            this.moveRun = (x) => (this.el.style.transform = `translateX(${x}px)`);
            this.rightBound = 0 - this.el.offsetWidth + this.container.clientWidth;
        }
        else {
            this.moveRun = (y) => (this.el.style.transform = `translateY(${y}px)`);
            this.rightBound = 0 - this.el.offsetHeight + this.container.clientHeight;
        }
        forwardTouch({
            element: this.el,
            moment: true,
            begin: () => {
                if (this.preventTouchMove)
                    return;
                if (this.eventModelRun)
                    this.eventModelRun.stop();
                if (this.animate.isRunning) {
                    this.animate.pause();
                }
            },
            move: ({ perX, perY }) => {
                if (this.preventTouchMove)
                    return;
                this.x += horizontal ? perX : perY;
                if (this.x > 0) {
                    this.useSpaceLeft = this.moveSpaceLeft;
                    this.realX = this.damps(this.x, this.useSpaceLeft);
                }
                else if (this.x < this.rightBound) {
                    this.useSpaceRight = this.spaceRight;
                    this.realX =
                        this.rightBound -
                            this.damps(this.rightBound - this.x, this.useSpaceRight);
                }
                else {
                    this.realX = this.x;
                    this.resetSpace();
                }
                this.move(this.realX);
            },
            end: ({ momentSpeed }) => {
                if (this.preventTouchMove)
                    return;
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
                            }
                            else if (this.x < this.rightBound) {
                                this.rightBack();
                            }
                            else {
                                this.resetSpace();
                            }
                        },
                    });
                }
                else if (this.x > 0) {
                    this.leftBack();
                }
                else if (this.x < this.rightBound) {
                    this.rightBack();
                }
                else {
                    this.resetSpace();
                }
            },
        }, horizontal);
    }
}
