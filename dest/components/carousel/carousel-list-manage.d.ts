import { Subject } from "rxjs";
export declare class CarouselListManage<T extends Record<string, any>> {
    size: number;
    maxIndex: number;
    list: T[];
    activeItem: T;
    activeIndex: number;
    activeIndexChange: Subject<number>;
    infinite: boolean;
    /**
     *
     * @param list
     * @param activeIndex
     * @param infinite
     */
    constructor(list: T[], activeIndex: number, infinite: boolean);
    ployfillCallback: (list: T[], ployfillCount: number) => void;
    callPloyfillCallback(ployfillCount: number): void;
    setActiveIndex(index: number): void;
    getCurrentIndex(): number;
    advance(): void;
    back(): void;
    getCurrent(): T;
    getPreIndex(): number | undefined;
    getNextIndex(): number | undefined;
    getPre(): T | undefined;
    getNext(): T | undefined;
    getItem(index: number): {
        item: T;
        position: "right" | "left" | "mid";
    };
}
