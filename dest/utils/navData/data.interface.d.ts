export interface NavListItem {
    label: string;
    icon?: string;
    path?: string;
    open?: boolean;
    children?: NavListItem[];
    parent?: NavListItem;
    active?: boolean;
    selected?: boolean;
}
