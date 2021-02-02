import { __decorate } from "tslib";
import { VoyoComponent, } from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { SETTING_IOC_NAME } from "../../setting";
import { IOCAutowired } from "../../ioc";
import { CircleLoader } from "../utils/circle-loader";
import { ClassManage } from "../../utils";
import { finalize } from "rxjs/operators";
let PaginationComponent = class PaginationComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.circleLoader = new CircleLoader();
        this.currentPage = 1;
        this.initMethods = {
            initComplete: false,
            initExists: false,
            initDisplay: () => {
                this.initMethods.initExists = this.initLoaderEl.show = true;
                this.initMethods.initComplete = false;
                this.refresher.disabledScroll = true;
                const params = {
                    currentPage: this.currentPage = 1,
                    behavior: "init",
                };
                this.paginationFn(params)
                    .pipe(finalize(() => {
                    this.initMethods.initRemove();
                }))
                    .subscribe(result => {
                    const r = this.handlePaginationResult(params, result);
                    if (r == "empty") {
                        this.initMethods.errorRemove();
                    }
                    else if (r == "error") {
                        this.initMethods.emptyRemove();
                    }
                    else {
                        this.initMethods.errorRemove();
                        this.initMethods.emptyRemove();
                        this.initMethods.initComplete = true;
                        this.refresher.disabledScroll = false;
                    }
                }, error => {
                    this.handlePaginationError("init");
                });
            },
            initRemove: () => {
                this.initMethods.initExists = this.initLoaderEl.show = false;
            },
            emptyExists: false,
            emptyDisplay: () => {
                if (this.initMethods.emptyExists)
                    return;
                this.emptyTemplate.insert(this.emptyEl);
                this.initMethods.emptyExists = true;
            },
            emptyRemove: () => {
                if (!this.initMethods.emptyExists)
                    return;
                this.emptyTemplate.remove();
                this.initMethods.emptyExists = false;
            },
            errorExists: false,
            errorDisplay: () => {
                if (this.initMethods.errorExists)
                    return;
                this.errorTemplate.insert(this.errorEl);
                this.initMethods.errorExists = true;
            },
            errorRemove: () => {
                if (!this.initMethods.errorExists)
                    return;
                this.errorTemplate.remove();
                this.initMethods.errorExists = false;
            },
        };
        this.refreshing = false;
        this.pullDownMethods = {
            hasError: false,
            hasEnd: false,
            loading: false,
            trigger: false,
            reset: () => {
                if (this.pullDownMethods.hasError) {
                    this.downErrorTemplate.remove();
                    this.pullDownMethods.hasError = false;
                }
                if (this.pullDownMethods.hasEnd) {
                    this.downNoMoreTemplate.remove();
                    this.pullDownMethods.hasEnd = false;
                }
            },
            load: () => {
                if (this.isRunning || this.pullDownMethods.hasEnd)
                    return;
                this.pullDownMethods.loading = true;
                if (this.pullDownMethods.hasError) {
                    this.downErrorTemplate.remove();
                    this.pullDownMethods.hasError = false;
                }
                this.bottomLoaderEl.show = true;
                const params = {
                    currentPage: this.currentPage + 1,
                    behavior: "down",
                };
                this.paginationFn(params)
                    .pipe(finalize(() => (this.pullDownMethods.loading = false)))
                    .subscribe((result) => {
                    this.handlePaginationResult(params, result);
                }, err => this.handlePaginationError("down"));
            },
            loadSuccess: () => {
                this.pullDownMethods.loading = this.bottomLoaderEl.show = false;
                this.currentPage++;
            },
            loadError: () => {
                this.pullDownMethods.loading = this.bottomLoaderEl.show = false;
                this.pullDownMethods.hasError = false;
                this.downErrorTemplate.insert(this.bottomAreaEl);
            },
            loadEnd: () => {
                this.pullDownMethods.loading = this.bottomLoaderEl.show = false;
                this.pullDownMethods.hasEnd = true;
                this.downNoMoreTemplate.insert(this.bottomAreaEl);
            },
        };
    }
    set setScrollContainer(v) {
        this.classManage.toggleClass("__scroll", v);
    }
    created() {
        this.pgEl = this.shadowRoot.querySelector(".voyo-pagination");
        this.classManage = new ClassManage(this.pgEl);
        this.refresher = this.shadowRoot.querySelector("#refresher");
        this.refresher.defaultEffects = false;
        this.refresher.disabledScroll = true;
        this.refresher.addEventListener("refresherRefresh", (e) => {
            this.toRefresh(e.detail);
        });
        this.refresher.executeAfterConnected.execute(() => {
            this.scrollContainer = this.refresher.scrollContainer;
            this.handleScrollDown(this.refresher.listenScroll, this.scrollContainer);
        });
    }
    handleScrollDown(listenScrcoll, scrollContainer) {
        let containerHeight = scrollContainer.offsetHeight;
        let thresholdDistance;
        listenScrcoll.subscribe(({ e, v }) => {
            if (this.initMethods.initExists || !this.initMethods.initComplete)
                return;
            thresholdDistance = scrollContainer.scrollHeight - containerHeight - v;
            if (thresholdDistance <= this.lowerThreshold &&
                !this.pullDownMethods.trigger) {
                this.pullDownMethods.trigger = true;
                this.toPullDown();
            }
            else if (thresholdDistance > this.lowerThreshold &&
                this.pullDownMethods.trigger) {
                this.pullDownMethods.trigger = false;
            }
        });
    }
    get isRunning() {
        return (this.initMethods.initExists ||
            this.refreshing ||
            this.pullDownMethods.loading);
    }
    initRefresh() {
        this.pullDownMethods.reset();
        this.initMethods.initDisplay();
    }
    toRefresh(refreshRestore) {
        if (this.isRunning)
            return refreshRestore();
        this.refreshing = true;
        this.pullDownMethods.reset();
        const params = {
            currentPage: 1,
            behavior: "refresh",
        };
        this.paginationFn(params)
            .pipe(finalize(() => {
            refreshRestore();
            this.refreshing = false;
        }))
            .subscribe((result) => {
            if (this.handlePaginationResult(params, result)) {
                this.currentPage = 1;
            }
        }, err => this.handlePaginationError("refresh"));
    }
    handlePaginationResult(params, result) {
        const setting = this.setting.pgSetting;
        if (setting.isEmpty(params, result)) {
            this.initMethods.emptyDisplay();
            return "empty";
        }
        else if (setting.isEnd(params, result)) {
            //clean
            this.pullDownMethods.loadEnd();
            return "end";
        }
        else if (setting.isError(params, result)) {
            this.initMethods.emptyRemove();
            this.handlePaginationError(params.behavior);
            return "error";
        }
        else {
            if (params.behavior === "down")
                this.pullDownMethods.loadSuccess();
            return "true";
        }
    }
    handlePaginationError(type) {
        if (type === "init") {
            this.initMethods.errorDisplay();
        }
        else if (type === "down") {
            this.pullDownMethods.loadError();
        }
        else if (type === "refresh") {
            console.debug("pagination refresh error");
        }
    }
    toPullDown() {
        this.pullDownMethods.load();
    }
    handlerResource() {
        const pgSetting = this.setting.pgSetting;
        this._errorImg = this.errorImg || pgSetting.errorImg;
        this._errorText = this.errorText || pgSetting.errorText;
        this._emptyImg = this.emptyImg || pgSetting.emptyImg;
        this._emptyText = this.emptyText || pgSetting.emptyText;
        this._downNoMoreText = this.downNoMoreText || pgSetting.downNoMoreText;
        this._downErrorText = this.downErrorText || pgSetting.downErrorText;
    }
    entryStart() {
        this.initMethods.initDisplay();
    }
    mounted() {
        this.bottomLoaderEl = this.shadowRoot.querySelector("#bottom-loader");
        this.bottomAreaEl = this.shadowRoot.querySelector(".voyo-pagination-bottom-area");
        this.emptyEl = this.shadowRoot.querySelector(".voyo-pagination-empty");
        this.errorEl = this.shadowRoot.querySelector(".voyo-pagination-error");
        this.initLoaderEl = this.shadowRoot.querySelector("#init-loader");
        this.initLoaderEl.absCenter = true;
        this.initLoaderEl.size = "mini";
        this.bottomLoaderEl.size = "mini";
        this.handlerResource();
        this.handleRefreshSvg();
        this.bottomAreaEl.addEventListener("click", () => {
            if (this.pullDownMethods.hasError) {
                this.toPullDown();
            }
        });
        this.entryStart();
    }
    handleRefreshSvg() {
        const svgContainer = this.shadowRoot.querySelector(".voyo-svg-container");
        this.circleLoader.render();
        const svgEl = this.circleLoader.getSvg();
        const svgLoaderEl = this.circleLoader.getSvgLoader();
        svgContainer.appendChild(svgEl);
        const run = () => {
            this.refresher.refreshAnimation.percentEvent.subscribe(({ triggerDistancePercent }) => {
                this.circleLoader.drawSrcByPercent(triggerDistancePercent);
            });
            this.refresher.refreshTriggerSubject.subscribe(isTrigger => {
                if (isTrigger) {
                    svgEl.parentElement && svgEl.parentElement.removeChild(svgEl);
                    svgContainer.appendChild(svgLoaderEl);
                }
                else {
                    svgLoaderEl.parentElement &&
                        svgLoaderEl.parentElement.removeChild(svgLoaderEl);
                    svgContainer.appendChild(svgEl);
                }
            });
        };
        if (this.refresher.voyoConnectCompleted) {
            run();
        }
        else {
            this.refresher.voyoConnected.subscribe(() => run());
        }
    }
};
__decorate([
    VoyoInput({ name: "scrollContainer" })
], PaginationComponent.prototype, "setScrollContainer", null);
__decorate([
    VoyoInput({})
], PaginationComponent.prototype, "errorImg", void 0);
__decorate([
    VoyoInput({})
], PaginationComponent.prototype, "emptyImg", void 0);
__decorate([
    VoyoInput({})
], PaginationComponent.prototype, "errorText", void 0);
__decorate([
    VoyoInput({})
], PaginationComponent.prototype, "emptyText", void 0);
__decorate([
    VoyoInput({})
], PaginationComponent.prototype, "downNoMoreText", void 0);
__decorate([
    VoyoInput({})
], PaginationComponent.prototype, "downErrorText", void 0);
__decorate([
    VoyoInput({ name: "useRefresh", defaultValue: false })
], PaginationComponent.prototype, "useRefresh", void 0);
__decorate([
    VoyoInput({ defaultValue: 100 })
], PaginationComponent.prototype, "lowerThreshold", void 0);
__decorate([
    IOCAutowired({ name: SETTING_IOC_NAME })
], PaginationComponent.prototype, "setting", void 0);
__decorate([
    VoyoInput({ name: "paginationFn" })
], PaginationComponent.prototype, "paginationFn", void 0);
__decorate([
    VoyoTemplate({
        render() {
            return `<span>${this._downNoMoreText}</span>`;
        },
        tag: "div",
        className: "voyo-pagination-text-des",
    })
], PaginationComponent.prototype, "downNoMoreTemplate", void 0);
__decorate([
    VoyoTemplate({
        render() {
            return `<span>${this._downErrorText}</span>`;
        },
        tag: "div",
        className: "voyo-pagination-text-des",
    })
], PaginationComponent.prototype, "downErrorTemplate", void 0);
__decorate([
    VoyoTemplate({
        render() {
            return `
  <img src="${this._errorImg}" class="_image"/>
  <view class="_title">
    ${this._errorText}
  </view>
    `;
        },
        tag: "div",
        className: "voyo-figure",
        renderCallback(el) {
            el.querySelector("._image").addEventListener("click", () => {
                this.initMethods.initDisplay();
            });
        },
    })
], PaginationComponent.prototype, "errorTemplate", void 0);
__decorate([
    VoyoTemplate({
        render() {
            return `
    <img src="${this._emptyImg}" class="_image"/>
    <view class="_title">
    ${this._emptyText}
    </view>
      `;
        },
        tag: "div",
        className: "voyo-figure",
        renderCallback(el) {
            el.querySelector("._image").addEventListener("click", () => {
                this.initMethods.initDisplay();
            });
        },
    })
], PaginationComponent.prototype, "emptyTemplate", void 0);
PaginationComponent = __decorate([
    VoyoDor({
        template: `
<div class="voyo-pagination">
    <voyoc-loader id="init-loader"></voyoc-loader>
    <voyoc-refresh id="refresher" effects="0">
        <div slot="refresher">
            <div class="voyo-svg-container"></div>
        </div>
        <slot></slot>
        <div class="voyo-pagination-bottom-area">
            <voyoc-loader id="bottom-loader"></voyoc-loader>
        </div>
    </voyoc-refresh>
    <div class="voyo-pagination-empty">
    
    </div>
    <div class="voyo-pagination-error">
      
    </div>
</div>
  `,
        styles: '.voyo-figure{display:flex;justify-content:center;flex-flow:column;padding:2.2rem 1rem 2rem}.voyo-figure ._image{width:8em;height:8em;margin:0 auto}.voyo-figure ._title{font-size:var(--size-small);color:var(--color-font-content)}.voyo-figure ._content,.voyo-figure ._title{padding:1rem;text-align:center}.voyo-pagination{z-index:1}.voyo-pagination.__scroll{position:absolute;top:0;left:0;width:100%;height:100%;overflow-x:hidden}.voyo-svg-container svg{width:50px}.voyo-pagination-bottom-area{width:100%;display:none;height:50px;display:flex;justify-content:center;align-items:center}.voyo-pagination-text-des{font-size:var(--size-mini)!important;color:var(--color-font-des)}',
    })
], PaginationComponent);
export { PaginationComponent };
