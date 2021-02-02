import { TabBarComponent } from "../tab-bar-component/tab-bar.component";
import { TabGroupBody } from "../tab-group-body-component/tab-group-body.component";
import { TabsComponent } from "../tabs-component/tabs.component";
import { TabGroupHeader } from "../tab-group-header-component/tab-group-header.component";
import { ClassManage } from "../../../utils";
export class TabLayoutChild {
    constructor(i, parent) {
        this.i = i;
        this.parent = parent;
    }
    setType(type) {
        this.i.setLayout(this.parent ? `inner-${type}` : type);
    }
}
export class TabGroupLayoutManage {
    constructor(bindEl) {
        this.bindEl = bindEl;
        this.classManage = new ClassManage(bindEl);
    }
    setLayoutType(v) {
        this.list.forEach(i => i && i.setType(v));
        this.classManage.replaceClass("layout", v);
    }
    foundTabGroupChild(nodes) {
        nodes.forEach(node => {
            if (node instanceof TabGroupHeader) {
                this.groupHeader = new TabLayoutChild(node);
            }
            else if (node instanceof TabGroupBody) {
                this.groupBody = new TabLayoutChild(node);
            }
            else if (node instanceof TabsComponent) {
                this.tabs = new TabLayoutChild(node);
            }
            else if (node instanceof TabBarComponent) {
                this.tabBar = new TabLayoutChild(node);
            }
        });
        if (!this.tabs && this.groupBody) {
            this.groupBody.i.childNodes &&
                Array.prototype.forEach.call(this.groupBody.i.childNodes, node => {
                    var _a;
                    if (node instanceof TabsComponent) {
                        this.tabs = new TabLayoutChild(node, (_a = this.groupBody) === null || _a === void 0 ? void 0 : _a.i);
                    }
                });
        }
        if (!this.tabBar && this.groupHeader) {
            this.groupHeader.i.childNodes &&
                Array.prototype.forEach.call(this.groupHeader.i.childNodes, node => {
                    var _a;
                    if (node instanceof TabBarComponent) {
                        this.tabBar = new TabLayoutChild(node, (_a = this.groupHeader) === null || _a === void 0 ? void 0 : _a.i);
                    }
                });
        }
        this.list = [this.tabs, this.tabBar, this.groupHeader, this.groupBody];
    }
}
