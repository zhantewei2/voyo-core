export class TapInput {
  el: HTMLElement;
  constructor() {
    this.el = document.createElement("div");
    this.el.className = "_input __visual-input";
  }
  getInputEl() {
    return this.el;
  }
  setValue(v: string) {
    this.el.innerText = v;
  }
}
