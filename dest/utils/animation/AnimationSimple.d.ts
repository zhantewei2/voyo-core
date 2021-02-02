import { Animation, CbOptions } from "./Animation";
export declare class AnimationSimple extends Animation {
    constructor(el: HTMLElement, className: string, cbOpts: CbOptions, bindTransitionEl?: HTMLElement);
}
export declare class AnimationDisplay extends AnimationSimple {
    leaveCb: () => void;
    enterCb: () => void;
    constructor(el: HTMLElement, className: string, display?: string, bindTransitionEl?: HTMLElement);
    close(force?: boolean, cb?: () => void): Promise<void>;
    open(delay?: number, cb?: () => void): void;
}
export declare class AnimationIf extends AnimationSimple {
    parentEl: HTMLElement;
    constructor(el: HTMLElement, className: string, parentEl: HTMLElement, bindTransitionEl?: HTMLElement);
    open(): void;
}
