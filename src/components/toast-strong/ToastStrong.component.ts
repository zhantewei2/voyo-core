import { VoyoComponent } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import completeSvg from "../../assets/complete-colous.svg";
import loadColousSvg2 from "../../assets/load-colous2.svg";
import loseSvg from "../../assets/lose-colous.svg";
import { IOCAutowired } from "../../ioc";
import { SETTING_IOC_NAME } from "../../setting";
import { CoreSetting } from "../../core-setting.service";
import { AnimationDisplay } from "../../utils";

export type ToastStrongType = "load" | "completed" | "lose";

export const toastStrongTypeImage: Record<ToastStrongType, string> = {
  load: loadColousSvg2,
  completed: completeSvg,
  lose: loseSvg,
};

export interface ToastStrongOpenOpts {
  message?: string;
  type?: ToastStrongType;
  durationTime?: number;
}

@VoyoDor({
  name: "voyo-toast-strong",
  template: `
<div class="voyo-toastStrong-layout">
  <div class="_layout-bg"></div>
  <main class="voyo-toastStrong">
        <img class="voyo-toastStrong-article-image"/>
        <footer class="voyo-toastStrong-footer">
           
        </footer>
  </main>
</div>
  `,
  styles: require("./ToastStrong.webscss"),
})
export class ToastStrongComponent extends VoyoComponent {
  @IOCAutowired({ name: SETTING_IOC_NAME }) coreSetting: CoreSetting;
  container: HTMLElement;
  main: HTMLElement;
  footerContent: HTMLElement;
  articleImg: HTMLImageElement;
  imgSource0: any;
  set imgSource(v: any) {
    if (v !== this.imgSource0) {
      this.articleImg.src = v;
    }
    this.imgSource0 = v;
  }

  footerHtmlContent0: string | undefined;
  displayAnimate: AnimationDisplay;
  set footerHtmlContent(htmlText: string | undefined) {
    if (htmlText === this.footerHtmlContent0) return;
    this.footerContent.innerHTML = htmlText || "";
    this.footerHtmlContent0 = htmlText;
    this.footerDisplay = !!htmlText;
  }
  _footerDisplay: boolean;
  set footerDisplay(v: boolean) {
    if (v === this._footerDisplay) return;
    this.footerContent.style.display = v ? "block" : "none";
    this._footerDisplay = v;
  }
  created() {
    this.container = this.shadowRoot.querySelector(".voyo-toastStrong-layout");
    this.footerContent = this.shadowRoot.querySelector(
      ".voyo-toastStrong-footer",
    );
    this.articleImg = this.shadowRoot.querySelector(
      ".voyo-toastStrong-article-image",
    );
    this.main = this.shadowRoot.querySelector(".voyo-toastStrong");
    this.displayAnimate = new AnimationDisplay(
      this.container,
      "voyo-toastStrong-container",
      "block",
      this.main,
    );
    this.displayAnimate.waitTransition = false;
    this.container.style.display = "none";
  }
  open({ message, type, durationTime }: ToastStrongOpenOpts) {
    this.clearAutoClose();
    const toastType: ToastStrongType =
      type || this.coreSetting.toastStrongTypeDefault;
    durationTime =
      durationTime === undefined && toastType !== "load"
        ? this.coreSetting.toastStrongDurationTime
        : durationTime;
    this.imgSource = toastStrongTypeImage[toastType];
    this.footerHtmlContent = message;
    this.displayAnimate.open();
    if (durationTime) {
      this.setAutoClose(durationTime);
    }
  }
  close() {
    this.clearAutoClose();
    this.displayAnimate.close(true);
  }
  autoClose: any;
  setAutoClose(timeout: number) {
    this.autoClose = setTimeout(() => {
      this.close();
    }, timeout);
  }
  clearAutoClose() {
    if (this.autoClose) {
      clearTimeout(this.autoClose);
      this.autoClose = null;
    }
  }
}
