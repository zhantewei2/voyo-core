import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import {
  ColorVarious,
  SizeVarious,
  BtnTypeVarious,
} from "../../types/base-types";
import { ClassManage } from "../../utils/ClassManage";
import { handleRipple } from "../../utils/ripple";
import { IOCAutowired } from "../../ioc";
import { SETTING_IOC_NAME } from "../../setting";
import { CoreSetting } from "../../core-setting.service";
import {isIOS} from "@ztwx/utils";
@VoyoDor({
  template: `
<slot></slot>
  `,
})
export class ButtonIconComponent extends VoyoComponent {
  @IOCAutowired({ name: SETTING_IOC_NAME }) coreSetting: CoreSetting;
  rippleOpts = {
    autoSize: true,
    css: "ripple-btn",
    disabled: false,
  };
  @VoyoInput({}) set disabled(v: any) {
    this.rippleOpts.disabled = v || v === "";
  }
  @VoyoInput({ defaultValue: "primary" }) set color(v: ColorVarious) {
    if (this.connected) {
      this.setColor(v);
    } else {
      this.awaitQueue.push(() => this.setColor(v));
    }
  }
  @VoyoInput({ defaultValue: "now" }) set size(v: SizeVarious) {
    if (this.connected) {
      this.setSize(v);
    } else {
      this.awaitQueue.push(() => this.setSize(v));
    }
  }
  @VoyoInput({ defaultValue: "appear" }) set type(v: BtnTypeVarious) {
    if (this.connected) {
      this.setType(v);
    } else {
      this.awaitQueue.push(() => this.setType(v));
    }
  }
  @VoyoOutput({ event: "voyoTap" }) voyoTap: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();
  setColor(v: string) {
    this.classManage.replaceClass("color", `__${v}`);
  }
  setSize(v: string) {
    this.classManage.replaceClass("size", `voyo-btn-icon-size-${v}`);
  }
  setType(v: string) {
    this.classManage.replaceClass("type", `voyo-btn-${v}`);
  }

  classManage: ClassManage;
  created() {
    this.classManage = new ClassManage(this);
  }
  awaitQueue: Function[] = [];
  connected = false;

  mounted() {
    this.connected = true;
    this.classList.add("btn", "voyo-btn-icon");
    handleRipple(this, this.rippleOpts);
    this.awaitQueue.forEach(run => run());
    this.addEventListener("click", (e: MouseEvent) => {
      isIOS?
        this.voyoTap.next(e):
        setTimeout(() => {
          this.voyoTap.next(e);
        }, this.coreSetting.tapTime);
    });
  }
}
