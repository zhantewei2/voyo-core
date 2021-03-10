import { Subject, merge, of } from "rxjs";
import { IOCProvider } from "../ioc";
import { RouterMode } from "./interface";
import { ROUTER_CHANGE_IOC_NAME } from "../setting";
import { map } from "rxjs/operators";
import { getPureUrl, queryparams } from "@ztwx/utils/lib/url";

export interface ChangeRoute {
  type: "advance" | "back" | "replace";
  targetPath: string;
  pageCount: number;
}

export interface PushOpts {
  title?: string;
  root?: boolean;
  params?: Record<string, string | number>;
}

@IOCProvider({
  name: ROUTER_CHANGE_IOC_NAME,
})
export class RouterChangeService {
  change: Subject<ChangeRoute> = new Subject<ChangeRoute>();
  historyHeap: string[] = [];
  historyHeapLength = 0;
  hostPath: string;
  baseUrl = "/";
  routerMode: RouterMode = "history";
  preventPopState: boolean;
  reLaunch({ path }: { path: string }) {
    if (this.historyHeap.length && this.historyHeap.length > 1) {
      this.go(0 - this.historyHeap.length + 1);
    }
    setTimeout(() => {
      this.replace(path);
    }, 10);
  }
  /**
   * reset heap. when set routerMode;
   * @param mode
   */
  setRouterMode(mode: "history" | "hash") {
    this.routerMode = mode;
    this.resetHistoryHeap();
  }
  getBaseUrlFromDom(): string {
    const baseDom: HTMLBaseElement | null = document.querySelector(
      "base[href]",
    );
    if (!baseDom) return "/";
    return baseDom.getAttribute("href") as string;
  }
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }
  getHistoryPath(url: string) {
    let matcher: any = url.match(/https?:\/\/.*?(\/.*$)/);
    if(!matcher)matcher=url.match(/^(\/.*)/);
    if (!matcher) return "/";
    const matcherPath: string = matcher[1];
    return this.cleanBaseUrl(matcherPath);
  }
  getHashPath(url: string) {
    const splitUrl: any = url.split("#");
    if (splitUrl.length < 2) return "";
    return splitUrl.slice(1).join("#");
  }
  getPath(url?: string) {
    url = url || location.href;
    if (this.routerMode === "history") {
      return this.getHistoryPath(url);
    } else if (this.routerMode === "hash") {
      return this.getHashPath(url);
    }
  }
  cleanBaseUrl(path: string) {
    if (!this.baseUrl) return path;
    path = path||this.getPath(path);
    const baseUrlIndex = path.indexOf(this.baseUrl);
    return baseUrlIndex >= 0 ? path.slice(this.baseUrl.length - 1) : path;
  }
  immediateWatch = merge<string, ChangeRoute>(
    of(1).pipe(map(() => this.currentPath)),
    this.change,
  );
  hasHistory(): boolean {
    return this.historyHeapLength > 1;
  }
  getLastedPath(): string | undefined {
    return this.historyHeapLength
      ? this.historyHeap[this.historyHeapLength - 1]
      : undefined;
  }
  get prePath(): string | undefined {
    return this.historyHeapLength > 1
      ? this.historyHeap[this.historyHeapLength - 2]
      : undefined;
  }
  get currentPath() {
    return this.getLastedPath() || this.getPath();
  }
  get currentPurePath() {
    return getPureUrl(this.currentPath);
  }
  get currentParams() {
    return queryparams.dencode(this.currentPath);
  }
  initHistoryHeap() {
    this.historyHeap.push(this.getPath());
    this.historyHeapLength++;
  }
  initData() {
    this.hostPath = `${location.protocol}//${location.hostname}`;
    this.setBaseUrl(this.getBaseUrlFromDom());
  }
  joinPath(path: string, { root, params }: PushOpts) {
    if (params) {
      const queryParams = queryparams.encode(params);
      if (queryParams) path += "?" + queryParams;
    }
    if (root) return path;

    return this.routerMode === "hash"
      ? location.origin + location.pathname + "#" + path
      : this.baseUrl + (path.startsWith("/") ? path.slice(1) : path);
  }
  ensureFirstExists() {
    if (!this.historyHeapLength) {
      this.historyHeap.push(this.getPath());
      this.historyHeapLength++;
    }
  }
  resetHistoryHeap() {
    this.historyHeapLength = 0;
    this.historyHeap = [];
    this.initHistoryHeap();
  }

  changeNext(changeRoute: ChangeRoute) {
    const { type, targetPath } = changeRoute;
    if (type === "advance") {
      this.historyHeap.push(targetPath);
      this.historyHeapLength++;
    } else if (type === "replace") {
      if (this.historyHeapLength)
        this.historyHeap[this.historyHeapLength - 1] = targetPath;
    } else if (type === "back") {
      if (this.historyHeapLength > 1) {
        const maxHeapIndex = this.historyHeapLength - 1;
        const backCount =
          changeRoute.pageCount > maxHeapIndex
            ? maxHeapIndex
            : changeRoute.pageCount;
        this.historyHeap.pop();
        this.historyHeap.splice(maxHeapIndex - backCount + 1, backCount);
        this.historyHeapLength -= backCount;

        this.ensureFirstExists();
      } else {
        this.resetHistoryHeap();
        console.debug("No history heap to back");
      }
    }
    this.change.next(changeRoute);
  }
  constructor() {
    this.initData();
    this.initHistoryHeap();

    window.addEventListener("popstate", e => {
      if (this.preventPopState) return (this.preventPopState = false);

      this.changeNext({
        targetPath: this.prePath || this.getPath(),
        type: "back",
        pageCount: 1,
      });
    });
    const pushState: any = history.pushState;
    const replaceState: any = history.replaceState;
    const go: any = history.go;

    history.go = (page: number) => {
      if (!page || page > 0) return;
      this.preventPopState = true;
      this.changeNext({
        targetPath: this.prePath || this.getPath(),
        type: "back",
        pageCount: Math.abs(page),
      });
      go.call(history, page);
    };
    history.pushState = (...args: any[]) => {
      this.changeNext({
        targetPath: this.getPath(args[2] || "/"),
        type: "advance",
        pageCount: 1,
      });
      pushState.call(history, ...args);
    };
    history.replaceState = (...args: any[]) => {
      this.changeNext({
        targetPath: this.getPath(args[2] || "/"),
        type: "replace",
        pageCount: 1,
      });
      replaceState.call(history, ...args);
    };
  }
  back() {
    history.back();
  }
  go(count: number) {
    history.go(count);
  }
  push(path: string, opts: PushOpts = {}) {
    history.pushState(null, opts.title || "", this.joinPath(path, opts));
  }
  replace(path: string, opts: PushOpts = {}) {
    history.replaceState(null, opts.title || "", this.joinPath(path, opts));
  }
  popup(popState: Record<string, any>) {
    const currentPath = this.currentPath;
    const purePath = getPureUrl(currentPath);
    const params = queryparams.dencode(currentPath);
    this.push(purePath, { params: { ...params, ...popState } });
  }
  tab(tabState: Record<string, any>) {
    const currentPath = this.currentPath,
      purePath = getPureUrl(currentPath),
      params = queryparams.dencode(currentPath);
    this.replace(purePath, { params: { ...params, ...tabState } });
  }
}
