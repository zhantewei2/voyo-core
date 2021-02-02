import { TabBarItemComponent } from "./tab-bar-item-component/tab-bar-item.component";
export interface TabBarItemRef {
    tabBarItem: TabBarItemComponent;
    tabBarEl: HTMLElement;
    width: number;
    index: number;
}
/**
 * inner-stiff for inner tabs tabBar.
 * inner-migration for inner tabs tabBar.
 */
export declare type TabgroupLayoutType = "stiff" | "migration" | "inner-stiff" | "inner-migration";
export interface LayoutController {
    setLayout: (type: TabgroupLayoutType) => void;
}
export declare const tags: {
    tabGroup: string;
    tabGroupBody: string;
    tabGroupHeader: string;
    tabs: string;
    tabBar: string;
    tabBarItem: string;
    tabItem: string;
};
