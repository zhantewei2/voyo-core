import { Subject } from "rxjs";
export declare type visualInputType = "text" | "number" | "password";
export declare class InputInterface {
    onInput: Subject<any>;
    onFocus: Subject<void>;
    onBlur: Subject<void>;
    onKeypress: Subject<number>;
    toFocus: () => void;
    toBlur: () => void;
    setValue: (v: any) => void;
    setType: (type: visualInputType) => void;
    getInputEl: () => HTMLElement;
    disabled?: boolean;
    destroy?: () => void;
}
export declare class Input implements InputInterface {
    inputEl: HTMLInputElement;
    constructor();
    _disabled: boolean;
    set disabled(v: boolean);
    onInput: Subject<any>;
    onFocus: Subject<any>;
    onBlur: Subject<any>;
    onKeypress: Subject<number>;
    toFocus(): void;
    toBlur(): void;
    setValue(v: any): void;
    setType(type: visualInputType): void;
    getInputEl(): HTMLInputElement;
}
