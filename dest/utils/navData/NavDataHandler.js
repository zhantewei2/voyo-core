/**
     * 处理一个深度
     * 为所有item添加parent
     * @param navListItems
     * @param parent
     */
export const handleListData = (navListItems, parent) => {
    navListItems.forEach((i) => {
        i.parent = parent;
        i.open = false;
        i.active = false;
        i.selected = false;
        if (i.children)
            handleListData(i.children, i);
    });
};
/** 返回处理后的List
*
* @param navListItems
*/
export const dataFactory = (navListItems) => {
    /**
     * 最外层构建一个虚拟parent
     */
    const parent = {
        label: "parent",
        children: navListItems
    };
    handleListData(navListItems, parent);
    return navListItems;
};
export class NavDataHandler {
    /**
     *
     * @param items navData数据
     */
    constructor() { }
    /**
     * 写入navData
     * @param currentNavData 当前导航激活的navData
     */
    setData(currentNavData) {
        this.currentNavData = currentNavData;
    }
    set currentNavData(items) {
        if (items == this._currentNavData)
            return;
        this.preCurrentNavData = this._currentNavData;
        this._currentNavData = items;
    }
    get currentNavData() {
        return this._currentNavData;
    }
    /**得到item的所有父级对象
     *
     * @param i
     * @param parents
     */
    getItemQueueList(i, parents = []) {
        parents.unshift(i);
        if (i.parent) {
            this.getItemQueueList(i.parent, parents);
        }
        return parents;
    }
    /**查找已激活 de item
     *
     * @param navList
     */
    findActiveItem(navList) {
        const find = (list) => {
            for (let i of list) {
                if (i.active)
                    return i;
                if (i.children) {
                    const existsItem = find(i.children);
                    if (existsItem)
                        return existsItem;
                }
            }
            return null;
        };
        return find(navList);
    }
    /**
     * 处理 item 点击时，折叠相关数据的更改
     * @param i
     * @param activeNext  当item为导航项时，触发该回调
     */
    clickItem(i, activeNext) {
        if (i.children) {
            //当为父级时
            if (!i.open) {
                if (i.parent && i.parent.children) {
                    // 关闭打开的item
                    for (let child of i.parent.children) {
                        if (child.open) {
                            child.open = false;
                            break;
                        }
                    }
                }
                i.open = true;
            }
            else {
                i.open = false;
            }
        }
        else {
            i.active = true;
            activeNext(i);
        }
    }
    /**
     * watch “route.path” 触发
     * 从 url path 中展开collapse
     * @param navListItems
     * @param path
     */
    collapseNavCardFromPath(path) {
        /**
         * 阻止 导航菜单的点击事件触发的展开
         */
        if (this.preventFromUrl) {
            this.preventFromUrl = false;
            return;
        }
        const findItem = (list) => {
            for (let i of list) {
                if (i.path === path) {
                    return i;
                }
                if (i.children) {
                    const existsItem = findItem(i.children);
                    if (existsItem)
                        return existsItem;
                }
            }
            return null;
        };
        const item = findItem(this.currentNavData);
        if (!item)
            return;
        //重置其他item
        this.resetData(this.currentNavData);
        //展开parent
        this.openParents(item);
        item.active = true;
        return item;
        // this.checkAndResetCurrentNavData(item);
    }
    /**
     * 展开 parent item
     * @param i
     */
    openParents(i) {
        if (i.parent) {
            i.parent.open = true;
            i.parent.selected = true;
            this.openParents(i.parent);
        }
    }
    /** 重置Data
     *
     * @param navListItems
     */
    resetData(navListItems) {
        navListItems.forEach((i) => {
            i.open = false;
            i.active = false;
            i.selected = false;
            i.children && this.resetData(i.children);
        });
    }
}
