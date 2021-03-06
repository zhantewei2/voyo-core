import { __awaiter } from "tslib";
import { ioc } from "../ioc";
import { registryLoader } from "../components/registry/loader";
import { PAGE_DATA_LOAD_KEY, SETTING_IOC_NAME } from "../setting";
import { getCurrentPage } from "../utils/page";
export const toRegistryPageDataLoad = () => {
    registryLoader();
    const settingService = ioc.getService(SETTING_IOC_NAME);
    return (run, img) => __awaiter(void 0, void 0, void 0, function* () {
        let page = getCurrentPage();
        if (!page)
            yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    page = getCurrentPage();
                    resolve(true);
                });
            });
        if (!page)
            return;
        let loaderEl = page[PAGE_DATA_LOAD_KEY];
        if (run) {
            if (!loaderEl) {
                loaderEl = page[PAGE_DATA_LOAD_KEY] = document.createElement("voyoc-loader");
                loaderEl.setAttribute("fixCenter", true);
                page.appendChild(loaderEl);
            }
            loaderEl.setAttribute("img", img || settingService.pageDataLoadImg);
            loaderEl.setAttribute("show", 1);
        }
        else {
            if (!loaderEl)
                return;
            loaderEl.setAttribute("show", 0);
        }
    });
};
