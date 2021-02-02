import { isMobile } from "@ztwx/utils";

export interface BeginOpts {
  beginX: number;
  beginY: number;
  event: TouchEvent;
}

export interface MoveOpts {
  moveX: number;
  moveY: number;
  perX: number;
  perY: number;
  disX: number;
  disY: number;
  event: TouchEvent;
}
export interface EndOpts {
  event: TouchEvent;
  disX: number;
  disY: number;
  momentActive?: boolean;
  momentSpeed?: number;
}

export interface TouchOpts {
  element: any;
  begin?: (beginOpts: BeginOpts) => void;
  move: (moveOpts: MoveOpts) => void;
  end?: (endOpts: EndOpts) => void;
  /**
   * listenr moment speed
   */
  moment?: boolean;
  eventOpts?: any;
}

const momentSpeedActive = 3;
const momentInterval = 100;
export const touch = (opts: TouchOpts) => {
  let touchstart: Function,
    touchmove: Function,
    touchend: Function | undefined,
    startMove: boolean;
  const clear = () => {
    startMove = false;
  };

  let beginX: number,
    beginY: number,
    movePos: any,
    moveX: number,
    moveY: number,
    preMoveX: number,
    preMoveY: number,
    perX: number,
    perY: number;

  touchstart = (pos: any, event: TouchEvent) => {
    clear();
    beginX = pos.pageX;
    beginY = pos.pageY;
    opts.begin && opts.begin({ beginX, beginY, event });
  };
  touchmove = (movePos: any, event: TouchEvent) => {
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
  touchend = (event: TouchEvent) =>
    opts.end &&
    opts.end({
      event,
      disX: moveX - beginX,
      disY: moveY - beginY,
    });

  if (isMobile) {
    opts.element.addEventListener(
      "touchstart",
      (e: any) => touchstart(e.touches[0], e),
      { passive: true, ...(opts.eventOpts || {}) },
    );
    opts.element.addEventListener(
      "touchmove",
      (e: any) => touchmove(e.touches[0], e),
      { passive: true, ...(opts.eventOpts || {}) },
    );
    opts.end &&
      opts.element.addEventListener("touchend", touchend, {
        passive: true,
        ...(opts.eventOpts || {}),
      });
  } else {
    let moveListening: boolean, upListening: boolean;
    const mousemove = (e: any) => {
      touchmove(e, e);
    };
    const mouseUpHandler = (e: any) => {
      document.documentElement.removeEventListener("mousemove", mousemove);
      document.documentElement.removeEventListener("mouseup", mouseUpHandler);
      moveListening = upListening = false;
      touchend && touchend(e);
    };
    opts.element.addEventListener(
      "mousedown",
      (e: any) => {
        touchstart(e, e);
        !moveListening &&
          document.documentElement.addEventListener("mousemove", mousemove, {
            passive: true,
            ...(opts.eventOpts || {}),
          });
        !upListening &&
          document.documentElement.addEventListener("mouseup", mouseUpHandler, {
            passive: true,
            ...(opts.eventOpts || {}),
          });
        moveListening = upListening = true;
      },
      { passive: true, ...(opts.eventOpts || {}) },
    );
  }
};

export class Moment {
  momentSpeed = 0;
  interval: any;
  moveNum = 0;
  previousNum: number;
  previousTmpNum: number;
  horizontal: boolean;
  constructor(horizontal?: boolean) {
    this.horizontal = !!horizontal;
    this.momentMove = ({ moveX, moveY }) => {
      if (horizontal) {
        this.moveNum = moveX;
      } else {
        this.moveNum = moveY;
      }
    };
  }
  clear() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
  resetSpeed = () => (this.momentSpeed = 0);

  momentBegin = ({ beginX, beginY }: any) => {
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
  momentMove: (p: any) => void;
  momentEnd(activeCb: Function) {
    this.interval && this.clear();
    this.momentSpeed = this.moveNum - this.previousNum;
    activeCb(Math.abs(this.momentSpeed) >= momentSpeedActive, this.momentSpeed);
  }
}

export const forwardTouch = (
  { element, begin, move, end, moment }: TouchOpts,
  horizontal: boolean,
) => {
  let moveFn: (moveOpts: MoveOpts) => void,
    beginFn: (beginOpts: BeginOpts) => void,
    endFn: (endOpts: EndOpts) => void,
    momentMethod: Moment,
    pristine: boolean | undefined = true;

  if (moment) momentMethod = new Moment(horizontal);
  let clear = () => {
    pristine = true;
    moment && momentMethod.clear();
  };
  beginFn = (e: any) => {
    clear();
    begin && begin(e);
    moment && momentMethod.momentBegin(e);
  };
  moveFn = (e: any) => {
    if (pristine === undefined)
      return momentMethod && momentMethod.resetSpeed();
    if (pristine) {
      const perX = Math.abs(e.perX),
        perY = Math.abs(e.perY);
      if ((horizontal && perX > perY) || (!horizontal && perX <= perY)) {
        move && move(e);
        moment && momentMethod.momentMove(e);
        pristine = false;
      } else {
        pristine = undefined;
      }
    } else {
      move && move(e);
      moment && momentMethod.momentMove(e);
    }
  };
  endFn = e => {
    clear();
    moment
      ? momentMethod.momentEnd(
          (momentActive: boolean, momentSpeed: number) =>
            end && end({ ...e, momentActive, momentSpeed }),
        )
      : end && end(e);
  };

  touch({
    element,
    begin: beginFn,
    move: moveFn,
    end: endFn,
  });
};

export const horizontalTouch = (opts: TouchOpts) => forwardTouch(opts, true);
export const verticalTouch = (opts: TouchOpts) => forwardTouch(opts, false);
