import { __decorate } from "tslib";
import { Subject, merge, of } from "rxjs";
import { IOCProvider } from "../ioc";
import { ROUTER_CHANGE_IOC_NAME } from "../setting";
import { map } from "rxjs/operators";
import { getPureUrl, queryparams } from "@ztwx/utils/lib/url";
let RouterChangeService = class RouterChangeService {
    constructor() {
        this.change = new Subject();
        this.historyHeap = [];
        this.historyHeapLength = 0;
        this.baseUrl = "/";
        this.routerMode = "history";
        this.immediateWatch = merge(of(1).pipe(map(() => this.currentPath)), this.change);
        this.initData();
        this.initHistoryHeap();
        window.addEventListener("popstate", e => {
            if (this.preventPopState)
                return (this.preventPopState = false);
            this.changeNext({
                targetPath: this.prePath || this.getPath(),
                type: "back",
                pageCount: 1,
            });
        });
        const pushState = history.pushState;
        const replaceState = history.replaceState;
        const go = history.go;
        history.go = (page) => {
            if (!page || page > 0)
                return;
            this.preventPopState = true;
            this.changeNext({
                targetPath: this.prePath || this.getPath(),
                type: "back",
                pageCount: Math.abs(page),
            });
            go.call(history, page);
        };
        history.pushState = (...args) => {
            this.changeNext({
                targetPath: this.getPath(args[2] || "/"),
                type: "advance",
                pageCount: 1,
            });
            pushState.call(history, ...args);
        };
        history.replaceState = (...args) => {
            this.changeNext({
                targetPath: this.getPath(args[2] || "/"),
                type: "replace",
                pageCount: 1,
            });
            replaceState.call(history, ...args);
        };
    }
    reLaunch({ path }) {
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
    setRouterMode(mode) {
        this.routerMode = mode;
        this.resetHistoryHeap();
    }
    getBaseUrlFromDom() {
        const baseDom = document.querySelector("base[href]");
        if (!baseDom)
            return "/";
        return baseDom.getAttribute("href");
    }
    setBaseUrl(url) {
        this.baseUrl = url;
    }
    getHistoryPath(url) {
        let matcher = url.match(/https?:\/\/.*?(\/.*$)/);
        if (!matcher)
            matcher = url.match(/^(\/.*)/);
        if (!matcher)
            return "/";
        const matcherPath = matcher[1];
        return this.cleanBaseUrl(matcherPath);
    }
    getHashPath(url) {
        const splitUrl = url.split("#");
        if (splitUrl.length < 2)
            return "";
        return splitUrl.slice(1).join("#");
    }
    getPath(url) {
        url = url || location.href;
        if (this.routerMode === "history") {
            return this.getHistoryPath(url);
        }
        else if (this.routerMode === "hash") {
            return this.getHashPath(url);
        }
    }
    cleanBaseUrl(path) {
        if (!this.baseUrl)
            return path;
        path = this.getPath(path);
        const baseUrlIndex = path.indexOf(this.baseUrl);
        return baseUrlIndex >= 0 ? path.slice(this.baseUrl.length - 1) : path;
    }
    hasHistory() {
        return this.historyHeapLength > 1;
    }
    getLastedPath() {
        return this.historyHeapLength
            ? this.historyHeap[this.historyHeapLength - 1]
            : undefined;
    }
    get prePath() {
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
    joinPath(path, { root, params }) {
        if (params) {
            const queryParams = queryparams.encode(params);
            if (queryParams)
                path += "?" + queryParams;
        }
        if (root)
            return path;
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
    changeNext(changeRoute) {
        const { type, targetPath } = changeRoute;
        if (type === "advance") {
            this.historyHeap.push(targetPath);
            this.historyHeapLength++;
        }
        else if (type === "replace") {
            if (this.historyHeapLength)
                this.historyHeap[this.historyHeapLength - 1] = targetPath;
        }
        else if (type === "back") {
            if (this.historyHeapLength > 1) {
                const maxHeapIndex = this.historyHeapLength - 1;
                const backCount = changeRoute.pageCount > maxHeapIndex
                    ? maxHeapIndex
                    : changeRoute.pageCount;
                this.historyHeap.pop();
                this.historyHeap.splice(maxHeapIndex - backCount + 1, backCount);
                this.historyHeapLength -= backCount;
                this.ensureFirstExists();
            }
            else {
                this.resetHistoryHeap();
                console.debug("No history heap to back");
            }
        }
        this.change.next(changeRoute);
    }
    back() {
        history.back();
    }
    go(count) {
        history.go(count);
    }
    push(path, opts = {}) {
        history.pushState(null, opts.title || "", this.joinPath(path, opts));
    }
    replace(path, opts = {}) {
        history.replaceState(null, opts.title || "", this.joinPath(path, opts));
    }
    popup(popState) {
        const currentPath = this.currentPath;
        const purePath = getPureUrl(currentPath);
        const params = queryparams.dencode(currentPath);
        this.push(purePath, { params: Object.assign(Object.assign({}, params), popState) });
    }
    tab(tabState) {
        const currentPath = this.currentPath, purePath = getPureUrl(currentPath), params = queryparams.dencode(currentPath);
        this.replace(purePath, { params: Object.assign(Object.assign({}, params), tabState) });
    }
};
RouterChangeService = __decorate([
    IOCProvider({
        name: ROUTER_CHANGE_IOC_NAME,
    })
], RouterChangeService);
export { RouterChangeService };
