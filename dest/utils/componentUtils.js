export const findParentByComponentName = (el, parentComponentName) => {
    const parentEl = el.parentElement;
    if (!parentEl)
        return null;
    if (parentEl._componentName === parentComponentName)
        return parentEl;
    return findParentByComponentName(parentEl, parentComponentName);
};
