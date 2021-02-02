import { IOC } from "./ioc";
import { IOC_NAME } from "../setting";

const ioc: IOC = (window as any)[IOC_NAME];

export interface IOCAutowiredParam {
  name: string;
}

export const IOCAutowired = (param: IOCAutowiredParam) => (
  target: any,
  key: string,
) => {
  target[key] = ioc.getService(param.name);
};
