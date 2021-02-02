import { VoyoComponent, VoyoEventEmitter } from "../commonComponent";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { ClassManage } from "../../utils";
import { PageContentComponent } from "../page-content/page-content.component";
import { PageHeaderComponent } from "../page-header/page-header.component";

@VoyoDor({
  name: "voyo-page",
  template: `
<div class="voyo-page">
    <slot></slot>
</div>
  `,
  styles: require("./page.webscss"),
})
export class PageComponent extends VoyoComponent {
  classManage: ClassManage;
  @VoyoInput({}) name: string;
  @VoyoInput({ name: "bg" }) set bg(v: any) {
    this.classManage.replaceClass("bg", v);
  }
  @VoyoInput({}) set bgBlur(v: boolean) {
    this.classManage.toggleClass("__blur", v);
  }
  @VoyoInput({ defaultValue: true }) set iosHeight(v: boolean) {
    this.classManage.toggleClass("iosHeight", v);
  }
  pageEl: HTMLElement;
  created() {
    this.pageEl = this.shadowRoot.querySelector(".voyo-page");
    this.classManage = new ClassManage(this.pageEl);
  }
  childContent: PageContentComponent[];
  childHeader: PageHeaderComponent[];
}
