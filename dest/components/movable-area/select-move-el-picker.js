import { SelectMoveEl } from "./select-move-el";
import { Subject } from "rxjs";
export class SelectMoveElPicker extends SelectMoveEl {
    constructor(opts) {
        super(opts);
        this.uniformAccerleration = 0.3;
        this.itemChange = new Subject();
    }
    setPickerList(list, itemQueryName) {
        this.list = list;
        const items = this.viewEl.querySelectorAll(itemQueryName);
        let itemEl, itemTop, itemBottom;
        this.itemHeight = items[0].offsetHeight;
        this.itemHeightHalf = this.itemHeight / 2;
        const wrapperMid = this.wrapperEl.offsetHeight / 2;
        this.listInfo = this.list
            .map((pickerItem, index) => {
            itemEl = items[index];
            itemTop = itemEl.offsetTop;
            itemBottom = itemTop + this.itemHeight;
            return Object.assign(Object.assign({}, pickerItem), { el: items[index], top: itemTop, bottom: itemBottom, midLine: 0 - (itemTop + itemBottom) / 2 + wrapperMid });
        })
            .filter(i => !i.disable);
        // SET search line position
        this.findMidS = 0 - this.moveViewHeight / 2;
    }
    /**
     * @override touchEndMomentSpeed
     * @param momentSpeed
     */
    touchEndMomentSpeed(momentSpeed) {
        momentSpeed = momentSpeed * 0.15;
        let relativeS = Math.pow(momentSpeed, 2) / (2 * this.uniformAccerleration);
        relativeS = momentSpeed > 0 ? relativeS : 0 - relativeS;
        const targetS = this.currentS + relativeS;
        const nearItem = this.findNearItemByTargetS(targetS);
        this.animateRunning = true;
        this.startToDistance(nearItem.midLine, () => {
            this.animateRunning = false;
            this.setCurrentItem(nearItem);
        });
    }
    findNearItemByTargetS(targetS) {
        let preI;
        let preDistance;
        let currentDistance;
        for (let i of this.listInfo) {
            currentDistance = Math.abs(targetS - i.midLine);
            if (preDistance != undefined &&
                currentDistance > preDistance &&
                preI != undefined) {
                return preI;
            }
            preDistance = currentDistance;
            preI = i;
        }
        //@ts-ignore
        return preI;
    }
    /**
     * @override
     */
    touchEndStatic() {
        const nearItem = this.findNearItemByTargetS(this.currentS);
        this.animateRunning = true;
        if (nearItem.midLine === this.currentS)
            return;
        this.startToDistance(nearItem.midLine, () => {
            this.animateRunning = false;
            this.setCurrentItem(nearItem);
        });
    }
    setPickerIndexAndDefinePosition(value) {
        if (this.animateRunning) {
            this.breakSpeed();
        }
        const item = this.listInfo.find(i => i.value === value);
        if (!item)
            return;
        this.move((this.currentS = item.midLine));
        this.itemActive = item;
    }
    setCurrentItem(pickerItemInfo) {
        if (pickerItemInfo == this.itemActive)
            return;
        this.itemActive = pickerItemInfo;
        this.itemChange.next(pickerItemInfo);
    }
    /**
     * @override
     * @param pos
     */
    backEnd(pos) {
        if (pos === "bottom") {
            this.setCurrentItem(this.listInfo[this.listInfo.length - 1]);
        }
        else if (pos === "top") {
            this.setCurrentItem(this.listInfo[0]);
        }
    }
}
