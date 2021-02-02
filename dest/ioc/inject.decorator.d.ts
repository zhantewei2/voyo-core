export interface IOCAutowiredParam {
    name: string;
}
export declare const IOCAutowired: (param: IOCAutowiredParam) => (target: any, key: string) => void;
