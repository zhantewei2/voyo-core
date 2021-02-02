import { isIOS } from "@ztwx/utils";
import { fromEvent, merge, of } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
const body = document.body;
const html = document.documentElement;
export const getScrollParent = (el) => {
    let parent = el.parentNode;
    if (el === window || parent === window)
        return window;
    //IS Shadow Root
    if (parent.host && parent.host instanceof HTMLElement) {
        parent = parent.host;
    }
    const style = window.getComputedStyle(parent);
    return /auto|scroll/.test(style.getPropertyValue("overflow") + style.getPropertyValue("overflow-y"))
        ? parent
        : getScrollParent(parent);
};
export const listenScroll = (el) => {
    let handler;
    if (el == body || el == html) {
        handler = (e) => ({ e, v: html.scrollTop });
    }
    else {
        handler = (e) => ({ e, v: el.scrollTop });
    }
    const eventSubscription = fromEvent(el, "scroll", { passive: true }).pipe(map(e => handler(e)));
    return merge(eventSubscription, eventSubscription.pipe(debounceTime(150)), of({
        e: null,
        v: el == body || el == html ? html.scrollTop : el.scrollTop,
    }));
};
export const disableIOSDebounce = (el) => {
    if (!isIOS)
        return;
    let disableDown, slideBeginY, moveDown;
    el.addEventListener("touchstart", (e) => {
        disableDown = el.scrollTop <= 0;
        slideBeginY = e.touches[0].pageY;
    }, { passive: true });
    el.addEventListener("touchmove", (e) => {
        moveDown = e.touches[0].pageY > slideBeginY;
        if (moveDown && disableDown) {
            e.preventDefault();
        }
    }, { passive: false });
};
export const listenScrollParent = (el, listener, immediate = false) => {
    const parent = getScrollParent(el);
    let scrollContainer;
    let listenerFn;
    if (parent == body) {
        listenerFn = (e) => {
            listener({
                e,
                v: html.scrollTop,
            });
        };
        scrollContainer = window;
    }
    else {
        listenerFn = (e) => {
            listener({
                e,
                v: parent.scrollTop,
            });
        };
        scrollContainer = parent;
    }
    scrollContainer.addEventListener("scroll", listenerFn, { passive: true });
    if (immediate) {
        listener({
            e: null,
            v: parent == body ? html.scrollTop : parent.scrollTop,
        });
    }
    return {
        unListen: () => {
            scrollContainer.removeEventListener("scroll", listenerFn);
        },
        scrollContainer,
    };
};
export class KeepScrollContainer {
    constructor({ scrollContainer, scrollFn }) {
        this.scrollContainer = scrollContainer;
    }
    destroy() {
        this.scrollContainer.removeEventListener("scroll", this.listenFn);
    }
    restore() {
        if (this.currentPosition !== undefined)
            this.scrollContainer.scrollTo(0, this.currentPosition);
    }
    listen() {
        this.listenFn = (e) => {
            this.currentPosition = e.target.scrollTop;
        };
        this.scrollContainer.addEventListener("scroll", this.listenFn, {
            capture: true,
            passive: true,
        });
    }
}
