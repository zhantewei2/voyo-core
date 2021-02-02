export class DirtyCheck {
    constructor() {
        this.dirtyStore = {};
    }
    isNew(key, v) {
        if (this.dirtyStore[key] !== v) {
            this.dirtyStore[key] = v;
            return true;
        }
        else {
            return false;
        }
    }
}
