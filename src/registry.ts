import { ioc } from "./ioc/ioc";
import { CoreSetting } from "./core-setting.service";
import { RouterChangeService } from "./router/routerChange.service";

export const registryVoyoCore = () => {
    ioc;
    CoreSetting;
};

export const registryVoyoRouter = () => {
    RouterChangeService;
};