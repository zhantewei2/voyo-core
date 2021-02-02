import { assemblyComponent } from "../AssemblyComponent";
import { ToastStrongComponent, } from "../toast-strong/ToastStrong.component";
export { ToastStrongComponent };
export const registryToastStrong = () => {
    assemblyComponent("voyoc-toast-strong", ToastStrongComponent);
};
