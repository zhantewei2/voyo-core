import { VoyoComponent } from "../../commonComponent";
import { TabgroupLayoutType } from "../tab.interface";
import { TabBarComponent } from "../tab-bar-component/tab-bar.component";
import { TabGroupBody } from "../tab-group-body-component/tab-group-body.component";
import { TabsComponent } from "../tabs-component/tabs.component";
import { TabGroupHeader } from "../tab-group-header-component/tab-group-header.component";
import { ClassManage } from "../../../utils";

export class TabLayoutChild<T extends VoyoComponent> {
  i: T;
  parent: VoyoComponent | undefined;
  constructor(i: T, parent?: VoyoComponent) {
    this.i = i;
    this.parent = parent;
  }
  setType(type: TabgroupLayoutType) {
    (this.i as any).setLayout(this.parent ? `inner-${type}` : type);
  }
}

export class TabGroupLayoutManage {
  groupHeader: TabLayoutChild<TabGroupHeader> | undefined;
  groupBody: TabLayoutChild<TabGroupBody> | undefined;
  tabs: TabLayoutChild<TabsComponent> | undefined;
  tabBar: TabLayoutChild<TabBarComponent> | undefined;
  list: Array<TabLayoutChild<VoyoComponent> | undefined>;
  bindEl: HTMLElement;
  classManage: ClassManage;
  constructor(bindEl: HTMLElement) {
    this.bindEl = bindEl;
    this.classManage = new ClassManage(bindEl);
  }
  setLayoutType(v: TabgroupLayoutType) {
    this.list.forEach(i => i && i.setType(v));
    this.classManage.replaceClass("layout", v);
  }

  foundTabGroupChild(nodes: Node[]) {
    nodes.forEach(node => {
      if (node instanceof TabGroupHeader) {
        this.groupHeader = new TabLayoutChild(node);
      } else if (node instanceof TabGroupBody) {
        this.groupBody = new TabLayoutChild(node);
      } else if (node instanceof TabsComponent) {
        this.tabs = new TabLayoutChild(node);
      } else if (node instanceof TabBarComponent) {
        this.tabBar = new TabLayoutChild(node);
      }
    });
    if (!this.tabs && this.groupBody) {
      this.groupBody.i.childNodes &&
        Array.prototype.forEach.call(this.groupBody.i.childNodes, node => {
          if (node instanceof TabsComponent) {
            this.tabs = new TabLayoutChild(node, this.groupBody?.i);
          }
        });
    }
    if (!this.tabBar && this.groupHeader) {
      this.groupHeader.i.childNodes &&
        Array.prototype.forEach.call(this.groupHeader.i.childNodes, node => {
          if (node instanceof TabBarComponent) {
            this.tabBar = new TabLayoutChild(node, this.groupHeader?.i);
          }
        });
    }
    this.list = [this.tabs, this.tabBar, this.groupHeader, this.groupBody];
  }
}
