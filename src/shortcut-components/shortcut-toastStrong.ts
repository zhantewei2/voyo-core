import {registryToastStrong,ToastStrongComponent,ToastStrongOpenOpts} from "../components/registry/toast-strong";
export * from "../components/registry/toast-strong";

export interface ToastStrongRegistryResult{
  toastStrong:(opts:ToastStrongOpenOpts)=>void;
  toastStrongClose:()=>void;
}

export const toRegistryToastStrong = () :ToastStrongRegistryResult=> {
  registryToastStrong();
  let toastStrongEl: ToastStrongComponent = document.createElement(
    "voyoc-toast-strong",
  ) as ToastStrongComponent;

  document.documentElement.appendChild(toastStrongEl);

  return {
    toastStrong:(opts:ToastStrongOpenOpts)=>toastStrongEl.open(opts),
    toastStrongClose:()=>toastStrongEl.close()
  }
}