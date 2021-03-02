import { DialogComponent, DialogOpenOpts as opts } from "../components/registry/dialog";
export interface DialogOpenOpts extends opts {
    confirm?: (dialogRef: DialogComponent) => void;
    cancel?: (dialogRef: DialogComponent) => void;
    confirmText?: string;
    cancelText?: string;
    disableAutoClose?: boolean;
    disableCancel?: boolean;
    headerTitle?: string;
    doubleConfirm?: boolean;
    disableConfirm?: boolean;
}
export interface DialogRegistryResult {
    open: (opts: DialogOpenOpts) => void;
    close: () => void;
}
export declare const toRegistryDialog: () => DialogRegistryResult;
