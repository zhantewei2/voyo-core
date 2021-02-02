import { PageComponent } from "../page/page.component";
import { PageHeaderComponent } from "../page-header/page-header.component";
import { PageContentComponent } from "../page-content/page-content.component";
import { assemblyComponent } from "../AssemblyComponent";
export const registryPage = () =>{
  assemblyComponent("voyoc-page", PageComponent);
  assemblyComponent("voyoc-page-header", PageHeaderComponent)
  assemblyComponent("voyoc-page-content", PageContentComponent)
}
