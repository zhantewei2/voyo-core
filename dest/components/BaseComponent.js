export const VoyoDor = (params) => (target) => {
    target.prototype._componentName = params.name;
    target.prototype._voyoData = params;
};
/**
 * trigger afterCreate
 * @param params
 * @constructor
 */
export const VoyoTemplate = function (params) {
    if (params.renderCache === undefined)
        params.renderCache = true;
    return function (target, key) {
        target.handlers.push((self) => {
            let templateRef;
            const createEl = function (ref) {
                ref.el = document.createElement(params.tag);
                if (params.className)
                    ref.el.className = params.className;
                const change = (e) => {
                    if (e.currentTarget !== ref.el)
                        return;
                    if (ref.inserting) {
                        ref.inserting = false;
                        ref.inserted = true;
                        ref.insertClassName && ref.el.classList.remove(ref.insertClassName);
                    }
                    else if (ref.leaving) {
                        ref.leaving = false;
                        ref.inserted = false;
                        if (ref.el && ref.el.parentElement) {
                            ref.leaveClassName && ref.el.classList.remove(ref.leaveClassName);
                            ref.el.parentElement.removeChild(ref.el);
                            ref.inTree = false;
                        }
                    }
                };
                ref.el.addEventListener("animationend", change);
                return ref.el;
            };
            const checkRunning = (ref, next) => {
                if (ref.leaving) {
                    ref.leaving = false;
                    //@ts-ignore
                    ref.el.classList.remove(ref.leaveClassName);
                    next();
                    // setTimeout(()=>next(),1);
                }
                else if (ref.inserting) {
                    ref.inserting = false;
                    //@ts-ignore
                    ref.el.classList.remove(ref.insertClassName);
                    next();
                    // setTimeout(()=>next(),1);
                }
                else {
                    next();
                }
            };
            templateRef = {
                insert(container, anClassName) {
                    // if(templateRef.inserted||!templateRef.leaving)return false;
                    //just for typescript
                    if (templateRef.inserting ||
                        (templateRef.inserted && !templateRef.leaving))
                        return false;
                    if (!templateRef.el)
                        createEl(templateRef);
                    checkRunning(templateRef, () => {
                        if (!templateRef.renderCached) {
                            if (typeof params.render === "function") {
                                //@ts-ignore
                                templateRef.el.innerHTML = params.render.call(self);
                            }
                            else {
                                //@ts-ignore
                                templateRef.el.innerHTML = params.render;
                            }
                            params.renderCallback &&
                                params.renderCallback.call(self, templateRef.el);
                            if (params.renderCache)
                                templateRef.renderCached = true;
                        }
                        templateRef.container = container;
                        if (anClassName) {
                            templateRef.inserting = true;
                            //@ts-ignore
                            templateRef.el.classList.add((templateRef.insertClassName = anClassName));
                        }
                        else {
                            templateRef.inserted = true;
                        }
                        if (!templateRef.inTree) {
                            //@ts-ignore
                            container.appendChild(templateRef.el);
                            //@ts-ignore
                            params.insertedCallback &&
                                params.insertedCallback.call(self, templateRef.el);
                            templateRef.inTree = true;
                        }
                    });
                    return true;
                },
                remove(anClassName) {
                    if (templateRef.leaving ||
                        (!templateRef.inserted && !templateRef.inserting))
                        return false;
                    // if(!templateRef.inserted||!templateRef.inserting)return false;
                    checkRunning(templateRef, () => {
                        if (anClassName) {
                            if (templateRef.el) {
                                templateRef.leaving = true;
                                templateRef.el.classList.add((templateRef.leaveClassName = anClassName));
                            }
                        }
                        else {
                            //@ts-ignore
                            templateRef.el.parentElement &&
                                templateRef.el.parentElement.removeChild(templateRef.el);
                            templateRef.inTree = false;
                            templateRef.inserted = false;
                        }
                    });
                    return true;
                },
            };
            //templateRef end
            self[key] = templateRef;
        });
    };
};
/**
 * Usage
 * Same as angular decorator @Input
 * But the method of set will be triggered immediately..
 * @param name
 * @constructor
 * 已知问题：
 * 1. 不要传递 true false.请使用 1 0代替。 false 不能被setAttribute
 */
export const VoyoInput = function ({ name, defaultValue, connectedTrigger, }) {
    return (target, key) => {
        const attrName = name || key;
        let connectedTriggerRun = () => { };
        let isConnected;
        if (connectedTrigger) {
            if (target.connectedCallback) {
                const old = target.connectedCallback;
                target.connectedCallback = function () {
                    isConnected = true;
                    connectedTriggerRun();
                    old.call(this);
                };
            }
            else {
                target.connectedCallback = function () {
                    isConnected = true;
                    connectedTriggerRun();
                };
            }
        }
        (target.handlers || (target.handlers = [])).push((currentTarget) => {
            const setAttribute = currentTarget.setAttribute;
            const setValue = (k, v) => {
                if (connectedTrigger && !isConnected) {
                    connectedTriggerRun = () => {
                        currentTarget[key] = v;
                    };
                }
                else {
                    currentTarget[key] = v;
                }
            };
            currentTarget.setAttribute = (k, v) => {
                if (k === attrName && currentTarget._dirtyCheck.isNew(k, v)) {
                    setValue(k, v);
                }
                setAttribute.call(currentTarget, k, v);
                currentTarget.updated && currentTarget.updated();
            };
            if (defaultValue !== undefined) {
                setValue(key, defaultValue);
                currentTarget._dirtyCheck.isNew(key, defaultValue);
            }
        });
    };
};
