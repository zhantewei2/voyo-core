import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";
import { VoyoOutput } from "../../Output.decorator";
import { ClassManage } from "../../../utils";
import { TabsComponent } from "../tabs-component/tabs.component";
import { TabBarComponent } from "../tab-bar-component/tab-bar.component";
import { forkJoin } from "rxjs";
import { TabGroupLayoutManage } from "./tab-group-layout";
import { ExcuteAfterConnected } from "../../utils";
let TabGroupComponent = class TabGroupComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.index = 0;
        this.tabGroupLayoutManage = new TabGroupLayoutManage(this);
        this.excuteAfterConnected = new ExcuteAfterConnected();
        this.inputChange = new VoyoEventEmitter();
    }
    set value(v) {
        if (v === this.index)
            return;
        // tab bar change from tabs
        this.tabs && this.tabs.setIndex(v);
    }
    set layout(v) {
        this.excuteAfterConnected.execute(() => {
            this.tabGroupLayoutManage.setLayoutType(v);
        }, "layoutType");
    }
    created() {
        this.classManage = new ClassManage(this);
    }
    mounted() {
        this.classList.add("voyo-tabGroup");
        const slots = this.shadowRoot.querySelector("slot");
        const slotNodes = slots.assignedNodes();
        const nodes = slotNodes.filter((i) => {
            if (i instanceof TabBarComponent) {
                this.tabBar = i;
                return true;
            }
            else if (i instanceof TabsComponent) {
                this.tabs = i;
                return true;
            }
        });
        this.tabGroupLayoutManage.foundTabGroupChild(slotNodes);
        if (!this.tabs || !this.tabBar)
            return;
        this.tabBar.classList.add("voyo-tabGroup-tabBar");
        this.tabs.classList.add("voyo-tabGroup-tabs");
        forkJoin(nodes.map((i) => i.voyoConnected)).subscribe(i => {
            this.tabs.setIndex(this.index);
            this.tabBar.setIndexDirect(this.index);
            this.tabBar.combine = true;
            this.tabs.progressChange.subscribe((progress) => {
                this.tabBar.pointerMoveChange.next(progress);
            });
            this.tabs.inputChange.subscribe((i) => {
                this.tabBar.setIndexDirect(i);
                this.inputChange.next(i);
            });
            this.tabBar.willChange.subscribe(({ value, cb }) => {
                this.tabs.setIndex(value, cb);
            });
        });
        this.excuteAfterConnected.connect();
    }
};
__decorate([
    VoyoInput({ name: "value" })
], TabGroupComponent.prototype, "value", null);
__decorate([
    VoyoOutput({ event: "input" })
], TabGroupComponent.prototype, "inputChange", void 0);
__decorate([
    VoyoInput({ defaultValue: "stiff" })
], TabGroupComponent.prototype, "layout", null);
TabGroupComponent = __decorate([
    VoyoDor({
        template: `
    <slot></slot>
  `,
    })
], TabGroupComponent);
export { TabGroupComponent };
