import { assemblyComponent } from "../AssemblyComponent";
import { CheckradioComponent } from "../checkradio/checkradio.component";
export const registryCheckradio = () => {
    assemblyComponent("voyoc-checkradio", CheckradioComponent);
};
