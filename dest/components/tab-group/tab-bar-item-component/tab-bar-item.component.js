import { __decorate } from "tslib";
import { VoyoComponent } from "../../commonComponent";
import { VoyoDor } from "../../BaseComponent";
import { handleRipple, ClassManage } from "../../../utils";
let TabBarItemComponent = class TabBarItemComponent extends VoyoComponent {
    created() {
        this.classManage = new ClassManage(this);
    }
    mounted() {
        this.classList.add("voyo-tab-bar-item");
        handleRipple(this, { autoSize: true });
    }
    active() {
        this.classManage.toggleClass("active", true);
    }
    disActive() {
        this.classManage.toggleClass("active", false);
    }
};
TabBarItemComponent = __decorate([
    VoyoDor({
        template: `
    <slot></slot> 
    `,
    })
], TabBarItemComponent);
export { TabBarItemComponent };
