import { assemblyComponent } from "../AssemblyComponent";
import { DialogComponent } from "../dialog/dialog.component";
export { DialogComponent } from "../dialog/dialog.component";
export const registryDialog = () => {
    assemblyComponent("voyoc-dialog", DialogComponent);
};
