export class ClassManage {
  el: HTMLElement;
  store: Record<string, string | undefined> = {};
  hisStore: Record<string, string | undefined> = {};

  constructor(el: HTMLElement) {
    this.el = el;
  }
  replaceClass(key: string, value: string) {
    if (this.store[key]) this.el.classList.remove(this.store[key] as string);
    if (value) this.el.classList.add((this.store[key] = value));
  }
  replaceHis(key: string, value: string) {
    this.hisStore[key] = this.store[key];
    this.replaceClass(key, value);
  }
  replaceHisBack(key: string) {
    const hisVal = this.hisStore[key];
    if (hisVal !== undefined) {
      this.replaceClass(key, hisVal);
      this.hisStore[key] = undefined;
    }
  }
  toggleClass(key: string, show: boolean) {
    if (show && !this.store[key]) {
      this.el.classList.add(key);
      this.store[key] = "true";
    } else if (!show && this.store[key]) {
      this.el.classList.remove(key);
      delete this.store[key];
    }
  }
}
