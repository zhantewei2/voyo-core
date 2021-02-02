export interface AnimationOptions {
    enter?: string;
    enterActive: string;
    enterTo?: string;
    leave?: string;
    leaveActive: string;
    leaveTo?: string;
    bindTransitionEl?: HTMLElement;
}
export interface CbOptions {
    enterStartCb?: Function;
    enterEndCb?: Function;
    leaveStartCb?: Function;
    leaveEndCb?: Function;
}
export declare const delayDefault = 40;
export declare class Animation {
    el: HTMLElement;
    opts: AnimationOptions;
    cbs: CbOptions;
    isEnter: boolean;
    isEnterWait: boolean;
    isLeave: boolean;
    hasEnter: boolean;
    waitTransition: boolean;
    constructor(el: HTMLElement, opts: AnimationOptions, cbs: CbOptions);
    reset0(): void;
    reset(leave: boolean): void;
    openEndCb: () => void;
    closeEndCb: () => void;
    enter(): void;
    enterClearAllClass(): void;
    enterStart(): void;
    enterNext(): void;
    enterEnd(): void;
    leave(): void;
    leaveClearAllClass(): void;
    leaveStart(): void;
    leaveNext(): void;
    leaveEnd(): void;
    open(delay?: number): void;
    cancelEnter(): void;
    cancelLeave(): void;
    close(force?: boolean): Promise<void>;
    clearCloseTimeout(): void;
    closeWaitTimeout: any;
    closeNextTimeout: any;
}
