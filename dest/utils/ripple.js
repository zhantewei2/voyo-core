import { isMobile } from "@ztwx/utils";
const baseSize = 12;
const removeTime = 400;
const removeEndTime = 400;
const body = document.body;
export const autoSizeByWidth = (el, defaultSize = 30) => {
    return el.offsetWidth ? el.offsetWidth / 6 : defaultSize;
};
const switchClassName = (opts) => {
    return opts.css
        ? opts.css
        : opts.deep
            ? "ripple-wrapper-deep"
            : "ripple-wrapper-light";
};
export const handleRipple = (el, opts) => {
    let one, rect, x, y, halfSize = baseSize / 2, 
    //已插入的ripple
    rippleQueue = [], 
    //删除Bubbling
    removeQueueTimeout, 
    //删除touchend class:
    removeEndTimeout, clearRemoveQueue = () => {
        clearTimeout(removeQueueTimeout);
        removeQueueTimeout = null;
    }, clearTouchEnd = () => {
        clearTimeout(removeEndTimeout);
        removeEndTimeout = null;
    };
    const wrapper = document.createElement("span");
    const className = switchClassName(opts);
    wrapper.classList.add("ripple-wrapper", className);
    el.appendChild(wrapper);
    const listenTouch = (e) => {
        if (opts.disabled)
            return;
        el.classList.add("ripple-callback");
        rect = el.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        one = document.createElement("span");
        let fontSize;
        if (opts.size) {
            fontSize = opts.size;
        }
        else if (opts.autoSize) {
            fontSize = autoSizeByWidth(el);
        }
        if (fontSize) {
            one.style.fontSize = fontSize + "px";
            halfSize = fontSize / 2;
        }
        one.className = "ripple-bubbling";
        one.style.left = x - halfSize + "px";
        one.style.top = y - halfSize + "px";
        rippleQueue.push(one);
        wrapper.appendChild(one);
        if (removeQueueTimeout)
            clearRemoveQueue();
        if (removeEndTime)
            clearTouchEnd();
        removeQueueTimeout = setTimeout(() => {
            rippleQueue.forEach((child) => {
                wrapper.removeChild(child);
            });
            rippleQueue = [];
        }, removeTime);
        wrapper.classList.add("ripple-active");
    };
    const touchEnd = () => {
        el.classList.remove("ripple-callback");
        setTimeout(() => wrapper.classList.remove("ripple-active"), removeEndTime);
    };
    if (isMobile) {
        el.addEventListener("touchstart", (e) => {
            listenTouch(e.touches[0]);
        }, { passive: true });
        el.addEventListener("touchend", touchEnd, { passive: true });
    }
    else {
        el.addEventListener("mousedown", e => {
            listenTouch(e);
            body.addEventListener("mouseup", function mouseUp() {
                touchEnd();
                body.removeEventListener("mouseup", mouseUp);
            });
        });
    }
    // el.addEventListener('contextmenu',e=>e.preventDefault());
};
