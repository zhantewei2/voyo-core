import {
  VoyoComponent,
  VoyoEventEmitter,
  VoyoTemplateRef,
} from "../commonComponent";
import { VoyoDor, VoyoInput, VoyoTemplate } from "../BaseComponent";
import { VoyoOutput } from "../Output.decorator";
import { ClassManage } from "../../utils";
import { SizeVarious } from "../../types/base-types";
import { ExcuteAfterConnected } from "../utils";

@VoyoDor({
  template: `
    <div id="voyo-loader-container" class="voyo-loader-container">
    </div>
    `,
  styles: require("./loader.webscss"),
})
export class LoaderComponent extends VoyoComponent {
  @VoyoInput({ name: "img" }) img: string;

  @VoyoInput({ name: "size", defaultValue: "now" }) set size(v: SizeVarious) {
    this.excuteAfterRender.execute(() => {
      this.wrapperManage.replaceClass("size", `__size-${v}`);
    });
  }
  @VoyoInput({ name: "abs" }) set abs(v: boolean | "") {
    this.excuteAfterRender.execute(() => {
      this.wrapperManage.toggleClass("__abs", v === "" || v);
    });
  }
  @VoyoInput({ name: "fixCenter" }) set fixCenter(v: boolean | "") {
    this.excuteAfterRender.execute(() => {
      this.wrapperManage.toggleClass("__fixCenter", v === "" || v);
    });
  }
  @VoyoInput({ name: "absCenter" }) set absCenter(v: boolean | "") {
    this.excuteAfterRender.execute(() => {
      this.wrapperManage.toggleClass("__absCenter", v === "" || v);
    });
  }
  @VoyoInput({ name: "cover" }) set cover(v: boolean | "") {
    this.excuteAfterRender.execute(() => {
      this.containerManage.toggleClass("__cover", v === "" || v);
    });
  }

  @VoyoInput({ name: "type", defaultValue: "block" }) set type(
    v: "block" | "inline",
  ) {
    this.excuteAfterRender.execute(() => {
      this.wrapperManage.replaceClass("type", `__${v}`);
    });
    this.containerManage.replaceClass("type", `__${v}`);
  }
  @VoyoInput({ name: "show" }) set show(v: boolean) {
    v = !!v;
    if (v == this.inserted) return;
    if (v) {
      this.svgTemplateRef.insert(this.container, "voyo-an-fadeIn0");
    } else {
      this.svgTemplateRef.remove("voyo-an-fadeOut0");
    }
    this.inserted = v;
  }
  @VoyoOutput({ event: "showChange" }) showChange: VoyoEventEmitter<
    any
  > = new VoyoEventEmitter<any>();

  @VoyoTemplate({
    tag: "div",
    className: "voyo-load-wrapper",
    render: function(this: LoaderComponent) {
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
    renderCallback(this: LoaderComponent, el: HTMLElement) {
      this.wrapperEl = el;
      this.wrapperManage = new ClassManage(this.wrapperEl);
      this.excuteAfterRender.connect();
    },
  })
  svgTemplateRef: VoyoTemplateRef;
  excuteAfterRender: ExcuteAfterConnected = new ExcuteAfterConnected();
  inserted = false;
  container: HTMLElement;
  wrapperEl: HTMLElement;
  wrapperManage: ClassManage;
  containerManage: ClassManage;
  created() {
    this.container = this.shadowRoot.querySelector("#voyo-loader-container");
    this.containerManage = new ClassManage(this.container);
  }
}
