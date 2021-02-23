import { __decorate } from "tslib";
import { VoyoComponent } from "../commonComponent";
import { KeepScrollContainer } from "../../utils/scroll";
import { VoyoDor, VoyoInput } from "../BaseComponent";
import { findParentByComponentName } from "../../utils";
import { of, fromEvent, merge } from "rxjs";
import { map } from "rxjs/operators";
let PageContentComponent = class PageContentComponent extends VoyoComponent {
    set full(v) {
        v ? this.classList.add("full") : this.classList.remove("full");
    }
    set standAlone(v) {
        v ? this.classList.add("standAlone") : this.classList.remove("standAlone");
    }
    connectedCallback() {
        this.keepScrollContainer.restore();
    }
    created() {
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
        const pageElement = findParentByComponentName(this, "voyo-page");
        if (pageElement) {
            pageElement.childContent = this;
        }
    }
    /**
     * listen scroll
     */
    listenerScroll() {
        if (this.scrollSubject)
            return this.scrollSubject;
        return (this.scrollSubject = merge(of(1).pipe(map(() => this.scrollTop)), fromEvent(this, "scroll").pipe(map(() => this.scrollTop))));
    }
};
__decorate([
    VoyoInput({})
], PageContentComponent.prototype, "full", null);
__decorate([
    VoyoInput({})
], PageContentComponent.prototype, "standAlone", null);
PageContentComponent = __decorate([
    VoyoDor({
        name: "voyo-content",
        template: `
    <slot></slot>
  `,
        styles: '',
    })
], PageContentComponent);
export { PageContentComponent };
