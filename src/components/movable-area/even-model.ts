import { EvenModelRun } from "../../utils/animateKeyframe";
export type FrameRunCb = (currentV: number) => void;

export interface FrameRun {
  advance: boolean;
  v0: number;
  startJourney: number;
  end?: () => void;
  update: (v: number, s: number) => void;
}

export class EvenModel {
  a = 1;
  vc = 0.2;
  isRunning = false;
  getRealV(v: number) {
    return v * this.vc;
  }
  getRealA = (advance: boolean): number => (advance ? this.a : 0 - this.a);

  getTimeByV(v0: number, a: number) {
    const count = v0 / a || 0;
    return Math.abs(Math.floor(count));
  }

  getJourneyByTime(v0: number, a: number, t: number): number {
    return (Math.pow(v0, 2) - Math.pow(v0 - a * t, 2)) / (2 * a);
  }
  roundingValue(v: number) {
    return Math.round(v * 10) / 10;
  }
  frameRun({ v0, update, advance, end, startJourney }: FrameRun): EvenModelRun {
    this.isRunning = true;
    const a = this.getRealA(advance);
    v0 = this.getRealV(v0);
    let count = this.getTimeByV(v0, a);
    let currentS: number;
    let currentV: number;
    const evenModel = new EvenModelRun(
      count,
      (i: number) => {
        currentV = v0 - a * i;
        currentS = startJourney + this.getJourneyByTime(v0, a, i);
        update(this.roundingValue(currentV), this.roundingValue(currentS));
      },
      () => {
        end && end();
      },
    );
    evenModel.play();
    return evenModel;
  }
}
