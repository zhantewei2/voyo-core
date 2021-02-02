export class SelectMove {
    constructor({ topBoundary, moveViewHeight, moveWrapperHeight, uniformAcceleration, evenAcceleration, evenAccelerationAdd, }) {
        this.currentS = 0;
        this.uniformAccerleration = 0.05;
        this.evenAccelerationAdd = 0.05;
        this.evenAcceleration = 0.05;
        this.backDuration = 30;
        this.speedPause = false;
        this.tmp = {
            aEven: 0,
            previousV: 0,
            currentV: 0,
            currentS: 0,
            previousS: 0,
            moveState: "bottomUniformAcceleration",
            currentA: 0,
            previousA: 0,
            backA: 0,
        };
        this.touchDict = {
            getEvenDistance: (currentEvenDistance, userMoveDistance) => {
                let preDis = 0;
                if (currentEvenDistance) {
                    preDis = Math.pow(Math.E, (currentEvenDistance / 10 + 52.9) / 10) - 200;
                }
                let realMoveDistance = preDis + userMoveDistance;
                if (realMoveDistance < 0)
                    realMoveDistance = 0;
                return (Math.log(realMoveDistance + 200) * 10 - 52.9) * 10;
            },
        };
        this.defineCurrentS = () => {
            this.currentS =
                this.tmp.previousS + (this.tmp.currentV + this.tmp.previousV) / 2;
            this.move(this.currentS);
        };
        this.topBoundary = topBoundary;
        this.moveViewHeight = moveViewHeight;
        this.moveWrapperHeight = moveWrapperHeight;
        if (uniformAcceleration)
            this.uniformAccerleration = uniformAcceleration;
        if (evenAccelerationAdd)
            this.evenAccelerationAdd = evenAccelerationAdd;
        if (evenAcceleration)
            this.evenAcceleration = evenAcceleration;
        this.calBottomBoundary();
    }
    move(y) {
        // console.log("move",y);
    }
    calBottomBoundary() {
        this.bottomBoundary =
            0 - (this.moveViewHeight - this.moveWrapperHeight - this.topBoundary);
    }
    /**
     * cal distance
     * @param v
     * @return relative currentS
     */
    calRelativeSBySpeed(v) {
        return this.currentS + (v * v) / (2 * this.uniformAccerleration);
    }
    checkMoveState(forward) {
        if (this.currentS > this.topBoundary) {
            return (this.tmp.moveState =
                forward <= 0 ? "topBack" : "topVarAcceleration");
        }
        else if (this.currentS < this.bottomBoundary) {
            return (this.tmp.moveState =
                forward >= 0 ? "bottomBack" : "bottomVarAcceleration");
        }
        else if (forward > 0) {
            return (this.tmp.moveState = "bottomUniformAcceleration");
        }
        else if (forward < 0) {
            return (this.tmp.moveState = "topUniformAcceleration");
        }
        return "";
    }
    cleanTouch() { }
    touchMove(incrementNum) {
        const targetS = this.currentS + incrementNum;
        if (targetS > this.topBoundary) {
            if (this.currentS < this.topBoundary) {
                const evenWillDistance = targetS - this.topBoundary;
                this.currentS =
                    this.topBoundary +
                        this.touchDict.getEvenDistance(0, evenWillDistance);
            }
            else if (incrementNum > 0) {
                this.currentS =
                    this.topBoundary +
                        this.touchDict.getEvenDistance(this.currentS - this.topBoundary, incrementNum);
            }
            else {
                this.currentS =
                    this.topBoundary +
                        this.touchDict.getEvenDistance(this.currentS - this.topBoundary, incrementNum);
            }
        }
        else if (targetS < this.bottomBoundary) {
            if (this.currentS > this.bottomBoundary) {
                const evenWillDistance = this.bottomBoundary - targetS;
                this.currentS =
                    this.bottomBoundary -
                        this.touchDict.getEvenDistance(0, evenWillDistance);
            }
            else if (incrementNum < 0) {
                this.currentS =
                    this.bottomBoundary -
                        this.touchDict.getEvenDistance(this.bottomBoundary - this.currentS, 0 - incrementNum);
            }
            else {
                this.currentS =
                    this.bottomBoundary -
                        this.touchDict.getEvenDistance(this.bottomBoundary - this.currentS, 0 - incrementNum);
            }
        }
        else {
            this.currentS += incrementNum;
        }
        this.move(this.currentS);
    }
    cleanTmp() {
        this.speedPause = false;
        this.tmp.previousS = this.tmp.currentS = this.currentS;
        this.tmp.backA = this.tmp.previousV = this.tmp.currentV = this.tmp.previousA = this.tmp.currentA = 0;
    }
    /**
     * scroll to distance specified
     * @param targetS
     * @param cb
     */
    startToDistance(targetS, cb) {
        this.cleanTmp();
        const relativeS = targetS - this.currentS;
        const startV = Math.sqrt(2 * this.uniformAccerleration * Math.abs(relativeS));
        this.startBySpeed(relativeS > 0 ? startV : 0 - startV, cb);
    }
    /**
     * scroll auto by speed
     * @param v
     * @param cb
     */
    startBySpeed(v, cb) {
        if (!v)
            return;
        this.cleanTmp();
        this.runBySpeed(v, this.currentS, v > 0 ? 1 : -1, cb);
    }
    breakSpeed() {
        this.speedPause = true;
    }
    /**
     *
     * @param v start speed
     * @param currentS current distance
     * @param forward 1 to bottom -1 to top 0 static
     * @param end
     */
    runBySpeed(v, currentS, forward, end) {
        if (this.speedPause) {
            return (this.speedPause = false);
        }
        this.tmp.previousV = v;
        this.tmp.previousS = currentS;
        requestAnimationFrame(() => {
            this.checkMoveState(forward);
            if (this.tmp.moveState === "topUniformAcceleration") {
                this.tmp.currentV = v + this.uniformAccerleration;
                if (this.tmp.currentV >= 0) {
                    this.tmp.currentV = 0;
                    this.defineCurrentS();
                    return end && end();
                }
                this.defineCurrentS();
            }
            else if (this.tmp.moveState === "bottomUniformAcceleration") {
                this.tmp.currentV = v - this.uniformAccerleration;
                if (this.tmp.currentV <= 0) {
                    this.tmp.currentV = 0;
                    this.defineCurrentS();
                    return end && end();
                }
                this.defineCurrentS();
            }
            else if (this.tmp.moveState === "topBack") {
                if (!this.tmp.backA) {
                    this.tmp.backA =
                        (2 * (this.topBoundary - this.currentS)) /
                            (this.backDuration * this.backDuration);
                    this.tmp.previousV = this.tmp.backA * this.backDuration;
                }
                this.tmp.currentV = this.tmp.previousV - this.tmp.backA;
                if (this.tmp.currentV - this.tmp.backA > 0 ||
                    this.currentS <= this.topBoundary) {
                    this.tmp.currentV = 0;
                    this.currentS = this.topBoundary;
                    this.move(this.currentS);
                    return end && end();
                }
                this.defineCurrentS();
            }
            else if (this.tmp.moveState === "bottomBack") {
                if (!this.tmp.backA) {
                    this.tmp.backA =
                        (2 * (this.currentS - this.bottomBoundary)) /
                            (this.backDuration * this.backDuration);
                    this.tmp.previousV = 0 - this.tmp.backA * this.backDuration;
                }
                this.tmp.currentV = this.tmp.previousV + this.tmp.backA;
                if (this.tmp.currentV + this.tmp.backA < 0 ||
                    this.currentS >= this.bottomBoundary) {
                    this.currentS = this.bottomBoundary;
                    this.move(this.currentS);
                    return end && end();
                }
                this.defineCurrentS();
            }
            else if (this.tmp.moveState === "topVarAcceleration") {
                this.tmp.aEven =
                    this.tmp.aEven + this.evenAcceleration + this.evenAccelerationAdd;
                this.tmp.currentV = v + this.tmp.aEven;
                if (this.tmp.currentV >= 0) {
                    this.tmp.currentV = 0;
                    this.defineCurrentS();
                    return this.runBySpeed(0, this.currentS, -1, end);
                }
                this.defineCurrentS();
            }
            else if (this.tmp.moveState === "bottomVarAcceleration") {
                this.tmp.aEven =
                    this.tmp.aEven - (this.evenAcceleration + this.evenAccelerationAdd);
                this.tmp.currentV = v + this.tmp.aEven;
                if (this.tmp.currentV <= 0) {
                    this.tmp.currentV = 0;
                    this.defineCurrentS();
                    return this.runBySpeed(0, this.currentS, 1, end);
                }
                this.defineCurrentS();
            }
            this.runBySpeed(this.tmp.currentV, this.currentS, forward, end);
        });
    }
}
