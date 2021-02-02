export interface VoyoOutputParams {
    event: string;
}
export declare const VoyoOutput: ({ event: eventName, }: VoyoOutputParams) => (target: any, key: string) => void;
