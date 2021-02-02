import {
  VoyoComponent,
  VoyoEventEmitter,
  VoyoTemplateRef,
} from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { SETTING_IOC_NAME } from "../../setting";
import { IOCAutowired } from "../../ioc";
import {
  CoreSetting,
  PaginationParams,
  PaginationBehavior,
} from "../../core-setting.service";
import { RefeshComponent } from "../refresh/refresh.component";
import { CircleLoader } from "../utils/circle-loader";
import { ClassManage, ScrollListenerEvent } from "../../utils";
import { Observable } from "rxjs";
import { LoaderComponent } from "../loader/loader.component";
import { finalize } from "rxjs/operators";

@VoyoDor({
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
  styles: require("./pagination.webscss"),
})
export class PaginationComponent extends VoyoComponent {
  @VoyoInput({ name: "scrollContainer" }) set setScrollContainer(v: boolean) {
    this.classManage.toggleClass("__scroll", v);
  }
  @VoyoInput({}) errorImg: string;
  @VoyoInput({}) emptyImg: string;
  @VoyoInput({}) errorText: string;
  @VoyoInput({}) emptyText: string;
  @VoyoInput({}) downNoMoreText: string;
  @VoyoInput({}) downErrorText: string;
  @VoyoInput({ name: "useRefresh", defaultValue: false }) useRefresh: boolean;
  @VoyoInput({ defaultValue: 100 }) lowerThreshold: number;
  @IOCAutowired({ name: SETTING_IOC_NAME }) setting: CoreSetting;
  @VoyoInput({ name: "paginationFn" }) paginationFn: (
    params: PaginationParams,
  ) => Observable<any>;

  @VoyoTemplate({
    render(this: PaginationComponent) {
      return `<span>${this._downNoMoreText}</span>`;
    },
    tag: "div",
    className: "voyo-pagination-text-des",
  })
  downNoMoreTemplate: VoyoTemplateRef;

  @VoyoTemplate({
    render(this: PaginationComponent) {
      return `<span>${this._downErrorText}</span>`;
    },
    tag: "div",
    className: "voyo-pagination-text-des",
  })
  downErrorTemplate: VoyoTemplateRef;

  @VoyoTemplate({
    render(this: PaginationComponent) {
      return `
  <img src="${this._errorImg}" class="_image"/>
  <view class="_title">
    ${this._errorText}
  </view>
    `;
    },
    tag: "div",
    className: "voyo-figure",
    renderCallback(this: PaginationComponent, el: HTMLElement) {
      (el.querySelector("._image") as any).addEventListener("click", () => {
        this.initMethods.initDisplay();
      });
    },
  })
  errorTemplate: VoyoTemplateRef;

  @VoyoTemplate({
    render(this: PaginationComponent) {
      return `
    <img src="${this._emptyImg}" class="_image"/>
    <view class="_title">
    ${this._emptyText}
    </view>
      `;
    },
    tag: "div",
    className: "voyo-figure",
    renderCallback(this: PaginationComponent, el: HTMLElement) {
      (el.querySelector("._image") as any).addEventListener("click", () => {
        this.initMethods.initDisplay();
      });
    },
  })
  emptyTemplate: VoyoTemplateRef;
  classManage: ClassManage;
  pgEl: HTMLElement;
  refresher: RefeshComponent;
  circleLoader: CircleLoader = new CircleLoader();
  scrollContainer: HTMLElement;
  bottomAreaEl: HTMLElement;
  emptyEl: HTMLElement;
  errorEl: HTMLElement;
  initLoaderEl: LoaderComponent;
  bottomLoaderEl: LoaderComponent;
  _errorImg: string;
  _emptyImg: string;
  _errorText: string;
  _emptyText: string;
  _downNoMoreText: string;
  _downErrorText: string;
  currentPage = 1;
  triggerDown: boolean;
  created() {
    this.pgEl = this.shadowRoot.querySelector(".voyo-pagination");
    this.classManage = new ClassManage(this.pgEl);
    this.refresher = this.shadowRoot.querySelector("#refresher");
    this.refresher.defaultEffects = false;
    this.refresher.disabledScroll = true;

    this.refresher.addEventListener("refresherRefresh", (e: any) => {
      this.toRefresh(e.detail);
    });
    this.refresher.executeAfterConnected.execute(() => {
      this.scrollContainer = this.refresher.scrollContainer;
      this.handleScrollDown(this.refresher.listenScroll, this.scrollContainer);
    });
  }

  handleScrollDown(
    listenScrcoll: Observable<ScrollListenerEvent>,
    scrollContainer: HTMLElement,
  ) {
    let containerHeight: number = scrollContainer.offsetHeight;
    let thresholdDistance: number;
    listenScrcoll.subscribe(({ e, v }) => {
      if (this.initMethods.initExists || !this.initMethods.initComplete) return;
      thresholdDistance = scrollContainer.scrollHeight - containerHeight - v;
      if (
        thresholdDistance <= this.lowerThreshold &&
        !this.pullDownMethods.trigger
      ) {
        this.pullDownMethods.trigger = true;

        this.toPullDown();
      } else if (
        thresholdDistance > this.lowerThreshold &&
        this.pullDownMethods.trigger
      ) {
        this.pullDownMethods.trigger = false;
      }
    });
  }
  get isRunning() {
    return (
      this.initMethods.initExists ||
      this.refreshing ||
      this.pullDownMethods.loading
    );
  }
  initRefresh() {
    this.pullDownMethods.reset();
    this.initMethods.initDisplay();
  }
  initMethods = {
    initComplete: false,
    initExists: false,
    initDisplay: () => {
      this.initMethods.initExists = this.initLoaderEl.show = true;
      this.initMethods.initComplete = false;
      this.refresher.disabledScroll = true;
      const params: PaginationParams = {
        currentPage: this.currentPage = 1,
        behavior: "init",
      };
      this.paginationFn(params)
        .pipe(
          finalize(() => {
            this.initMethods.initRemove();
          }),
        )
        .subscribe(
          result => {
            const r = this.handlePaginationResult(params, result);
            if (r == "empty") {
              this.initMethods.errorRemove();
            } else if (r == "error") {
              this.initMethods.emptyRemove();
            } else {
              this.initMethods.errorRemove();
              this.initMethods.emptyRemove();
              this.initMethods.initComplete = true;
              this.refresher.disabledScroll = false;
            }
          },
          error => {
            this.handlePaginationError("init");
          },
        );
    },
    initRemove: () => {
      this.initMethods.initExists = this.initLoaderEl.show = false;
    },

    emptyExists: false,
    emptyDisplay: () => {
      if (this.initMethods.emptyExists) return;
      this.emptyTemplate.insert(this.emptyEl);
      this.initMethods.emptyExists = true;
    },
    emptyRemove: () => {
      if (!this.initMethods.emptyExists) return;
      this.emptyTemplate.remove();
      this.initMethods.emptyExists = false;
    },

    errorExists: false,
    errorDisplay: () => {
      if (this.initMethods.errorExists) return;
      this.errorTemplate.insert(this.errorEl);
      this.initMethods.errorExists = true;
    },
    errorRemove: () => {
      if (!this.initMethods.errorExists) return;
      this.errorTemplate.remove();
      this.initMethods.errorExists = false;
    },
  };

  refreshing = false;
  toRefresh(refreshRestore: () => void) {
    if (this.isRunning) return refreshRestore();
    this.refreshing = true;
    this.pullDownMethods.reset();
    const params: PaginationParams = {
      currentPage: 1,
      behavior: "refresh",
    };
    this.paginationFn(params)
      .pipe(
        finalize(() => {
          refreshRestore();
          this.refreshing = false;
        }),
      )
      .subscribe(
        (result: any) => {
          if (this.handlePaginationResult(params, result)) {
            this.currentPage = 1;
          }
        },
        err => this.handlePaginationError("refresh"),
      );
  }
  handlePaginationResult(params: PaginationParams, result: any): string {
    const setting = this.setting.pgSetting;
    if (setting.isEmpty(params, result)) {
      this.initMethods.emptyDisplay();
      return "empty";
    } else if (setting.isEnd(params, result)) {
      //clean
      this.pullDownMethods.loadEnd();
      return "end";
    } else if (setting.isError(params, result)) {
      this.initMethods.emptyRemove();

      this.handlePaginationError(params.behavior);
      return "error";
    } else {
      if (params.behavior === "down") this.pullDownMethods.loadSuccess();
      return "true";
    }
  }
  handlePaginationError(type: PaginationBehavior) {
    if (type === "init") {
      this.initMethods.errorDisplay();
    } else if (type === "down") {
      this.pullDownMethods.loadError();
    } else if (type === "refresh") {
      console.debug("pagination refresh error");
    }
  }

  pullDownMethods = {
    hasError: false,
    hasEnd: false,
    loading: false, //loading
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
      if (this.isRunning || this.pullDownMethods.hasEnd) return;
      this.pullDownMethods.loading = true;
      if (this.pullDownMethods.hasError) {
        this.downErrorTemplate.remove();
        this.pullDownMethods.hasError = false;
      }
      this.bottomLoaderEl.show = true;
      const params: PaginationParams = {
        currentPage: this.currentPage + 1,
        behavior: "down",
      };

      this.paginationFn(params)
        .pipe(finalize(() => (this.pullDownMethods.loading = false)))
        .subscribe(
          (result: any) => {
            this.handlePaginationResult(params, result);
          },
          err => this.handlePaginationError("down"),
        );
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
    this.bottomAreaEl = this.shadowRoot.querySelector(
      ".voyo-pagination-bottom-area",
    );
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
      this.refresher.refreshAnimation.percentEvent.subscribe(
        ({ triggerDistancePercent }) => {
          this.circleLoader.drawSrcByPercent(triggerDistancePercent);
        },
      );
      this.refresher.refreshTriggerSubject.subscribe(isTrigger => {
        if (isTrigger) {
          svgEl.parentElement && svgEl.parentElement.removeChild(svgEl);
          svgContainer.appendChild(svgLoaderEl);
        } else {
          svgLoaderEl.parentElement &&
            svgLoaderEl.parentElement.removeChild(svgLoaderEl);
          svgContainer.appendChild(svgEl);
        }
      });
    };
    if (this.refresher.voyoConnectCompleted) {
      run();
    } else {
      this.refresher.voyoConnected.subscribe(() => run());
    }
  }
}
