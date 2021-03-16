import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter, } from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ClassManage } from "../../utils";
import { ExcuteAfterConnected } from "../utils";
let LoaderComponent = class LoaderComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.showChange = new VoyoEventEmitter();
        this.excuteAfterRender = new ExcuteAfterConnected();
        this.inserted = false;
    }
    set size(v) {
        this.excuteAfterRender.execute(() => {
            this.wrapperManage.replaceClass("size", `__size-${v}`);
        });
    }
    set abs(v) {
        this.excuteAfterRender.execute(() => {
            this.wrapperManage.toggleClass("__abs", v === "" || v);
        });
    }
    set fixCenter(v) {
        this.excuteAfterRender.execute(() => {
            this.wrapperManage.toggleClass("__fixCenter", v === "" || v);
        });
    }
    set absCenter(v) {
        this.excuteAfterRender.execute(() => {
            this.wrapperManage.toggleClass("__absCenter", v === "" || v);
        });
    }
    set cover(v) {
        this.excuteAfterRender.execute(() => {
            this.containerManage.toggleClass("__cover", v === "" || v);
        });
    }
    set type(v) {
        this.excuteAfterRender.execute(() => {
            this.wrapperManage.replaceClass("type", `__${v}`);
        });
        this.containerManage.replaceClass("type", `__${v}`);
    }
    set show(v) {
        v = !!v;
        if (v == this.inserted)
            return;
        if (v) {
            this.svgTemplateRef.insert(this.container, "voyo-an-fadeIn0");
        }
        else {
            this.svgTemplateRef.remove("voyo-an-fadeOut0");
        }
        this.inserted = v;
    }
    created() {
        this.container = this.shadowRoot.querySelector("#voyo-loader-container");
        this.containerManage = new ClassManage(this.container);
    }
};
__decorate([
    VoyoInput({ name: "img" })
], LoaderComponent.prototype, "img", void 0);
__decorate([
    VoyoInput({ name: "size", defaultValue: "now" })
], LoaderComponent.prototype, "size", null);
__decorate([
    VoyoInput({ name: "abs" })
], LoaderComponent.prototype, "abs", null);
__decorate([
    VoyoInput({ name: "fixCenter" })
], LoaderComponent.prototype, "fixCenter", null);
__decorate([
    VoyoInput({ name: "absCenter" })
], LoaderComponent.prototype, "absCenter", null);
__decorate([
    VoyoInput({ name: "cover" })
], LoaderComponent.prototype, "cover", null);
__decorate([
    VoyoInput({ name: "type", defaultValue: "block" })
], LoaderComponent.prototype, "type", null);
__decorate([
    VoyoInput({ name: "show" })
], LoaderComponent.prototype, "show", null);
__decorate([
    VoyoOutput({ event: "showChange" })
], LoaderComponent.prototype, "showChange", void 0);
__decorate([
    VoyoTemplate({
        tag: "div",
        className: "voyo-load-wrapper",
        render: function () {
            if (this.img) {
                return `
<div id="view">
  <div class="_image">
    <img class="_img" src="${this.img}"/>
  </div>
</div>
        `;
            }
            return `
<div id="view">
  <div class="_image">
    <svg class="_img" style="margin: auto; background: transparent; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <circle cx="50" cy="50" r="32" stroke-width="3"
        fill="none"
         stroke="url(#loader-linearGradient)"
         stroke-dasharray="50.26548245743669 50.26548245743669"
         stroke-linecap="round" transform="rotate(257.097 50 50)">
          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur=".55s" keyTimes="0;1" values="0 50 50;360 50 50"/>
        </circle>
        <linearGradient 
        id="loader-linearGradient" spreadMethod="reflect">
          <stop stop-color="var(--color-primary)" offset="0"></stop>
          <stop stop-color="var(--color-primary2)" offset="1"></stop>
        </linearGradient>
    </svg>    
  </div>
  <div class="_text">
    <slot name="text"></slot>
  </div>
</div>`;
        },
        renderCallback(el) {
            this.wrapperEl = el;
            this.wrapperManage = new ClassManage(this.wrapperEl);
            this.excuteAfterRender.connect();
        },
    })
], LoaderComponent.prototype, "svgTemplateRef", void 0);
LoaderComponent = __decorate([
    VoyoDor({
        template: `
    <div id="voyo-loader-container" class="voyo-loader-container">
    </div>
    `,
        styles: '.voyo-loader-container.__cover{position:absolute;top:0;left:0;height:100%;width:100%;z-index:2}.voyo-load-wrapper,.voyo-loader-container.__inline{display:inline-block}.voyo-load-wrapper.__block{display:flex;justify-content:center;align-items:center;height:5.5em}.voyo-load-wrapper.__block ._img,.voyo-load-wrapper.__block ._img-wrapper{height:5em;width:5em}.voyo-load-wrapper.__block ._view{display:flex;justify-content:center;align-items:center;flex-flow:column}.voyo-load-wrapper.__block ._text{margin:.5rem 0 0}.voyo-load-wrapper.__block.__size-mini{font-size:8px}.voyo-load-wrapper.__block.__size-small{font-size:12px}.voyo-load-wrapper.__block.__size-now{font-size:14px}.voyo-load-wrapper.__block.__size-medium{font-size:16px}.voyo-load-wrapper.__block.__size-strong{font-size:18px}.voyo-load-wrapper.__block.__size-large{font-size:22px}.voyo-load-wrapper.__inline.__size-mini{font-size:6px}.voyo-load-wrapper.__inline.__size-small{font-size:10px}.voyo-load-wrapper.__inline.__size-now{font-size:12px}.voyo-load-wrapper.__inline.__size-medium{font-size:14px}.voyo-load-wrapper.__inline.__size-strong{font-size:16px}.voyo-load-wrapper.__inline.__size-large{font-size:20px}.voyo-load-wrapper.__inline ._view{display:inline-flex;justify-content:center;align-items:center}.voyo-load-wrapper.__inline ._img,.voyo-load-wrapper.__inline ._img-wrapper{height:4em;width:4em}.voyo-load-wrapper.__inline ._textIcon{font-size:2.5em}.voyo-load-wrapper.__inline ._text{margin:0 0 0 .5rem}.voyo-load-wrapper.__abs,.voyo-load-wrapper.__absCenter{position:absolute;z-index:2;text-align:center}.voyo-load-wrapper.__fixCenter{position:fixed!important;z-index:2;text-align:center}.voyo-load-wrapper.__abs{width:100%;left:0;top:0}.voyo-load-wrapper.__absCenter,.voyo-load-wrapper.__fixCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.voyo-load-wrapper ._text{color:var(--color-font-des)}@-webkit-keyframes VoyoAnLoading{to{transform:rotate(1turn)}}@keyframes VoyoAnLoading{to{transform:rotate(1turn)}}.voyo-an-loading{-webkit-animation:VoyoAnLoading 1s linear infinite;animation:VoyoAnLoading 1s linear infinite}@-webkit-keyframes VoyoFadeIn{0%{opacity:0;transform:scale3d(.8,.8,.8)}}@keyframes VoyoFadeIn{0%{opacity:0;transform:scale3d(.8,.8,.8)}}@-webkit-keyframes VoyoFadeOut{to{opacity:0;transform:scale3d(.8,.8,.8)}}@keyframes VoyoFadeOut{to{opacity:0;transform:scale3d(.8,.8,.8)}}@-webkit-keyframes VoyoFadeIn0{0%{opacity:0}}@keyframes VoyoFadeIn0{0%{opacity:0}}@-webkit-keyframes VoyoFadeOut0{to{opacity:0}}@keyframes VoyoFadeOut0{to{opacity:0}}.voyo-an-fadeIn{-webkit-animation:VoyoFadeIn .2s cubic-bezier(.09,.34,.48,.97);animation:VoyoFadeIn .2s cubic-bezier(.09,.34,.48,.97)}.voyo-an-fadeOut{-webkit-animation:VoyoFadeOut .2s cubic-bezier(.79,.07,.98,1);animation:VoyoFadeOut .2s cubic-bezier(.79,.07,.98,1);-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.voyo-an-fadeIn0{-webkit-animation:VoyoFadeIn0 .2s cubic-bezier(.09,.34,.48,.97);animation:VoyoFadeIn0 .2s cubic-bezier(.09,.34,.48,.97)}.voyo-an-fadeOut0{-webkit-animation:VoyoFadeOut0 .2s cubic-bezier(.79,.07,.98,1);animation:VoyoFadeOut0 .2s cubic-bezier(.79,.07,.98,1)}',
    })
], LoaderComponent);
export { LoaderComponent };
