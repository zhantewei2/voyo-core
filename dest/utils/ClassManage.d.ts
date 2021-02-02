export declare class ClassManage {
    el: HTMLElement;
    store: Record<string, string | undefined>;
    hisStore: Record<string, string | undefined>;
    constructor(el: HTMLElement);
    replaceClass(key: string, value: string): void;
    replaceHis(key: string, value: string): void;
    replaceHisBack(key: string): void;
    toggleClass(key: string, show: boolean): void;
}
