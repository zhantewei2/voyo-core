import { VoyoComponent } from "../commonComponent";
import "./page-header.scss";
import { RouterChangeService } from "@voyo/core/router";
import { ClassManage, AnimationDisplay } from "../../utils";
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
    mounted(): void;
    checkAutoTransition(): void;
}
export {};
