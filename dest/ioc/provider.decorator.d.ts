export interface IOCProviderParam {
    name?: string;
    handler?: (entity: any) => void;
    cover?: boolean;
}
export declare const IOCProvider: ({ name, cover, handler }: IOCProviderParam) => (target: any) => void;
