import { IOC_NAME, IOC_DICT_NAME } from "../setting";
class IOC {
    constructor() {
        this.iocStore = {};
        this.iocStore = window[IOC_DICT_NAME] =
            window[IOC_DICT_NAME] || {};
    }
    provide(iocServiceId, IocService, cover = false, handler) {
        //no rewrite if exists and not cover
        if (this.iocStore[iocServiceId] && !cover)
            return;
        this.iocStore[iocServiceId] = handler
            ? handler(IocService)
            : new IocService();
    }
    getService(iocServiceId) {
        return this.iocStore[iocServiceId];
    }
}
const ioc = new IOC();
window[IOC_NAME] = ioc;
export { IOC, ioc };
