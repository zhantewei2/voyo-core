import { DirtyCheck } from "../utils";
import { ASSEMBLY_STORE_NAME } from "../setting";
const assembly_store = window[ASSEMBLY_STORE_NAME] ||
    (window[ASSEMBLY_STORE_NAME] = {});
export const assemblyComponent = (componentTag, Component) => {
    if (assembly_store[componentTag])
        return;
    assembly_store[componentTag] = true;
    // let i=0;
    class webComponent extends Component {
        // connectedCallback(){
        //   console.log(componentTag);
        //   super.connectedCallback&&super.connectedCallback();
        // }
        constructor() {
            super();
            this._dirtyCheck = new DirtyCheck();
            this.connectedOnce = false;
            let { template, styles, styleUrl } = Component.prototype._voyoData;
            this.attachShadow({ mode: "open" });
            if (styles) {
                if (styles instanceof Function) {
                    styles().then((res) => {
                        const styleEl = document.createElement("style");
                        styleEl.innerText = res.default;
                        this.shadowRoot.appendChild(styleEl);
                    });
                }
                else if (typeof styles === "object") {
                    template = `<style>${styles.default}</style>` + template;
                }
                else {
                    template = `<style>${styles}</style>` + template;
                }
            }
            else if (styleUrl) {
                template = `<style>${styleUrl}</style>` + template;
            }
            this.shadowRoot.innerHTML = template;
            //hook
            /**
             * can not modify this class when created.
             * change it after connected
             */
            this.created && this.created();
            this.handlers && this.handlers.forEach((handler) => handler(this));
            this.afterCreate && this.afterCreate();
        }
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
    }
    window.customElements.define(componentTag, webComponent);
};
