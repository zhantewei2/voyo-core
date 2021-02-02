export interface SelectMoveOpts {
    topBoundary: number;
    moveViewHeight: number;
    moveWrapperHeight: number;
    uniformAcceleration?: number;
    evenAccelerationAdd?: number;
    evenAcceleration?: number;
}
export declare type MoveState = "bottomUniformAcceleration" | "topUniformAcceleration" | "topVarAcceleration" | "bottomVarAcceleration" | "topBack" | "bottomBack" | "";
export interface SelectMoveTmp {
    aEven: number;
    previousV: number;
    currentV: number;
    currentS: number;
    previousS: number;
    previousA: number;
    currentA: number;
    moveState: MoveState;
    backA: number;
}
export declare type ForwardType = 1 | 0 | -1;
export interface TouchTmp {
    getEvenDistance: (currentEvenDistance: number, userMoveDistance: number) => number;
}
export declare class SelectMove {
    a: number;
    protected currentS: number;
    protected topBoundary: number;
    protected bottomBoundary: number;
    protected moveViewHeight: number;
    protected moveWrapperHeight: number;
    protected uniformAccerleration: number;
    protected evenAccelerationAdd: number;
    protected evenAcceleration: number;
    protected backDuration: number;
    protected speedPause: boolean;
    tmp: SelectMoveTmp;
    touchDict: TouchTmp;
    move(y: number): void;
    calBottomBoundary(): void;
    constructor({ topBoundary, moveViewHeight, moveWrapperHeight, uniformAcceleration, evenAcceleration, evenAccelerationAdd, }: SelectMoveOpts);
    /**
     * cal distance
     * @param v
     * @return relative currentS
     */
    calRelativeSBySpeed(v: number): number;
    checkMoveState(forward: ForwardType): MoveState;
    cleanTouch(): void;
    touchMove(incrementNum: number): void;
    cleanTmp(): void;
    /**
     * scroll to distance specified
     * @param targetS
     * @param cb
     */
    startToDistance(targetS: number, cb?: () => void): void;
    /**
     * scroll auto by speed
     * @param v
     * @param cb
     */
    startBySpeed(v: number, cb?: () => void): void;
    defineCurrentS: () => void;
    breakSpeed(): void;
    /**
     *
     * @param v start speed
     * @param currentS current distance
     * @param forward 1 to bottom -1 to top 0 static
     * @param end
     */
    runBySpeed(v: number, currentS: number, forward: ForwardType, end?: () => void): false | undefined;
}
