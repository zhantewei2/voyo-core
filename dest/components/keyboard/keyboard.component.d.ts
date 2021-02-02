import { VoyoComponent, VoyoEventEmitter, VoyoTemplateRef } from "../commonComponent";
import { ExcuteAfterConnected } from "../utils";
import { ClassManage } from "../../utils";
export interface KeyItem {
    value: string | number;
    svg?: string;
}
export declare class KeyboardComponent extends VoyoComponent {
    useDot: boolean;
    set useEnter(v: boolean);
    value0: string;
    set value(v: string);
    keyPress: VoyoEventEmitter<number | string>;
    valueChange: VoyoEventEmitter<string>;
    keyboardTemplate: VoyoTemplateRef;
    executeAfterContentInit: ExcuteAfterConnected;
    keyBoardInserted: boolean;
    container: HTMLElement;
    keyboardContent: HTMLElement;
    sureBtnEl: HTMLButtonElement;
    keyboardContentManage: ClassManage;
    keys: KeyItem[][];
    created(): void;
    listenKeyTouch(btns: HTMLButtonElement[]): void;
    handleValue(key: string): void;
    insertInBody: boolean;
    show(): void;
    hide(): void;
    restoreBody: boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
