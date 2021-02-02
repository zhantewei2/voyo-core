import { MaskCoverComponent } from "../mask-cover/mask-cover.component";
import { assemblyComponent } from "../AssemblyComponent";
export const registryMaskCover = () => {
    assemblyComponent("voyoc-mask-cover", MaskCoverComponent);
    console.log("registry");
};
