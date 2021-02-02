import { isIOS } from "@ztwx/utils";

import { fromEvent, merge, Observable, of } from "rxjs";
import { debounceTime, map } from "rxjs/operators";

const body = document.body;
const html: HTMLElement = document.documentElement;
export const getScrollParent = (el: HTMLElement | Window): any => {
  let parent: HTMLElement | any = (el as any).parentNode;
  if (el === window || parent === window) return window;
  //IS Shadow Root
  if (parent.host && parent.host instanceof HTMLElement) {
    parent = parent.host;
  }
  const style = window.getComputedStyle(parent);
  return /auto|scroll/.test(
    style.getPropertyValue("overflow") + style.getPropertyValue("overflow-y"),
  )
    ? parent
    : getScrollParent(parent);
};

export interface ScrollListenerEvent {
  e: Event | null;
  v: number;
}

export const listenScroll = (
  el: HTMLElement,
): Observable<ScrollListenerEvent> => {
  let handler: (e: Event) => ScrollListenerEvent;
  if (el == body || el == html) {
    handler = (e: Event) => ({ e, v: html.scrollTop });
  } else {
    handler = (e: Event) => ({ e, v: el.scrollTop });
  }
  const eventSubscription = fromEvent(el, "scroll", { passive: true }).pipe(
    map(e => handler(e)),
  );
  return merge(
    eventSubscription,
    eventSubscription.pipe(debounceTime(150)),
    of({
      e: null,
      v: el == body || el == html ? html.scrollTop : el.scrollTop,
    }),
  );
};

export const disableIOSDebounce = (el: HTMLElement) => {
  if (!isIOS) return;
  let disableDown: boolean, slideBeginY: number, moveDown: boolean;

  el.addEventListener(
    "touchstart",
    (e: any) => {
      disableDown = el.scrollTop <= 0;
      slideBeginY = e.touches[0].pageY;
    },
    { passive: true },
  );
  el.addEventListener(
    "touchmove",
    (e: any) => {
      moveDown = e.touches[0].pageY > slideBeginY;
      if (moveDown && disableDown) {
        e.preventDefault();
      }
    },
    { passive: false },
  );
};

export const listenScrollParent = (
  el: HTMLElement,
  listener: (e: ScrollListenerEvent) => void,
  immediate = false,
): {
  unListen: () => void;
  scrollContainer: HTMLElement | Window;
} => {
  const parent = getScrollParent(el);
  let scrollContainer: HTMLElement | Window;
  let listenerFn: (e: Event) => void;
  if (parent == body) {
    listenerFn = (e: Event) => {
      listener({
        e,
        v: html.scrollTop,
      });
    };
    scrollContainer = window;
  } else {
    listenerFn = (e: Event) => {
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

export interface KeepScrollContainerOpts {
  scrollContainer: HTMLElement;
  scrollFn?: (scrollTop: number) => void;
  behavior: "x" | "y";
}

export class KeepScrollContainer {
  currentPosition: number;
  scrollContainer: HTMLElement;
  listenFn: any;
  public destroy() {
    this.scrollContainer.removeEventListener("scroll", this.listenFn);
  }
  public restore() {
    if (this.currentPosition !== undefined)
      this.scrollContainer.scrollTo(0, this.currentPosition);
  }
  constructor({ scrollContainer, scrollFn }: KeepScrollContainerOpts) {
    this.scrollContainer = scrollContainer;
  }
  listen() {
    this.listenFn = (e: any) => {
      this.currentPosition = e.target.scrollTop;
    };
    this.scrollContainer.addEventListener("scroll", this.listenFn, {
      capture: true,
      passive: true,
    });
  }
}
