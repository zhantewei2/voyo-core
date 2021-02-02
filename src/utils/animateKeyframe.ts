export const frameInterval = 16.6;

export interface AnimatePrams {
  duration: number;
  start: number;
  end: number;
  startCb?: () => void;
  endCb?: (x: number) => void;
  updateCb: (x: number) => void;
  pauseCb?: (x: number) => void;
}

export class Animate {
  isPause = false;
  isRunning = false;
  pause() {
    this.isPause = true;
  }
  run = ({
    start,
    duration,
    end,
    startCb,
    endCb,
    updateCb,
    pauseCb,
  }: AnimatePrams) => {
    this.isPause = false;
    let count: number = Math.floor(duration / frameInterval);
    let per: number = (end - start) / count;
    let x = start;
    let index = 0;
    const run = () => {
      this.isRunning = true;
      x += per;
      updateCb(Math.round(x * 100) / 100);
      if (++index < count) {
        if (this.isPause) {
          this.isRunning = false;
          pauseCb && pauseCb(x);
          return;
        }
        requestAnimationFrame(run);
      } else {
        this.isRunning = false;
        endCb && endCb(x);
      }
    };
    startCb && startCb();
    requestAnimationFrame(run);
  };
}

export class EvenModelRun {
  isRunning = false;
  isPause = false;
  isStop = false;
  run: any;
  runAllFrame: number;
  runCompleteFrame: number;
  constructor(runCount: number, run: (frame: number) => void, end: () => void) {
    this.runAllFrame = runCount;
    this.runCompleteFrame = 0;
    this.run = () => {
      this.isRunning = true;
      if (this.isPause) return (this.isRunning = false);
      if (this.isStop) {
        this.isRunning = false;
        end();
        return;
      }
      if (this.runCompleteFrame > this.runAllFrame) {
        this.isStop = true;
        end();
        return;
      }
      run(++this.runCompleteFrame);
      requestAnimationFrame(this.run);
    };
  }
  pause() {
    this.isPause = true;
  }
  restore() {
    this.isPause = false;
    this.run();
  }
  stop() {
    this.isStop = true;
  }
  play() {
    this.run();
  }
}
