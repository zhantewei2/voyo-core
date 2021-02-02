import { Subject } from "rxjs";
export class VoyoComponent extends HTMLElement {
    constructor() {
        super(...arguments);
        this.voyoConnected = new Subject();
    }
}
export class VoyoEventEmitter extends Subject {
}
