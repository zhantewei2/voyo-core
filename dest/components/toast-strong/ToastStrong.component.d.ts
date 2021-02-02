import { VoyoComponent } from "../commonComponent";
import { CoreSetting } from "../../core-setting.service";
import { AnimationDisplay } from "../../utils";
export declare type ToastStrongType = "load" | "completed" | "lose";
export declare const toastStrongTypeImage: Record<ToastStrongType, string>;
export interface ToastStrongOpenOpts {
    message?: string;
    type?: ToastStrongType;
    durationTime?: number;
}
export declare class ToastStrongComponent extends VoyoComponent {
    coreSetting: CoreSetting;
    container: HTMLElement;
    main: HTMLElement;
    footerContent: HTMLElement;
    articleImg: HTMLImageElement;
    imgSource0: any;
    set imgSource(v: any);
    footerHtmlContent0: string | undefined;
    displayAnimate: AnimationDisplay;
    set footerHtmlContent(htmlText: string | undefined);
    _footerDisplay: boolean;
    set footerDisplay(v: boolean);
    created(): void;
    open({ message, type, durationTime }: ToastStrongOpenOpts): void;
    close(): void;
    autoClose: any;
    setAutoClose(timeout: number): void;
    clearAutoClose(): void;
}
