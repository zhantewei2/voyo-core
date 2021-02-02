export declare type PaginationBehavior = "down" | "refresh" | "init";
export interface PaginationParams {
    currentPage: number;
    behavior: PaginationBehavior;
}
export interface PaginationSetting<Result> {
    isEnd: (p: PaginationParams, r: Result) => boolean;
    isEmpty: (p: PaginationParams, r: Result) => boolean;
    isError: (p: PaginationParams, r: Result) => boolean;
    errorImg: string;
    emptyImg: string;
    errorText: string;
    emptyText: string;
    downNoMoreText: string;
    downErrorText: string;
}
export declare class CoreSetting {
    tapTime: number;
    toastStrongDurationTime: number;
    toastStrongTypeDefault: any;
    pgSetting: PaginationSetting<any>;
    loadImg: string;
}
