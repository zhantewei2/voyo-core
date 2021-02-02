import { tags, TabBarComponent, TabBarItemComponent, TabsComponent, TabGroupComponent, } from "../tab-group";
import { registryCarousel } from "./carousel";
import { assemblyComponent } from "../AssemblyComponent";
registryCarousel();
export const registryTabGroup = () => {
    assemblyComponent(tags.tabBar, TabBarComponent);
    assemblyComponent(tags.tabBarItem, TabBarItemComponent);
    assemblyComponent(tags.tabs, TabsComponent);
    assemblyComponent(tags.tabGroup, TabGroupComponent);
};
