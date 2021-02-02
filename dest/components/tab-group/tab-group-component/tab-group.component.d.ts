import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { ClassManage } from "../../../utils";
import { TabsComponent } from "../tabs-component/tabs.component";
import { TabBarComponent } from "../tab-bar-component/tab-bar.component";
import { TabGroupLayoutManage } from "./tab-group-layout";
import { ExcuteAfterConnected } from "../../utils";
import { TabgroupLayoutType } from "../tab.interface";
export declare class TabGroupComponent extends VoyoComponent {
    classManage: ClassManage;
    tabs: TabsComponent;
    tabBar: TabBarComponent;
    index: number;
    tabGroupLayoutManage: TabGroupLayoutManage;
    excuteAfterConnected: ExcuteAfterConnected;
    set value(v: number);
    inputChange: VoyoEventEmitter<number>;
    set layout(v: TabgroupLayoutType);
    created(): void;
    mounted(): void;
}
