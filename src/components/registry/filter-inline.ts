import { assemblyComponent } from "../AssemblyComponent";
import { FilterInlineComponent } from "../filter-inline/filter-inline.component";
export const registryFilterInline = () => {
  assemblyComponent("voyoc-filter-inline", FilterInlineComponent);
};
