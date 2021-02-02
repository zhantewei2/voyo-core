import { IOCProvider } from "./ioc";
import { SETTING_IOC_NAME } from "./setting";

export type PaginationBehavior = "down" | "refresh" | "init";

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

@IOCProvider({ name: SETTING_IOC_NAME })
export class CoreSetting {
  tapTime = 100;
  toastStrongDurationTime = 1500;
  toastStrongTypeDefault: any = "load";
  pgSetting: PaginationSetting<any>;
  loadImg = "";
}
