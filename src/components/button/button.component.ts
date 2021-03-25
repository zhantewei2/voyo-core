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
import { isIOS } from "@ztwx/utils";

@VoyoDor({
  template: `
<slot></slot>
  `,
})
export class ButtonComponent extends VoyoComponent {
  @IOCAutowired({ name: SETTING_IOC_NAME }) coreSetting: CoreSetting;
  rippleOpts = {
    autoSize: true,
    css: "ripple-btn",
    disabled: false,
  };
  @VoyoInput({}) set block(v: number) {
    if (this.connected) {
      this.setBlock(v);
    } else {
      this.awaitQueue.push(() => this.setBlock(v));
    }
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
  @VoyoInput({}) set round(v: number) {
    if (this.connected) {
      this.setRound(v);
    } else {
      this.awaitQueue.push(() => this.setRound(v));
    }
  }
  @VoyoInput({}) set noRadius(v: number) {
    if (this.connected) {
      this.setNoRadius(v);
    } else {
      this.awaitQueue.push(() => this.setNoRadius(v));
    }
  }
  @VoyoInput({}) set active(v: boolean | "") {
    if (this.connected) {
      this.setActive(v);
    } else {
      this.awaitQueue.push(() => this.setActive(v));
    }
  }
  @VoyoInput({}) disabled: boolean;
  @VoyoInput({}) noRipple: boolean;
  @VoyoOutput({ event: "voyoTap" }) voyoTap: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();

  setColor(v: string) {
    this.classManage.replaceClass("color", `__${v}`);
  }
  setSize(v: string) {
    this.classManage.replaceClass("size", `voyo-btn-size-${v}`);
  }
  setType(v: string) {
    this.classManage.replaceClass("type", `voyo-btn-${v}`);
  }
  setBlock(v: any) {
    this.classManage.toggleClass("voyo-btn-block", v === "" || v);
  }
  setRound(v: any) {
    this.classManage.toggleClass("voyo-btn-round", v === "" || v);
  }
  setNoRadius(v: any) {
    this.classManage.toggleClass("no-radius", v === "" || v);
  }
  setActive(v: boolean | "") {
    this.classManage.toggleClass("__active", v === "" || v);
  }
  data = "data";
  classManage: ClassManage;
  created() {
    this.classManage = new ClassManage(this);
  }
  awaitQueue: Function[] = [];
  connected = false;
  mounted() {
    this.connected = true;
    this.classList.add("btn", "voyo-btn");
    if (!this.noRipple) handleRipple(this, this.rippleOpts);
    this.awaitQueue.forEach(run => run());
    // @ts-ignore
    delete this.awaitQueue;
    this.addEventListener("click", (e: MouseEvent) => {
      if (this.disabled) return;
      isIOS?this.voyoTap.next(e):setTimeout(()=>this.voyoTap.next(e),this.coreSetting.tapTime);
    });
  }
}
