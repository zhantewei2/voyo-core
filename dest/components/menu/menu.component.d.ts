import { VoyoComponent } from "../commonComponent";
import { RelativeFixed } from "../../utils/RelativeFixed";
export declare class ForElement extends HTMLElement {
    voyocMenuForElListenerName: any;
}
export declare class MenuComponent extends VoyoComponent {
    relativeFixed: RelativeFixed;
    wrapperEl: HTMLElement;
    clickTrigger: boolean;
    set forEl(el: ForElement);
    created(): void;
    open(e: Event): void;
}
