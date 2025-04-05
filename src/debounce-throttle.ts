/** 简单的防抖 */
export const debounce = <F extends (...args: unknown[]) => void>(
  fn: F,
  wait = 0
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>) => {
    timer = setTimeout(() => {
      if (timer) {
        clearTimeout(timer);
      }
      fn(...args);
    }, wait);
  };
};

/** 简单的节流 */
export const throttle = <F extends (...args: unknown[]) => void>(
  fn: F,
  wait = 0
) => {
  let lastTime = 0;

  return (...args: Parameters<typeof fn>) => {
    const nowTime = Date.now();

    if (nowTime - lastTime > wait) {
      fn(...args);
      lastTime = nowTime;
    }
  };
};
