export class ClassManage {
    constructor(el) {
        this.store = {};
        this.hisStore = {};
        this.el = el;
    }
    replaceClass(key, value) {
        if (this.store[key])
            this.el.classList.remove(this.store[key]);
        if (value)
            this.el.classList.add((this.store[key] = value));
    }
    replaceHis(key, value) {
        this.hisStore[key] = this.store[key];
        this.replaceClass(key, value);
    }
    replaceHisBack(key) {
        const hisVal = this.hisStore[key];
        if (hisVal !== undefined) {
            this.replaceClass(key, hisVal);
            this.hisStore[key] = undefined;
        }
    }
    toggleClass(key, show) {
        if (show && !this.store[key]) {
            this.el.classList.add(key);
            this.store[key] = "true";
        }
        else if (!show && this.store[key]) {
            this.el.classList.remove(key);
            delete this.store[key];
        }
    }
}
