const pLimit = (concur: number) => {
  const queue: ((...args: unknown[]) => void)[] = [];
  let activeCount = 0;

  function resumeNext() {
    if (activeCount < concur && queue.length) {
      const curFunc = queue.shift();
      // 防止跑空
      if (curFunc) {
        curFunc();
        activeCount++;
      }
    }
  }

  function next() {
    resumeNext();
    activeCount--;
  }

  async function run(
    _fn: (...args: unknown[]) => unknown,
    resolve: (...args: unknown[]) => void,
    ...args: unknown[]
  ) {
    const result = (async () => _fn(...args))();
    resolve(result);

    try {
      await result;
    } catch {}

    next();
  }

  function _enqueue(
    _fn: (...args: unknown[]) => unknown,
    resolve: (...args: unknown[]) => void,
    ...args: unknown[]
  ) {
    new Promise((_resolve) => {
      queue.push(_resolve);
    }).then(run.bind(null, _fn, resolve, ...args));

    async function _internalFn() {
      await Promise.resolve();
      if (activeCount < concur) {
        resumeNext();
      }
    }

    _internalFn();
  }

  const gen = (fn: (...args: unknown[]) => unknown, ..._args: unknown[]) => {
    return new Promise((_resolve) => {
      _enqueue(fn, _resolve, ..._args);
    });
  };

  return gen;
};
