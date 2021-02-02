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
export declare const touch: (opts: TouchOpts) => void;
export declare class Moment {
    momentSpeed: number;
    interval: any;
    moveNum: number;
    previousNum: number;
    previousTmpNum: number;
    horizontal: boolean;
    constructor(horizontal?: boolean);
    clear(): void;
    resetSpeed: () => number;
    momentBegin: ({ beginX, beginY }: any) => void;
    momentMove: (p: any) => void;
    momentEnd(activeCb: Function): void;
}
export declare const forwardTouch: ({ element, begin, move, end, moment }: TouchOpts, horizontal: boolean) => void;
export declare const horizontalTouch: (opts: TouchOpts) => void;
export declare const verticalTouch: (opts: TouchOpts) => void;
