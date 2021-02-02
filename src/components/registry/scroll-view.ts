import { ScrollViewComponent } from "../scroll-view/scroll-view.component";
import { assemblyComponent } from "../AssemblyComponent";

export const registryScrollView = () => {
  assemblyComponent("voyoc-scroll-view", ScrollViewComponent);
};
