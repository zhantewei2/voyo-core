import { Toast } from "../components/toast/toast";
export const toRegistryToast = () => {
    const toast = new Toast();
    return (message, dur) => {
        toast.show(message, dur);
    };
};
