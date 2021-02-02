export const findParentByComponentName = (
  el: HTMLElement,
  parentComponentName: string,
): HTMLElement | null => {
  const parentEl: HTMLElement | null = el.parentElement;
  if (!parentEl) return null;
  if ((parentEl as any)._componentName === parentComponentName) return parentEl;
  return findParentByComponentName(parentEl, parentComponentName);
};
