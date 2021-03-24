import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { ClassManage } from "../../utils";
import { AnimationDisplay } from "../../utils/animation/AnimationSimple";
export interface DialogOpenOpts {
    header?: string;
    html?: string | HTMLElement;
}
export declare class DialogComponent extends VoyoComponent {
    set headerString(v: string);
    set confirmText(v: string);
    set cancelText(v: string);
    set doubleConfirm(v: number);
    set disableConfirm(v: number);
    disableCancel: boolean;
    disableAutoClose: boolean;
    confirmEvent: VoyoEventEmitter<any>;
    cancelEvent: VoyoEventEmitter<any>;
    open(opts: DialogOpenOpts): void;
    close(): void;
    container: HTMLElement;
    dialog: HTMLElement;
    dialogBg: HTMLElement;
    header: HTMLElement;
    footer: HTMLElement;
    dialogConfirm: HTMLElement;
    dialogCancel: HTMLElement;
    dialogIsConnected: boolean;
    connectedQueue: any[];
    classManage: ClassManage;
    displayAnimation: AnimationDisplay;
    created(): void;
    cancel(): void;
    confirm(): void;
    mounted(): void;
}
