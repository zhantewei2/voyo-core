import { EvenModelRun } from "../../utils/animateKeyframe";
export class EvenModel {
    constructor() {
        this.a = 1;
        this.vc = 0.2;
        this.isRunning = false;
        this.getRealA = (advance) => (advance ? this.a : 0 - this.a);
    }
    getRealV(v) {
        return v * this.vc;
    }
    getTimeByV(v0, a) {
        const count = v0 / a || 0;
        return Math.abs(Math.floor(count));
    }
    getJourneyByTime(v0, a, t) {
        return (Math.pow(v0, 2) - Math.pow(v0 - a * t, 2)) / (2 * a);
    }
    roundingValue(v) {
        return Math.round(v * 10) / 10;
    }
    frameRun({ v0, update, advance, end, startJourney }) {
        this.isRunning = true;
        const a = this.getRealA(advance);
        v0 = this.getRealV(v0);
        let count = this.getTimeByV(v0, a);
        let currentS;
        let currentV;
        const evenModel = new EvenModelRun(count, (i) => {
            currentV = v0 - a * i;
            currentS = startJourney + this.getJourneyByTime(v0, a, i);
            update(this.roundingValue(currentV), this.roundingValue(currentS));
        }, () => {
            end && end();
        });
        evenModel.play();
        return evenModel;
    }
}
