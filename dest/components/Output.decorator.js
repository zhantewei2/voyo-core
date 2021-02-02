export const VoyoOutput = function ({ event: eventName, }) {
    return (target, key) => {
        (target.handlers || (target.handlers = [])).push((currentTarget) => {
            const emitter = currentTarget[key];
            emitter.subscribe((eventValue) => {
                currentTarget.dispatchEvent(new CustomEvent(eventName, { detail: eventValue }));
            });
        });
    };
};
