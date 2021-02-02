import { Subject } from "rxjs";
import { RouterMode } from "./interface";
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
export declare class RouterChangeService {
    change: Subject<ChangeRoute>;
    historyHeap: string[];
    historyHeapLength: number;
    hostPath: string;
    baseUrl: string;
    routerMode: RouterMode;
    preventPopState: boolean;
    reLaunch({ path }: {
        path: string;
    }): void;
    /**
     * reset heap. when set routerMode;
     * @param mode
     */
    setRouterMode(mode: "history" | "hash"): void;
    getBaseUrlFromDom(): string;
    setBaseUrl(url: string): void;
    getHistoryPath(url: string): string;
    getHashPath(url: string): any;
    getPath(url?: string): any;
    cleanBaseUrl(path: string): string;
    immediateWatch: import("rxjs").Observable<ChangeRoute>;
    hasHistory(): boolean;
    getLastedPath(): string | undefined;
    get prePath(): string | undefined;
    get currentPath(): any;
    get currentPurePath(): string;
    get currentParams(): Record<any, any>;
    initHistoryHeap(): void;
    initData(): void;
    joinPath(path: string, { root, params }: PushOpts): string;
    ensureFirstExists(): void;
    resetHistoryHeap(): void;
    changeNext(changeRoute: ChangeRoute): void;
    constructor();
    back(): void;
    go(count: number): void;
    push(path: string, opts?: PushOpts): void;
    replace(path: string, opts?: PushOpts): void;
    popup(popState: Record<string, any>): void;
    tab(tabState: Record<string, any>): void;
}
