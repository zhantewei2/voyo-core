import { VoyoComponent } from "../commonComponent";
import { RouterChangeService } from "../../router";
import { ClassManage, AnimationDisplay } from "../../utils";
import { Subscription } from "rxjs";
declare type AutoTransitionType = "whiteToDark";
declare type AutoTransitionOptions = "whiteToDark" | boolean | "true" | 1;
export declare class PageHeaderComponent extends VoyoComponent {
    set autoBack(v: boolean);
    routerChange: RouterChangeService;
    /**
     * if use autoTransition
     * voyoc-page-content must be full
     * @param v
     */
    autoTransition: AutoTransitionOptions;
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
    routerChangeOrder: Subscription;
    switchAutoTransitionType(type: AutoTransitionOptions): void;
    created(): void;
    backBtnIsShow: boolean;
    showBackBtn(show: boolean): void;
    autoTransitionIsOpen: boolean;
    autoTransitionIsInit: boolean;
    autoTransitionOpen(): void;
    autoTransitionStrict(): void;
    autoTransitionOpenSlot(): void;
    autoTransitionHiddenSlot(): void;
    disconnectedCallback(): void;
    mounted(): void;
    checkAutoTransition(): void;
}
export {};
