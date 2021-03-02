import { ToastStrongOpenOpts } from "../components/registry/toast-strong";
export * from "../components/registry/toast-strong";
export interface ToastStrongRegistryResult {
    toastStrong: (opts: ToastStrongOpenOpts) => void;
    toastStrongClose: () => void;
}
export declare const toRegistryToastStrong: () => ToastStrongRegistryResult;
