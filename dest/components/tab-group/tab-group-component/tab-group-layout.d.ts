import { VoyoComponent } from "../../commonComponent";
import { TabgroupLayoutType } from "../tab.interface";
import { TabBarComponent } from "../tab-bar-component/tab-bar.component";
import { TabGroupBody } from "../tab-group-body-component/tab-group-body.component";
import { TabsComponent } from "../tabs-component/tabs.component";
import { TabGroupHeader } from "../tab-group-header-component/tab-group-header.component";
import { ClassManage } from "../../../utils";
export declare class TabLayoutChild<T extends VoyoComponent> {
    i: T;
    parent: VoyoComponent | undefined;
    constructor(i: T, parent?: VoyoComponent);
    setType(type: TabgroupLayoutType): void;
}
export declare class TabGroupLayoutManage {
    groupHeader: TabLayoutChild<TabGroupHeader> | undefined;
    groupBody: TabLayoutChild<TabGroupBody> | undefined;
    tabs: TabLayoutChild<TabsComponent> | undefined;
    tabBar: TabLayoutChild<TabBarComponent> | undefined;
    list: Array<TabLayoutChild<VoyoComponent> | undefined>;
    bindEl: HTMLElement;
    classManage: ClassManage;
    constructor(bindEl: HTMLElement);
    setLayoutType(v: TabgroupLayoutType): void;
    foundTabGroupChild(nodes: Node[]): void;
}
