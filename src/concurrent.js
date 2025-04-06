function concurrentPool(tasks, maxConcurrent) {
  return new Promise((resolve) => {
    const results = [];
    let currentIndex = 0;
    let completedCount = 0;

    // 递归执行器
    const runTask = () => {
      while (
        currentIndex < tasks.length &&
        completedCount - currentIndex < maxConcurrent
      ) {
        const taskIndex = currentIndex++;
        const task = tasks[taskIndex];

        task()
          .then((res) => (results[taskIndex] = res))
          .catch((err) => (results[taskIndex] = err))
          .finally(() => {
            completedCount++;
            if (completedCount === tasks.length) {
              resolve(results);
            } else {
              runTask(); // 动态补充新任务
            }
          });
      }
    };

    runTask(); // 启动初始批次
  });
}
