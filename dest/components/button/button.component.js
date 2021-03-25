import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ClassManage } from "../../utils/ClassManage";
import { handleRipple } from "../../utils/ripple";
import { IOCAutowired } from "../../ioc";
import { SETTING_IOC_NAME } from "../../setting";
import { isIOS } from "@ztwx/utils";
let ButtonComponent = class ButtonComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.rippleOpts = {
            autoSize: true,
            css: "ripple-btn",
            disabled: false,
        };
        this.voyoTap = new VoyoEventEmitter();
        this.data = "data";
        this.awaitQueue = [];
        this.connected = false;
    }
    set block(v) {
        if (this.connected) {
            this.setBlock(v);
        }
        else {
            this.awaitQueue.push(() => this.setBlock(v));
        }
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
    set round(v) {
        if (this.connected) {
            this.setRound(v);
        }
        else {
            this.awaitQueue.push(() => this.setRound(v));
        }
    }
    set noRadius(v) {
        if (this.connected) {
            this.setNoRadius(v);
        }
        else {
            this.awaitQueue.push(() => this.setNoRadius(v));
        }
    }
    set active(v) {
        if (this.connected) {
            this.setActive(v);
        }
        else {
            this.awaitQueue.push(() => this.setActive(v));
        }
    }
    setColor(v) {
        this.classManage.replaceClass("color", `__${v}`);
    }
    setSize(v) {
        this.classManage.replaceClass("size", `voyo-btn-size-${v}`);
    }
    setType(v) {
        this.classManage.replaceClass("type", `voyo-btn-${v}`);
    }
    setBlock(v) {
        this.classManage.toggleClass("voyo-btn-block", v === "" || v);
    }
    setRound(v) {
        this.classManage.toggleClass("voyo-btn-round", v === "" || v);
    }
    setNoRadius(v) {
        this.classManage.toggleClass("no-radius", v === "" || v);
    }
    setActive(v) {
        this.classManage.toggleClass("__active", v === "" || v);
    }
    created() {
        this.classManage = new ClassManage(this);
    }
    mounted() {
        this.connected = true;
        this.classList.add("btn", "voyo-btn");
        if (!this.noRipple)
            handleRipple(this, this.rippleOpts);
        this.awaitQueue.forEach(run => run());
        // @ts-ignore
        delete this.awaitQueue;
        this.addEventListener("click", (e) => {
            if (this.disabled)
                return;
            isIOS ? this.voyoTap.next(e) : setTimeout(() => this.voyoTap.next(e), this.coreSetting.tapTime);
        });
    }
};
__decorate([
    IOCAutowired({ name: SETTING_IOC_NAME })
], ButtonComponent.prototype, "coreSetting", void 0);
__decorate([
    VoyoInput({})
], ButtonComponent.prototype, "block", null);
__decorate([
    VoyoInput({ defaultValue: "primary" })
], ButtonComponent.prototype, "color", null);
__decorate([
    VoyoInput({ defaultValue: "now" })
], ButtonComponent.prototype, "size", null);
__decorate([
    VoyoInput({ defaultValue: "appear" })
], ButtonComponent.prototype, "type", null);
__decorate([
    VoyoInput({})
], ButtonComponent.prototype, "round", null);
__decorate([
    VoyoInput({})
], ButtonComponent.prototype, "noRadius", null);
__decorate([
    VoyoInput({})
], ButtonComponent.prototype, "active", null);
__decorate([
    VoyoInput({})
], ButtonComponent.prototype, "disabled", void 0);
__decorate([
    VoyoInput({})
], ButtonComponent.prototype, "noRipple", void 0);
__decorate([
    VoyoOutput({ event: "voyoTap" })
], ButtonComponent.prototype, "voyoTap", void 0);
ButtonComponent = __decorate([
    VoyoDor({
        template: `
<slot></slot>
  `,
    })
], ButtonComponent);
export { ButtonComponent };
