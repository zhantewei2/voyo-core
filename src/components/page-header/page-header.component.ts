import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import "./page-header.scss";
import { IOCAutowired } from "@voyo/core/ioc";
import { RouterChangeService } from "@voyo/core/router";
import { ROUTER_CHANGE_IOC_NAME } from "../../setting";
import backSvg from "./back.svg";
import {
  findParentByComponentName,
  ClassManage,
  Animation,
  AnimationDisplay,
} from "../../utils";

const headerHeight = 50;

type AutoTransitionType = "whiteToDark";
type AutoTransitionOptions = "whiteToDark" | boolean | "true" | 1;

@VoyoDor({
  name: "voyo-header",
  template: `
<div class="voyo-page-header-wrapper" style="height:${headerHeight + "px"}">
    <div class="left">
        <div color="primary" class="back-btn">
            <img class="back-img" src="${backSvg}" alt="">
        </div>
    </div>
    <div class="title">
        <div id="voyo-header-title-content" class="title-content">
            <slot></slot>
        </div>
        <div id="voyo-header-title-content-open" class="title-content">
            <slot name="autoTransition-open"></slot>
        </div>
    </div>
    <div class="right">
        <slot name="right"></slot>
    </div>
</div>
  `,
  styles: require("./page-header.webscss"),
})
export class PageHeaderComponent extends VoyoComponent {
  @VoyoInput({}) set autoBack(v: boolean) {
    if (!v) {
      if (this.headerBackEl) this.headerBackEl.style.display = "none";
    }
  }
  @IOCAutowired({ name: ROUTER_CHANGE_IOC_NAME })
  routerChange: RouterChangeService;
  /**
   * if use autoTransition
   * voyoc-page-content must be full
   * @param v
   */
  @VoyoInput({}) autoTransition: AutoTransitionOptions;
  autoTransitionType: AutoTransitionType;
  pageEl: any;
  headerBackEl: HTMLElement;
  headerWrapper: HTMLElement;
  headerWrapperManage: ClassManage;
  headerContentTitle: HTMLElement;
  headerContentTitleOpen: HTMLElement;
  headerContentTitleAn: AnimationDisplay;
  headerContentTitleOpenAn: AnimationDisplay;
  autoTransitionBlockExists: boolean;
  switchAutoTransitionType(type: AutoTransitionOptions) {
    if (!type) return;
    if (type === true || type === "true" || type === 1) {
      this.autoTransitionType = "whiteToDark";
    } else {
      this.autoTransitionType = type;
    }
    this.headerWrapperManage.replaceClass(
      "autoTransitionType",
      this.autoTransitionType,
    );
  }
  created() {
    this.headerWrapper = this.shadowRoot.querySelector(
      ".voyo-page-header-wrapper",
    );
    this.headerWrapperManage = new ClassManage(this);
    this.headerBackEl = this.headerWrapper.querySelector(
      ".back-btn",
    ) as HTMLElement;
    this.headerContentTitle = this.headerWrapper.querySelector(
      "#voyo-header-title-content",
    ) as any;
    this.headerContentTitleOpen = this.headerWrapper.querySelector(
      "#voyo-header-title-content-open",
    ) as any;
    this.headerContentTitleAn = new AnimationDisplay(
      this.headerContentTitle,
      "voyo-animation-fade",
      "flex",
    );
    this.headerContentTitleOpenAn = new AnimationDisplay(
      this.headerContentTitleOpen,
      "voyo-animation-fade",
      "flex",
    );
    this.routerChange.immediateWatch.subscribe(() => {
      this.showBackBtn(this.routerChange.hasHistory());
    });
    this.headerBackEl.addEventListener("click", () => {
      this.routerChange.back();
    });
  }
  backBtnIsShow: boolean;
  showBackBtn(show: boolean) {
    if (show == this.backBtnIsShow) return;
    this.headerBackEl.style.display = show ? "inline-block" : "none";
    this.backBtnIsShow = show;
  }
  autoTransitionIsOpen = false;
  autoTransitionIsInit = false;
  autoTransitionOpen() {
    if (this.autoTransitionIsOpen && this.autoTransitionIsInit) return;
    this.headerWrapperManage.replaceClass(
      "autoTransitionValue",
      "autoTransition-open",
    );
    this.autoTransitionIsOpen = true;
    this.autoTransitionIsInit = true;
    if (this.autoTransitionBlockExists) this.autoTransitionOpenSlot();
  }
  autoTransitionStrict() {
    if (!this.autoTransitionIsOpen && this.autoTransitionIsInit) return;
    this.headerWrapperManage.replaceClass(
      "autoTransitionValue",
      "autoTransition-strict",
    );
    this.autoTransitionIsOpen = false;
    this.autoTransitionIsInit = true;
    if (this.autoTransitionBlockExists) this.autoTransitionHiddenSlot();
  }
  autoTransitionOpenSlot() {
    this.headerContentTitleOpenAn.open();
    this.headerContentTitleAn.close();
  }
  autoTransitionHiddenSlot() {
    this.headerContentTitleOpenAn.close();
    this.headerContentTitleAn.open();
  }
  mounted() {
    this.classList.add("voyo-page-header");
    /**
     * registry to page
     */
    this.pageEl = findParentByComponentName(this, "voyo-page");
    if (this.pageEl) {
      this.pageEl.childHeader = this;
    }
    /**
     * scroll
     */
    this.checkAutoTransition();
  }
  checkAutoTransition() {
    const v = this.autoTransition;
    v
      ? this.classList.add("autoTransition")
      : this.classList.remove("autoTransition");
    if (v) {
      this.switchAutoTransitionType(v);
      setTimeout(() => {
        let pageContentEl: any;
        if (!this.pageEl || !(pageContentEl = this.pageEl.childContent))
          throw new Error("Not found page or page-content");
        pageContentEl.listenerScroll().subscribe((scrollTop: number) => {
          scrollTop >= headerHeight
            ? this.autoTransitionOpen()
            : this.autoTransitionStrict();
        });
      });
    }
    this.autoTransitionBlockExists = !!this.querySelector(
      "[slot=autoTransition-open]",
    );
    if (!this.autoTransitionBlockExists) {
      this.headerContentTitle.classList.add("show");
    }
  }
}
