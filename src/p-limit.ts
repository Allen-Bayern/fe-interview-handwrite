const methodsPool = (concur: number) => {
  let queue: (() => any)[] = [];

  let activeTasks = 0;

  const next = () => {
    activeTasks--;

    if (queue.length) {
      (queue.shift() as () => void)();
    }
  };

  const run = async <Fn extends (...args: any[]) => any>(
    fn: Fn,
    resolve: (resolveArg: ReturnType<Fn>) => void,
    ...args: Parameters<Fn>
  ) => {
    activeTasks++;

    const res = (async () => fn(...args))();
    resolve(res as ReturnType<Fn>);

    try {
      await res;
    } catch (e) {}

    next();
  };

  const enqueue = <Fn extends (...args: any[]) => any>(
    fn: Fn,
    resolve: (resolveArg: ReturnType<Fn>) => void,
    ...args: Parameters<Fn>
  ) => {
    queue.push(run(fn, resolve, ...args));

    if (queue.length && activeTasks < concur) {
      (queue.shift() as () => void)();
    }
  };

  const generator = (fn, ...args) =>
    new Promise((reso) => {
      enqueue(fn, reso, ...args);
    });

  Object.defineProperties(generator, {
    active: {
      get: () => activeTasks,
    },
    pendingCount: {
      get: () => queue.length,
    },
    clear: {
      value() {
        queue = [];
      },
    },
  });

  return generator;
};
