export interface RippleOpts {
    deep?: boolean;
    size?: number;
    css?: string;
    autoSize?: boolean;
    disabled?: boolean;
}
export declare const autoSizeByWidth: (el: HTMLElement, defaultSize?: number) => number;
export declare const handleRipple: (el: HTMLElement, opts: RippleOpts) => void;
