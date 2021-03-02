import { __decorate } from "tslib";
import { IOCProvider } from "./ioc";
import { SETTING_IOC_NAME } from "./setting";
let CoreSetting = class CoreSetting {
    constructor() {
        this.tapTime = 100;
        this.toastStrongDurationTime = 1500;
        this.toastStrongTypeDefault = "load";
        this.loadImg = "";
        this.pageDataLoadImg = "";
    }
};
CoreSetting = __decorate([
    IOCProvider({ name: SETTING_IOC_NAME })
], CoreSetting);
export { CoreSetting };
