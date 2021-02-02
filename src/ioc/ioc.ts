import { IOC_NAME, IOC_DICT_NAME } from "../setting";

class IOC {
  iocStore: Record<string, any> = {};
  constructor() {
    this.iocStore = (window as any)[IOC_DICT_NAME] =
      (window as any)[IOC_DICT_NAME] || {};
  }
  provide(
    iocServiceId: string,
    IocService: any,
    cover = false,
    handler?: (obj: any) => any,
  ) {
    //no rewrite if exists and not cover
    if (this.iocStore[iocServiceId] && !cover) return;

    this.iocStore[iocServiceId] = handler
      ? handler(IocService)
      : new IocService();
  }
  getService(iocServiceId: string): any {
    return this.iocStore[iocServiceId];
  }
}

const ioc: IOC = new IOC();
(window as any)[IOC_NAME] = ioc;

export { IOC, ioc };
