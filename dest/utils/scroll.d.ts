import { Observable } from "rxjs";
export declare const getScrollParent: (el: HTMLElement | Window) => any;
export interface ScrollListenerEvent {
    e: Event | null;
    v: number;
}
export declare const listenScroll: (el: HTMLElement) => Observable<ScrollListenerEvent>;
export declare const disableIOSDebounce: (el: HTMLElement) => void;
export declare const listenScrollParent: (el: HTMLElement, listener: (e: ScrollListenerEvent) => void, immediate?: boolean) => {
    unListen: () => void;
    scrollContainer: HTMLElement | Window;
};
export interface KeepScrollContainerOpts {
    scrollContainer: HTMLElement;
    scrollFn?: (scrollTop: number) => void;
    behavior: "x" | "y";
}
export declare class KeepScrollContainer {
    currentPosition: number;
    scrollContainer: HTMLElement;
    listenFn: any;
    destroy(): void;
    restore(): void;
    constructor({ scrollContainer, scrollFn }: KeepScrollContainerOpts);
    listen(): void;
}
