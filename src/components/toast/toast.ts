import { ShowToast } from "./toast.interface";
import { AnimationIf } from "../../utils";

export class Toast {
  durationTime: number;
  containerId = "voyoc-toast-container";
  className = "voyo-toast";
  constructor(durationTime = 1000) {
    this.durationTime = durationTime;
  }
  containerEl: HTMLElement;
  createToastContainer() {
    const container: HTMLElement = document.createElement("main");
    container.id = this.containerId;
    document.documentElement.appendChild(container);
    this.containerEl = container;
  }
  createToast(message: string,dur?:number) {
    const toast: HTMLElement = document.createElement("div");
    toast.className = "voyo-toast";
    const animateIf = new AnimationIf(toast, this.className, this.containerEl);
    toast.innerHTML = message;
    animateIf.open();
    setTimeout(() => {
      animateIf.close();
    }, dur||this.durationTime);
  }
  show: ShowToast = (message: string,durationTime?:number) => {
    if (!this.containerEl) this.createToastContainer();
    this.createToast(message,durationTime);
  };
}

export { ShowToast };
