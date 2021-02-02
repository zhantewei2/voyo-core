import { VoyoComponent } from "../commonComponent";
import { KeepScrollContainer } from "../../utils/scroll";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import "./page-content.scss";
import { findParentByComponentName } from "../../utils";
import { of, fromEvent, Observable, merge } from "rxjs";
import { map } from "rxjs/operators";

@VoyoDor({
  name: "voyo-content",
  template: `
    <slot></slot>
  `,
  styles: require("./page-content.webscss"),
})
export class PageContentComponent extends VoyoComponent {
  @VoyoInput({}) set full(v: boolean) {
    v ? this.classList.add("full") : this.classList.remove("full");
  }
  @VoyoInput({}) set standAlone(v: boolean) {
    v ? this.classList.add("standAlone") : this.classList.remove("standAlone");
  }
  keepScrollContainer: KeepScrollContainer;
  connectedCallback() {
    this.keepScrollContainer.restore();
  }
  created(this: any) {
    this.keepScrollContainer = new KeepScrollContainer({
      scrollContainer: this,
      behavior: "y",
    });
    this.keepScrollContainer.listen();
  }
  mounted() {
    this.classList.add("voyo-page-content");
    /**
     * registry to page
     */
    const pageElement: any = findParentByComponentName(this, "voyo-page");
    if (pageElement) {
      pageElement.childContent = this;
    }
  }
  scrollSubject: Observable<number>;

  /**
   * listen scroll
   */
  listenerScroll(): Observable<number> {
    if (this.scrollSubject) return this.scrollSubject;
    return (this.scrollSubject = merge(
      of(1).pipe(map(() => this.scrollTop)),
      fromEvent(this, "scroll").pipe(map(() => this.scrollTop)),
    ));
  }
}
