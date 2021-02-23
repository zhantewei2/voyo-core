import { __decorate } from "tslib";
import { VoyoComponent } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { IOCAutowired } from "../../ioc";
import { ROUTER_CHANGE_IOC_NAME } from "../../setting";
import { CaRMfIR as backSvg } from "../../svg.js";
import { findParentByComponentName, ClassManage, AnimationDisplay, } from "../../utils";
const headerHeight = 50;
let PageHeaderComponent = class PageHeaderComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.autoTransitionIsOpen = false;
        this.autoTransitionIsInit = false;
    }
    set autoBack(v) {
        if (!v) {
            if (this.headerBackEl)
                this.headerBackEl.style.display = "none";
        }
    }
    switchAutoTransitionType(type) {
        if (!type)
            return;
        if (type === true || type === "true" || type === 1) {
            this.autoTransitionType = "whiteToDark";
        }
        else {
            this.autoTransitionType = type;
        }
        this.headerWrapperManage.replaceClass("autoTransitionType", this.autoTransitionType);
    }
    created() {
        this.headerWrapper = this.shadowRoot.querySelector(".voyo-page-header-wrapper");
        this.headerWrapperManage = new ClassManage(this);
        this.headerBackEl = this.headerWrapper.querySelector(".back-btn");
        this.headerContentTitle = this.headerWrapper.querySelector("#voyo-header-title-content");
        this.headerContentTitleOpen = this.headerWrapper.querySelector("#voyo-header-title-content-open");
        this.headerContentTitleAn = new AnimationDisplay(this.headerContentTitle, "voyo-animation-fade", "flex");
        this.headerContentTitleOpenAn = new AnimationDisplay(this.headerContentTitleOpen, "voyo-animation-fade", "flex");
        this.routerChangeOrder = this.routerChange.immediateWatch.subscribe(() => {
            this.showBackBtn(this.routerChange.hasHistory());
        });
        this.headerBackEl.addEventListener("click", () => {
            this.routerChange.back();
        });
    }
    showBackBtn(show) {
        if (show == this.backBtnIsShow)
            return;
        this.headerBackEl.style.display = show ? "inline-block" : "none";
        this.backBtnIsShow = show;
    }
    autoTransitionOpen() {
        if (this.autoTransitionIsOpen && this.autoTransitionIsInit)
            return;
        this.headerWrapperManage.replaceClass("autoTransitionValue", "autoTransition-open");
        this.autoTransitionIsOpen = true;
        this.autoTransitionIsInit = true;
        if (this.autoTransitionBlockExists)
            this.autoTransitionOpenSlot();
    }
    autoTransitionStrict() {
        if (!this.autoTransitionIsOpen && this.autoTransitionIsInit)
            return;
        this.headerWrapperManage.replaceClass("autoTransitionValue", "autoTransition-strict");
        this.autoTransitionIsOpen = false;
        this.autoTransitionIsInit = true;
        if (this.autoTransitionBlockExists)
            this.autoTransitionHiddenSlot();
    }
    autoTransitionOpenSlot() {
        this.headerContentTitleOpenAn.open();
        this.headerContentTitleAn.close();
    }
    autoTransitionHiddenSlot() {
        this.headerContentTitleOpenAn.close();
        this.headerContentTitleAn.open();
    }
    disconnectedCallback() {
        this.routerChangeOrder.unsubscribe();
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
                let pageContentEl;
                if (!this.pageEl || !(pageContentEl = this.pageEl.childContent))
                    throw new Error("Not found page or page-content");
                pageContentEl.listenerScroll().subscribe((scrollTop) => {
                    scrollTop >= headerHeight
                        ? this.autoTransitionOpen()
                        : this.autoTransitionStrict();
                });
            });
        }
        this.autoTransitionBlockExists = !!this.querySelector("[slot=autoTransition-open]");
        if (!this.autoTransitionBlockExists) {
            this.headerContentTitle.classList.add("show");
        }
    }
};
__decorate([
    VoyoInput({})
], PageHeaderComponent.prototype, "autoBack", null);
__decorate([
    IOCAutowired({ name: ROUTER_CHANGE_IOC_NAME })
], PageHeaderComponent.prototype, "routerChange", void 0);
__decorate([
    VoyoInput({})
], PageHeaderComponent.prototype, "autoTransition", void 0);
PageHeaderComponent = __decorate([
    VoyoDor({
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
        styles: '.voyo-page-header-wrapper{display:flex}.voyo-page-header-wrapper .left,.voyo-page-header-wrapper .right{width:25%;display:inline-flex;align-items:center;padding:0 .5rem}.voyo-page-header-wrapper .title{display:inline-flex;justify-content:center;align-items:center;text-align:center;flex:auto;position:relative}.voyo-page-header-wrapper .title-content{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;display:none}.voyo-page-header-wrapper .title-content.show{display:flex}.voyo-page-header-wrapper .back-img{height:1.2rem}.voyo-page-header-wrapper .voyo-header-title-content-open{display:none}.voyo-animation-fade-enter{opacity:0;transform:translate3d(0,-10%,0)}.voyo-animation-fade-enter-active{transition:all .3s ease}.voyo-animation-fade-enter-to{opacity:1}.voyo-animation-fade-leave-active{opacity:0;transform:translate3d(0,-10%,0);transition:all .3s ease}',
    })
], PageHeaderComponent);
export { PageHeaderComponent };
