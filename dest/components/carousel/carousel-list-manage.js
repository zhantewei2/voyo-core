import { Subject } from "rxjs";
export class CarouselListManage {
    /**
     *
     * @param list
     * @param activeIndex
     * @param infinite
     */
    constructor(list, activeIndex, infinite) {
        this.activeIndexChange = new Subject();
        this.list = list;
        this.size = this.list.length;
        this.setActiveIndex(activeIndex);
        this.maxIndex = this.size - 1;
        this.infinite = infinite;
    }
    callPloyfillCallback(ployfillCount) {
        this.ployfillCallback && this.ployfillCallback(this.list, ployfillCount);
    }
    setActiveIndex(index) {
        if (index === this.activeIndex)
            return;
        this.activeIndex = index;
        this.activeItem = this.list[index];
        this.activeIndexChange.next(index);
    }
    getCurrentIndex() {
        return this.activeIndex;
    }
    advance() {
        const index = this.getPreIndex();
        if (index !== undefined)
            this.setActiveIndex(index);
    }
    back() {
        const index = this.getNextIndex();
        if (index !== undefined)
            this.setActiveIndex(index);
    }
    getCurrent() {
        return this.activeItem;
    }
    getPreIndex() {
        if (this.activeIndex - 1 < 0) {
            return this.infinite ? this.maxIndex : undefined;
        }
        else {
            return this.activeIndex - 1;
        }
    }
    getNextIndex() {
        if (this.activeIndex + 1 > this.maxIndex) {
            return this.infinite ? 0 : undefined;
        }
        else {
            return this.activeIndex + 1;
        }
    }
    getPre() {
        const index = this.getPreIndex();
        return index !== undefined ? this.list[index] : undefined;
    }
    getNext() {
        const index = this.getNextIndex();
        return index !== undefined ? this.list[index] : undefined;
    }
    getItem(index) {
        const item = this.list[index];
        if (!item)
            throw new Error("not found item:" + index);
        return {
            item,
            position: index > this.activeIndex
                ? "right"
                : index < this.activeIndex
                    ? "left"
                    : "mid",
        };
    }
}
