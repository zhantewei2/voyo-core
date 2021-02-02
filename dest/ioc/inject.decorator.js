import { IOC_NAME } from "../setting";
const ioc = window[IOC_NAME];
export const IOCAutowired = (param) => (target, key) => {
    target[key] = ioc.getService(param.name);
};
