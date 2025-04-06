/** 并发 */
export const concurrentPool = <
  F extends (...args: unknown[]) => Promise<unknown>
>(
  tasks: F[],
  maxConcurrent: number
) =>
  new Promise((resolve) => {
    const results: unknown[] = [];
    /** 当前index */
    let currentIndex = 0;
    /** 完成数 */
    let completedCount = 0;

    const runTask = () => {
      const { length: taskCount } = tasks;
      while (
        currentIndex < taskCount &&
        completedCount - currentIndex < maxConcurrent
      ) {
        const taskIndex = currentIndex++;
        const task = tasks[taskIndex];

        task()
          .then((res) => {
            results.push(res);
          })
          .catch((err) => {
            results.push(err);
          })
          .finally(() => {
            if (++completedCount === taskCount) {
              resolve(results);
            } else {
              runTask();
            }
          });
      }
    };

    runTask();
  });
