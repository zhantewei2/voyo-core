import { VoyoComponent } from "../commonComponent";
import { KeepScrollContainer } from "../../utils/scroll";
import "./page-content.scss";
import { Observable } from "rxjs";
export declare class PageContentComponent extends VoyoComponent {
    set full(v: boolean);
    set standAlone(v: boolean);
    keepScrollContainer: KeepScrollContainer;
    connectedCallback(): void;
    created(this: any): void;
    mounted(): void;
    scrollSubject: Observable<number>;
    /**
     * listen scroll
     */
    listenerScroll(): Observable<number>;
}
