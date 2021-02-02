import { LoaderComponent } from "../loader/loader.component";
import { assemblyComponent } from "../AssemblyComponent";

export const registryLoader = () => {
  assemblyComponent("voyoc-loader", LoaderComponent);
};
