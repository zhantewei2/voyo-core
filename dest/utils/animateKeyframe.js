export const frameInterval = 16.6;
export class Animate {
    constructor() {
        this.isPause = false;
        this.isRunning = false;
        this.run = ({ start, duration, end, startCb, endCb, updateCb, pauseCb, }) => {
            this.isPause = false;
            let count = Math.floor(duration / frameInterval);
            let per = (end - start) / count;
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
                }
                else {
                    this.isRunning = false;
                    endCb && endCb(x);
                }
            };
            startCb && startCb();
            requestAnimationFrame(run);
        };
    }
    pause() {
        this.isPause = true;
    }
}
export class EvenModelRun {
    constructor(runCount, run, end) {
        this.isRunning = false;
        this.isPause = false;
        this.isStop = false;
        this.runAllFrame = runCount;
        this.runCompleteFrame = 0;
        this.run = () => {
            this.isRunning = true;
            if (this.isPause)
                return (this.isRunning = false);
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
