import { assemblyComponent } from "../AssemblyComponent";
import { KeyboardComponent } from "../keyboard/keyboard.component";

export const registryKeyboard = () => {
  assemblyComponent("voyoc-keyboard", KeyboardComponent);
};
