/***
 * 操作navData数据
 */
import { NavListItem } from "./data.interface";
/**
     * 处理一个深度
     * 为所有item添加parent
     * @param navListItems
     * @param parent
     */
export declare const handleListData: (navListItems: NavListItem[], parent: NavListItem) => void;
/** 返回处理后的List
*
* @param navListItems
*/
export declare const dataFactory: (navListItems: NavListItem[]) => NavListItem[];
export declare class NavDataHandler {
    /**
     *
     * @param items navData数据
     */
    constructor();
    /**
     * 写入navData
     * @param currentNavData 当前导航激活的navData
     */
    setData(currentNavData: NavListItem[]): void;
    itemsLevel: number;
    preCurrentNavData: NavListItem[];
    _currentNavData: NavListItem[];
    set currentNavData(items: NavListItem[]);
    get currentNavData(): NavListItem[];
    preventFromUrl: boolean;
    /**得到item的所有父级对象
     *
     * @param i
     * @param parents
     */
    getItemQueueList(i: NavListItem, parents?: NavListItem[]): NavListItem[];
    /**查找已激活 de item
     *
     * @param navList
     */
    findActiveItem(navList: NavListItem[]): NavListItem | null;
    /**
     * 处理 item 点击时，折叠相关数据的更改
     * @param i
     * @param activeNext  当item为导航项时，触发该回调
     */
    clickItem(i: NavListItem, activeNext: (i: NavListItem) => void): void;
    /**
     * watch “route.path” 触发
     * 从 url path 中展开collapse
     * @param navListItems
     * @param path
     */
    collapseNavCardFromPath(path: string): undefined | NavListItem;
    /**
     * 展开 parent item
     * @param i
     */
    openParents(i: NavListItem): void;
    /** 重置Data
     *
     * @param navListItems
     */
    resetData(navListItems: NavListItem[]): void;
}
