declare class IOC {
    iocStore: Record<string, any>;
    constructor();
    provide(iocServiceId: string, IocService: any, cover?: boolean, handler?: (obj: any) => any): void;
    getService(iocServiceId: string): any;
}
declare const ioc: IOC;
export { IOC, ioc };
