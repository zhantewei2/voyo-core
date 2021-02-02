import { VoyoComponentParams, VoyoTemplateParams } from "./commonComponent";
export declare const VoyoDor: (params: VoyoComponentParams) => (target: any) => void;
export interface VoyoInputParams {
    name?: string;
    defaultValue?: any;
    connectedTrigger?: boolean;
}
/**
 * trigger afterCreate
 * @param params
 * @constructor
 */
export declare const VoyoTemplate: (params: VoyoTemplateParams) => (this: any, target: any, key: string) => void;
/**
 * Usage
 * Same as angular decorator @Input
 * But the method of set will be triggered immediately..
 * @param name
 * @constructor
 * 已知问题：
 * 1. 不要传递 true false.请使用 1 0代替。 false 不能被setAttribute
 */
export declare const VoyoInput: ({ name, defaultValue, connectedTrigger, }: VoyoInputParams) => (target: any, key: string) => void;
