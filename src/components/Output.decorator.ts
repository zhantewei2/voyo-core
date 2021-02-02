import { VoyoEventEmitter } from "./commonComponent";

export interface VoyoOutputParams {
  event: string;
}

export const VoyoOutput = function({
  event: eventName,
}: VoyoOutputParams) {
  return (target: any, key: string) => {
    (target.handlers || (target.handlers = [])).push((currentTarget: any) => {
      const emitter: VoyoEventEmitter<any> = currentTarget[key];
      emitter.subscribe((eventValue: any) => {
        currentTarget.dispatchEvent(
          new CustomEvent(eventName, { detail: eventValue }),
        );
      });
    });
  };
};
