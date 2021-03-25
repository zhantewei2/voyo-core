import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ClassManage } from "../../utils/ClassManage";
import { handleRipple } from "../../utils/ripple";
import { IOCAutowired } from "../../ioc";
import { SETTING_IOC_NAME } from "../../setting";
import { isIOS } from "@ztwx/utils";
let ButtonIconComponent = class ButtonIconComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.rippleOpts = {
            autoSize: true,
            css: "ripple-btn",
            disabled: false,
        };
        this.voyoTap = new VoyoEventEmitter();
        this.awaitQueue = [];
        this.connected = false;
    }
    set disabled(v) {
        this.rippleOpts.disabled = v || v === "";
    }
    set color(v) {
        if (this.connected) {
            this.setColor(v);
        }
        else {
            this.awaitQueue.push(() => this.setColor(v));
        }
    }
    set size(v) {
        if (this.connected) {
            this.setSize(v);
        }
        else {
            this.awaitQueue.push(() => this.setSize(v));
        }
    }
    set type(v) {
        if (this.connected) {
            this.setType(v);
        }
        else {
            this.awaitQueue.push(() => this.setType(v));
        }
    }
    setColor(v) {
        this.classManage.replaceClass("color", `__${v}`);
    }
    setSize(v) {
        this.classManage.replaceClass("size", `voyo-btn-icon-size-${v}`);
    }
    setType(v) {
        this.classManage.replaceClass("type", `voyo-btn-${v}`);
    }
    created() {
        this.classManage = new ClassManage(this);
    }
    mounted() {
        this.connected = true;
        this.classList.add("btn", "voyo-btn-icon");
        handleRipple(this, this.rippleOpts);
        this.awaitQueue.forEach(run => run());
        this.addEventListener("click", (e) => {
            isIOS ?
                this.voyoTap.next(e) :
                setTimeout(() => {
                    this.voyoTap.next(e);
                }, this.coreSetting.tapTime);
        });
    }
};
__decorate([
    IOCAutowired({ name: SETTING_IOC_NAME })
], ButtonIconComponent.prototype, "coreSetting", void 0);
__decorate([
    VoyoInput({})
], ButtonIconComponent.prototype, "disabled", null);
__decorate([
    VoyoInput({ defaultValue: "primary" })
], ButtonIconComponent.prototype, "color", null);
__decorate([
    VoyoInput({ defaultValue: "now" })
], ButtonIconComponent.prototype, "size", null);
__decorate([
    VoyoInput({ defaultValue: "appear" })
], ButtonIconComponent.prototype, "type", null);
__decorate([
    VoyoOutput({ event: "voyoTap" })
], ButtonIconComponent.prototype, "voyoTap", void 0);
ButtonIconComponent = __decorate([
    VoyoDor({
        template: `
<slot></slot>
  `,
    })
], ButtonIconComponent);
export { ButtonIconComponent };
