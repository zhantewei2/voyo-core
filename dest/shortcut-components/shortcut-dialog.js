import { registryDialog } from "../components/registry/dialog";
export const toRegistryDialog = () => {
    registryDialog();
    const dialog = document.createElement("voyoc-dialog");
    let showContent, confirmCb, cancelCb, confirmText = "确定", cancelText = "取消";
    document.documentElement.appendChild(dialog);
    dialog.addEventListener("confirm", (e) => {
        confirmCb && confirmCb(e);
    });
    dialog.addEventListener("cancel", (e) => {
        cancelCb && cancelCb(e);
    });
    const setAttr = (key, val) => dialog.setAttribute(key, val);
    return {
        open: (opts) => {
            confirmCb = opts.confirm;
            cancelCb = opts.cancel;
            if (opts.disableConfirm)
                setAttr("disableConfirm", opts.disableConfirm);
            setAttr("doubleConfirm", opts.doubleConfirm === undefined || opts.doubleConfirm ? 1 : 0);
            setAttr("confirmText", opts.confirmText || confirmText);
            setAttr("cancelText", opts.cancelText || cancelText);
            if (typeof opts.html === "string") {
                dialog.innerHTML = opts.html;
            }
            else if (opts.html instanceof HTMLElement) {
                dialog.appendChild(opts.html);
            }
            dialog.open(opts);
        },
        close: () => dialog.close()
    };
};
