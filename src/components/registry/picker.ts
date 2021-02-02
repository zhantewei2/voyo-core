import { PickerComponent } from "../picker/picker.component";
import { assemblyComponent } from "../AssemblyComponent";

export const registryPicker = () => {
  assemblyComponent("voyoc-picker", PickerComponent);
};
