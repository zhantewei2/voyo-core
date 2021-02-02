import { VoyoComponent } from "./commonComponent";
import { DirtyCheck } from "../utils";
import { ASSEMBLY_STORE_NAME } from "../setting";
import { Subject } from "rxjs";

const assembly_store =
  (window as any)[ASSEMBLY_STORE_NAME] ||
  ((window as any)[ASSEMBLY_STORE_NAME] = {});

export const assemblyComponent = (componentTag: string, Component: any) => {
  if (assembly_store[componentTag]) return;
  assembly_store[componentTag] = true;
  // let i=0;
  class webComponent extends Component {
    mounted: () => void;
    _dirtyCheck = new DirtyCheck();
    connectedOnce = false;
    //@ts-ignore
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      if (!this.connectedOnce) {
        this.connectedOnce = true;
        this.mounted && this.mounted();
        this.voyoConnected.next(true);
        this.voyoConnected.complete();
        this.voyoConnectCompleted = true;
      }
    }
    // connectedCallback(){
    //   console.log(componentTag);
    //   super.connectedCallback&&super.connectedCallback();
    // }
    constructor() {
      super();
      let { template, styles, styleUrl } = Component.prototype._voyoData;
      this.attachShadow({ mode: "open" });
      if (styles) {
        if (styles instanceof Function) {
          styles().then((res: any) => {
            const styleEl: HTMLElement = document.createElement("style");
            styleEl.innerText = res.default;
            this.shadowRoot.appendChild(styleEl);
          });
        } else if (typeof styles === "object") {
          template = `<style>${(styles as any).default}</style>` + template;
        } else {
          template = `<style>${styles}</style>` + template;
        }
      } else if (styleUrl) {
        template = `<style>${styleUrl}</style>` + template;
      }
      this.shadowRoot.innerHTML = template;
      //hook
      /**
       * can not modify this class when created.
       * change it after connected
       */

      (this as any).created && (this as any).created();

      this.handlers && this.handlers.forEach((handler: any) => handler(this));
      (this as any).afterCreate && (this as any).afterCreate();
    }
  }
  window.customElements.define(componentTag, webComponent as any);
};
