import { ShowToast } from "./toast.interface";
export declare class Toast {
    durationTime: number;
    containerId: string;
    className: string;
    constructor(durationTime?: number);
    containerEl: HTMLElement;
    createToastContainer(): void;
    createToast(message: string, dur?: number): void;
    show: ShowToast;
}
export { ShowToast };
