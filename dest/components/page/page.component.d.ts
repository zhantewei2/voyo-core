import { VoyoComponent } from "../commonComponent";
import { ClassManage } from "../../utils";
import { PageContentComponent } from "../page-content/page-content.component";
import { PageHeaderComponent } from "../page-header/page-header.component";
export declare class PageComponent extends VoyoComponent {
    classManage: ClassManage;
    name: string;
    set bg(v: any);
    set bgBlur(v: boolean);
    set iosHeight(v: boolean);
    pageEl: HTMLElement;
    created(): void;
    childContent: PageContentComponent[];
    childHeader: PageHeaderComponent[];
}
