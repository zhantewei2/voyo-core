import { assemblyComponent } from "../AssemblyComponent";
import {
  ToastStrongComponent,
  ToastStrongOpenOpts,
  ToastStrongType,
} from "../toast-strong/ToastStrong.component";

export { ToastStrongOpenOpts, ToastStrongType, ToastStrongComponent };

export const registryToastStrong = () => {
  assemblyComponent("voyoc-toast-strong", ToastStrongComponent);
};
