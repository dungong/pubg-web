export function debounce(func: Function, wait: number, leading = false) {
  let inDebounce;
  return function () {
    const context = this;
    let callNow = leading && !inDebounce;

    const later = () => {
      inDebounce = null;
      if (!leading) func.apply(context, arguments);
    };

    clearTimeout(inDebounce);
    inDebounce = setTimeout(later, wait);

    if (callNow) func.apply(context, arguments);
  };
}

export function throttle(callback: Function, waitUntil: number) {
  let timer;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        callback.apply(this, arguments);
        timer = null;
      }, waitUntil);
    }
  };
}

export function clickOutside(
  node: HTMLElement,
  handler: () => void
): { destroy: () => void } {
  const onClick = (event: MouseEvent) =>
    node &&
    !node.contains(event.target as HTMLElement) &&
    !event.defaultPrevented &&
    handler();
  document.addEventListener("click", onClick, true);

  return {
    destroy() {
      document.removeEventListener("click", onClick, true);
    },
  };
}
