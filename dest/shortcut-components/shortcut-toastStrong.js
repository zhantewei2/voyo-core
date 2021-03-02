import { registryToastStrong } from "../components/registry/toast-strong";
export * from "../components/registry/toast-strong";
export const toRegistryToastStrong = () => {
    registryToastStrong();
    let toastStrongEl = document.createElement("voyoc-toast-strong");
    document.documentElement.appendChild(toastStrongEl);
    return {
        toastStrong: (opts) => toastStrongEl.open(opts),
        toastStrongClose: () => toastStrongEl.close()
    };
};
