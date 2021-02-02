import { SelectMoveEl, SelectMoveElOpts } from "./select-move-el";
import { Subject } from "rxjs";

export interface PickerItem {
  value: string | number;
  label: string;
  disable?: boolean;
}

export interface PickerItemInfo extends PickerItem {
  el: HTMLElement;
  top: number;
  bottom: number;
  midLine: number;
}
export class SelectMoveElPicker extends SelectMoveEl {
  list: PickerItem[];
  listInfo: PickerItemInfo[];
  findMidS: number;
  itemHeight: number;
  itemHeightHalf: number;
  uniformAccerleration = 0.3;
  itemActive: PickerItemInfo;
  itemChange: Subject<PickerItemInfo> = new Subject<PickerItemInfo>();
  constructor(opts: SelectMoveElOpts) {
    super(opts);
  }
  setPickerList(list: PickerItem[], itemQueryName: string) {
    this.list = list;
    const items: HTMLElement[] = this.viewEl.querySelectorAll(
      itemQueryName,
    ) as any;
    let itemEl: HTMLElement, itemTop: number, itemBottom: number;
    this.itemHeight = items[0].offsetHeight;
    this.itemHeightHalf = this.itemHeight / 2;
    const wrapperMid = this.wrapperEl.offsetHeight / 2;
    this.listInfo = this.list
      .map((pickerItem, index) => {
        itemEl = items[index];
        itemTop = itemEl.offsetTop;
        itemBottom = itemTop + this.itemHeight;
        return {
          ...pickerItem,
          el: items[index],
          top: itemTop,
          bottom: itemBottom,
          midLine: 0 - (itemTop + itemBottom) / 2 + wrapperMid,
        };
      })
      .filter(i => !i.disable);
    // SET search line position
    this.findMidS = 0 - this.moveViewHeight / 2;
  }

  /**
   * @override touchEndMomentSpeed
   * @param momentSpeed
   */
  touchEndMomentSpeed(momentSpeed: number) {
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

  findNearItemByTargetS(targetS: number): PickerItemInfo {
    let preI: PickerItemInfo | undefined;
    let preDistance: number | undefined;
    let currentDistance: number;
    for (let i of this.listInfo) {
      currentDistance = Math.abs(targetS - i.midLine);
      if (
        preDistance != undefined &&
        currentDistance > preDistance &&
        preI != undefined
      ) {
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
    if (nearItem.midLine === this.currentS) return;
    this.startToDistance(nearItem.midLine, () => {
      this.animateRunning = false;
      this.setCurrentItem(nearItem);
    });
  }

  setPickerIndexAndDefinePosition(value: number | string) {
    if (this.animateRunning) {
      this.breakSpeed();
    }
    const item: PickerItemInfo | undefined = this.listInfo.find(
      i => i.value === value,
    );

    if (!item) return;
    this.move((this.currentS = item.midLine));
    this.itemActive = item;
  }

  setCurrentItem(pickerItemInfo: PickerItemInfo) {
    if (pickerItemInfo == this.itemActive) return;
    this.itemActive = pickerItemInfo;
    this.itemChange.next(pickerItemInfo);
  }

  /**
   * @override
   * @param pos
   */
  backEnd(pos: "top" | "bottom") {
    if (pos === "bottom") {
      this.setCurrentItem(this.listInfo[this.listInfo.length - 1]);
    } else if (pos === "top") {
      this.setCurrentItem(this.listInfo[0]);
    }
  }
}
