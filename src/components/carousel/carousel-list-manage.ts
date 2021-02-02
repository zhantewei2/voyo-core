import { Subject } from "rxjs";

export class CarouselListManage<T extends Record<string, any>> {
  size: number;
  maxIndex: number;
  list: T[];
  activeItem: T;
  activeIndex: number;
  activeIndexChange: Subject<number> = new Subject<number>();
  infinite: boolean;
  /**
   *
   * @param list
   * @param activeIndex
   * @param infinite
   */
  constructor(list: T[], activeIndex: number, infinite: boolean) {
    this.list = list;
    this.size = this.list.length;
    this.setActiveIndex(activeIndex);
    this.maxIndex = this.size - 1;
    this.infinite = infinite;
  }
  ployfillCallback: (list: T[], ployfillCount: number) => void;

  callPloyfillCallback(ployfillCount: number) {
    this.ployfillCallback && this.ployfillCallback(this.list, ployfillCount);
  }

  setActiveIndex(index: number) {
    if (index === this.activeIndex) return;
    this.activeIndex = index;
    this.activeItem = this.list[index];
    this.activeIndexChange.next(index);
  }
  getCurrentIndex(): number {
    return this.activeIndex;
  }
  advance() {
    const index = this.getPreIndex();
    if (index !== undefined) this.setActiveIndex(index);
  }
  back() {
    const index = this.getNextIndex();
    if (index !== undefined) this.setActiveIndex(index);
  }
  getCurrent(): T {
    return this.activeItem;
  }
  getPreIndex(): number | undefined {
    if (this.activeIndex - 1 < 0) {
      return this.infinite ? this.maxIndex : undefined;
    } else {
      return this.activeIndex - 1;
    }
  }
  getNextIndex(): number | undefined {
    if (this.activeIndex + 1 > this.maxIndex) {
      return this.infinite ? 0 : undefined;
    } else {
      return this.activeIndex + 1;
    }
  }
  getPre(): T | undefined {
    const index = this.getPreIndex();
    return index !== undefined ? this.list[index] : undefined;
  }
  getNext(): T | undefined {
    const index = this.getNextIndex();
    return index !== undefined ? this.list[index] : undefined;
  }
  getItem(
    index: number,
  ): {
    item: T;
    position: "right" | "left" | "mid";
  } {
    const item = this.list[index];
    if (!item) throw new Error("not found item:" + index);

    return {
      item,
      position:
        index > this.activeIndex
          ? "right"
          : index < this.activeIndex
          ? "left"
          : "mid",
    };
  }
}
