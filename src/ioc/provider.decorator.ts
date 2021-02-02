import { IOC } from "./ioc";
import { IOC_NAME } from "../setting";

const ioc: IOC = (window as any)[IOC_NAME];

export interface IOCProviderParam {
  name?: string;
  handler?: (entity: any) => void;
  cover?: boolean; //覆盖同名service
}

export const IOCProvider = ({ name, cover, handler }: IOCProviderParam) => (
  target: any,
) => {
  ioc.provide(name || target.name, target, cover, handler);
};
