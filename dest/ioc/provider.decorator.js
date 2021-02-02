import { IOC_NAME } from "../setting";
const ioc = window[IOC_NAME];
export const IOCProvider = ({ name, cover, handler }) => (target) => {
    ioc.provide(name || target.name, target, cover, handler);
};
