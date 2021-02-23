import { MovableArea } from "../../../components";
import { merge } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
export class MovableMove {
    constructor(parent, parentIndex) {
        this.tabItemRectRefList = [];
        this.parent = parent;
        this.movable = new MovableArea(parent.areaEl, parent.containerEl);
        this.movable.handleArea(true);
        this.containerWidth = parent.containerWidth;
        this.scrollBoundLeft = 0;
        this.scrollBoundRight = parent.areaWidth - parent.containerWidth;
        this.defineTabItemRectRefs();
        let indexOriginal = parentIndex === undefined;
        merge(parent.valueChange, parent.willChange.pipe(map((i) => i.value)))
            .pipe(distinctUntilChanged())
            .subscribe((v) => {
            const scrollTargetPosition = this.tabItemRectRefList[v].scrollPosition;
            if (scrollTargetPosition === this.scrollLeft)
                return;
            if (indexOriginal) {
                this.movable.move(scrollTargetPosition);
                indexOriginal = false;
            }
            else {
                this.movable.scrollTo(scrollTargetPosition, () => { });
            }
            this.scrollLeft = scrollTargetPosition;
        });
    }
    defineTabItemRectRefs() {
        let left = 0;
        let right;
        this.parent.tabBarItemRefList.forEach((i) => {
            right = left + i.width;
            this.tabItemRectRefList.push({
                left,
                right,
                width: i.width,
                scrollPosition: this.getScrollPosition(left, i.width),
            });
            left += i.width;
        });
    }
    getScrollPosition(left, width) {
        let pos = left - this.containerWidth / 2 + width / 2;
        if (pos < 0)
            pos = 0;
        if (pos > this.scrollBoundRight)
            pos = this.scrollBoundRight;
        return 0 - pos;
    }
}
