import { __decorate } from "tslib";
import { VoyoComponent, VoyoEventEmitter } from "../../commonComponent";
import { VoyoDor, VoyoInput } from "../../BaseComponent";
import { VoyoOutput } from "../../Output.decorator";
import { ClassManage } from "../../../utils";
import { forkJoin, Subject } from "rxjs";
import { ThumbMove } from "./thumb-move";
import { MovableMove } from "./movable-move";
import { TabBarItemComponent as tabBarItem, } from "../tab-bar-item-component/tab-bar-item.component";
import { ExcuteAfterConnected } from "../../utils";
export class TabBarClassManage {
    constructor(tabBars) {
        this.tabBars = tabBars;
    }
    setIndex(v) {
        if (this.preIndex === v)
            return;
        if (this.preItem)
            this.preItem.disActive();
        this.preIndex = v;
        this.preItem = this.tabBars[v];
        this.preItem && this.preItem.active();
    }
}
let TabBarComponent = class TabBarComponent extends VoyoComponent {
    constructor() {
        super(...arguments);
        this.outputInput = new VoyoEventEmitter();
        this.excuteAfterConnected = new ExcuteAfterConnected();
        this.pointerMoveChange = new Subject();
        this.willChange = new Subject();
        this.valueChange = new Subject();
    }
    set value(v) {
        this.setIndex(Number(v));
    }
    get value() {
        return this.index;
    }
    /**
     * layout change
     * @param type
     */
    setLayout(type) {
        type &&
            this.excuteAfterConnected.execute(() => {
                this.classManageThis.replaceClass("layout", type);
            });
    }
    mounted() {
        this.classList.add("voyo-tab-bar-container");
        this.classManageThis = new ClassManage(this);
        this.containerEl = this;
        this.thumbEl = this.shadowRoot.querySelector("#thumb");
        this.areaEl = this.shadowRoot.querySelector("#movableArea");
        this.slotEl = this.shadowRoot.querySelector("#slot");
        this.containerWidth = this.containerEl.clientWidth;
        this.thumbWidth = this.thumbEl.offsetWidth;
        if (this.disableThumb) {
            this.thumbEl.style.display = "none";
        }
        this.handleTabItems(() => {
            this.movableMove = new MovableMove(this, this.index);
            this.thumbMove = new ThumbMove(this.thumbEl, this.tabBarItemRefList, this.transitionTime, this);
            this.handlePointerMove();
            this.excuteAfterConnected.connect();
        });
        // if(this.value!==undefined)this.setIndex(this.value);
    }
    set index(v) {
        this.valueChange.next((this.index0 = v));
        this.tabBarClassManage.setIndex(v);
    }
    get index() {
        return this.index0;
    }
    setIndex(v) {
        this.excuteAfterConnected.execute(() => {
            if (v === this.index)
                return;
            this.thumbMove.toIndex(v, () => {
                this.index = v;
                this.outputInput.next(v);
            });
        });
    }
    setIndexDirect(v) {
        this.excuteAfterConnected.execute(() => {
            if (v === this.index)
                return;
            this.index = v;
            this.thumbMove.setIndex(v);
        });
    }
    itemTap(i) {
        if (i === this.index)
            return;
        this.setIndex(i);
    }
    set areaWidth(v) {
        if (v === this.areaWidth0)
            return;
        this.areaWidth0 = v;
        this.areaEl.style.width = v + "px";
    }
    get areaWidth() {
        return this.areaWidth0;
    }
    handlePointerMove() {
        this.pointerMoveChange.subscribe(progress => {
            this.thumbMove.pointerMove(progress);
        });
    }
    handleTabItems(end) {
        const slotNodes = this.slotEl.assignedNodes();
        if (!slotNodes || !slotNodes.length)
            return;
        let containerWidth = 0;
        let tabBarIndex = 0;
        this.tabBarItemRefList = [];
        const tabBarNodes = slotNodes.filter(node => node instanceof tabBarItem);
        this.tabBarClassManage = new TabBarClassManage(tabBarNodes);
        this.willChange.subscribe(i => {
            this.tabBarClassManage.setIndex(i.value);
        });
        forkJoin(tabBarNodes.map(i => i.voyoConnected)).subscribe(i => {
            tabBarNodes.forEach(node => {
                const comWidth = node.offsetWidth;
                const ref = {
                    tabBarItem: node,
                    width: comWidth,
                    tabBarEl: node,
                    index: tabBarIndex++,
                };
                this.tabBarItemRefList.push(ref);
                node.addEventListener("click", () => this.itemTap(ref.index));
                containerWidth += comWidth;
            });
            this.areaWidth = containerWidth;
            end();
        });
    }
};
__decorate([
    VoyoInput({ name: "value" })
], TabBarComponent.prototype, "value", null);
__decorate([
    VoyoInput({ defaultValue: 0.4 })
], TabBarComponent.prototype, "transitionTime", void 0);
__decorate([
    VoyoInput({ defaultValue: false })
], TabBarComponent.prototype, "disableThumb", void 0);
__decorate([
    VoyoOutput({ event: "input" })
], TabBarComponent.prototype, "outputInput", void 0);
TabBarComponent = __decorate([
    VoyoDor({
        template: `
<div class="voyo-tab-bar-area" id="movableArea">
    <slot id="slot"></slot>
    <div class="voyo-tab-bar-thumb" id="thumb">
        <div class="voyo-tab-bar-thumb-change"></div>
    </div>
</div>
    `,
        styles: '.voyo-tab-bar-area{position:relative;display:flex}.voyo-tab-bar-thumb{position:absolute;bottom:0;width:2.5rem;height:4px;will-change:transform;opacity:1}.voyo-tab-bar-thumb .voyo-tab-bar-thumb-change{height:100%;width:100%;background:var(--color-primary);top:0;left:0;will-change:transform;opacity:1;border-radius:5px}',
    })
], TabBarComponent);
export { TabBarComponent };
