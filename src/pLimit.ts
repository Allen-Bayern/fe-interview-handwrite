const pLimit = (concur: number) => {
  if (concur <= 0) {
    throw new Error("Concurrency error!");
  }

  const concurNum = Math.floor(concur);
  const queue: ((...args: unknown[]) => unknown)[] = [];
  let activeCount = 0;

  const resumeNext = () => {
    const func = queue.shift();
    if (func) {
      func();
      activeCount++;
    }
  };

  const next = () => {
    resumeNext();
    activeCount--;
  };

  async function run(
    fn: (..._args: unknown[]) => unknown,
    resolve: (...__args: unknown[]) => unknown,
    ...args: unknown[]
  ) {
    const result = (async () => fn(...args))();
    resolve(result);

    try {
      await result;
    } catch (e) {}

    next();
  }

  const enqueue = async (
    fn: (..._args: unknown[]) => unknown,
    resolve: (...__args: unknown[]) => unknown,
    ...args: unknown[]
  ) => {
    await new Promise((_resolve) => {
      queue.push(_resolve);
    }).then(run.bind(null, resolve, ...args));

    async function _internalFunc() {
      await Promise.resolve();
      if (activeCount < concurNum) {
        resumeNext();
      }
    }

    await _internalFunc();
  };

  const gen = (fn: (..._args: unknown[]) => unknown, ...args: unknown[]) => {
    return new Promise((_resolve) => {
      enqueue(fn, _resolve, ...args);
    });
  };

  return gen;
};
