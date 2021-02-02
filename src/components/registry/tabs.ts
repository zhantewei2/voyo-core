import { TabBarComponent } from "../tabs/tab-bar.component";
import { TabGroupComponent } from "../tabs/tab-group.component";
import { TabsComponent } from "../tabs/tabs.component";
import { assemblyComponent } from "../AssemblyComponent";
import { registryCarousel } from "./carousel";

registryCarousel();
export const registryTabs = () => {
  assemblyComponent("voyoc-tabs", TabsComponent);
  assemblyComponent("voyoc-tab-group", TabGroupComponent);
  assemblyComponent("voyoc-tab-bar", TabBarComponent);
};
