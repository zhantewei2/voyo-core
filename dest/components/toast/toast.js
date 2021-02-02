import { AnimationIf } from "../../utils";
export class Toast {
    constructor(durationTime = 1000) {
        this.containerId = "voyoc-toast-container";
        this.className = "voyo-toast";
        this.show = (message, durationTime) => {
            if (!this.containerEl)
                this.createToastContainer();
            this.createToast(message, durationTime);
        };
        this.durationTime = durationTime;
    }
    createToastContainer() {
        const container = document.createElement("main");
        container.id = this.containerId;
        document.documentElement.appendChild(container);
        this.containerEl = container;
    }
    createToast(message, dur) {
        const toast = document.createElement("div");
        toast.className = "voyo-toast";
        const animateIf = new AnimationIf(toast, this.className, this.containerEl);
        toast.innerHTML = message;
        animateIf.open();
        setTimeout(() => {
            animateIf.close();
        }, dur || this.durationTime);
    }
}
