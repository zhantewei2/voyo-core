export class TapInput {
    constructor() {
        this.el = document.createElement("div");
        this.el.className = "_input __visual-input";
    }
    getInputEl() {
        return this.el;
    }
    setValue(v) {
        this.el.innerText = v;
    }
}
