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
export type TabgroupLayoutType =
  | "stiff"
  | "migration"
  | "inner-stiff"
  | "inner-migration";

export interface LayoutController {
  setLayout: (type: TabgroupLayoutType) => void;
}

export const tags = {
  tabGroup: "voyoc-tab-group",
  tabGroupBody: "voyoc-tab-group-body",
  tabGroupHeader: "voyoc-tab-group-header",
  tabs: "voyoc-tabs",
  tabBar: "voyoc-tab-bar",
  tabBarItem: "voyoc-tab-bar-item",
  tabItem: "voyoc-tab-item",
};
