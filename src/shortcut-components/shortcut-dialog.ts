import {registryDialog,DialogComponent,DialogOpenOpts as opts} from "../components/registry/dialog";

export interface DialogOpenOpts extends opts {
  confirm? : (dialogRef: DialogComponent) => void;
  cancel? : (dialogRef: DialogComponent) => void;
  confirmText?: string;
  cancelText?: string;
  disableAutoClose? : boolean;
  disableCancel? : boolean;
  headerTitle? : string;
  doubleConfirm?: boolean;
  disableConfirm?: boolean;
}

export interface DialogRegistryResult {
  open:(opts:DialogOpenOpts)=>void,
  close:()=>void
}

export const toRegistryDialog=():DialogRegistryResult=>{
  registryDialog();
  const dialog:DialogComponent=document.createElement("voyoc-dialog") as DialogComponent;
  let
    showContent:string,
    confirmCb:((ref:DialogComponent)=>void)|undefined,
    cancelCb:((ref:DialogComponent)=>void)|undefined,
    confirmText:string="确定",
    cancelText:string="取消";

  document.documentElement.appendChild(dialog);
  dialog.addEventListener("confirm",(e:any)=>{
    confirmCb&&confirmCb(e)
  });
  dialog.addEventListener("cancel",(e:any)=>{
    cancelCb&&cancelCb(e)
  });

  const setAttr=(key:string,val:any)=>dialog.setAttribute(key,val);


  return {
    open:(opts:DialogOpenOpts)=>{
      showContent=opts.html||"";
      confirmCb=opts.confirm;
      cancelCb=opts.cancel;

      setAttr("doubleConfirm",opts.doubleConfirm===undefined||opts.doubleConfirm?1:0);
      setAttr("confirmText",opts.confirmText||confirmText);
      setAttr("cancelText",opts.cancelText||cancelText);
      dialog.innerHTML=`
        ${showContent}
      `
      dialog.open(opts);
    },
    close:()=>dialog.close()
  }
}