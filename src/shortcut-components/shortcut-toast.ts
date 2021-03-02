import {Toast} from "../components/toast/toast";

export type ToastParams =(message:string,dur?:number)=>void;

export const toRegistryToast = ():ToastParams=> {
  const toast = new Toast();
  return (message: string, dur?: number) => {
    toast.show(message, dur);
  };
};
