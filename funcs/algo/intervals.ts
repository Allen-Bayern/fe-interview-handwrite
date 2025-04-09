const mergeIntervals = (intervals: number[][]): number[][] => {
  if (intervals.length <= 1) {
    return intervals;
  }

  const sortedIntervals = [...intervals].sort(([first], [sec]) => first - sec);
  const res: number[][] = [];
  sortedIntervals.forEach((item) => {
    if (!res.length) {
      res.push(item);
    } else {
      const prev = res.pop()!;
      const [prevStart, prevEnd] = prev;
      const [curStart, curEnd] = item;

      if (prevEnd >= curStart) {
        const newItem = [prevStart, Math.max(prevEnd, curEnd)];
        res.push(newItem);
      } else {
        res.push(prev);
        res.push(item);
      }
    }
  });

  return res;
};

/** 合并两个 */
const mergeTwo = (first: number[], second: number[]): number[][] => {
  if (first.length !== second.length) {
    throw new Error("两数组长度必须都为2");
  }
  if (first.length !== 2) {
    throw new Error("两数组长度必须都为2");
  }

  let realFirst = first;
  let realSecond = second;
  if (first[0] > second[0]) {
    realFirst = second;
    realSecond = first;
  }

  const [firstStart, firstEnd] = realFirst;
  const [secondStart, secondEnd] = realSecond;

  if (firstEnd >= secondStart) {
    return [[firstStart, Math.max(firstEnd, secondEnd)]];
  }

  return [realFirst, realSecond];
};

const insertIntervals = (
  intervals: number[][],
  newInterval: number[]
): number[][] => {
  // 左边为空自然直接返回
  if (!intervals.length) {
    return [newInterval];
  }

  if (intervals.length === 1) {
    return mergeTwo(intervals[0], newInterval);
  }

  const [first] = intervals;
  let res: number[][] = [];
  let isNewPushed = false;

  if (newInterval[0] < first[0]) {
    res.push(newInterval);
    isNewPushed = true;
  } else {
    res.push(first);
  }

  const restArray = isNewPushed ? intervals : intervals.slice(1);
  restArray.forEach((item) => {
    const prev = res.pop()!;

    let current = item;
    if (!isNewPushed && newInterval[0] < item[0]) {
      current = newInterval;
    }

    let merged = mergeTwo(prev, current);
    if (!isNewPushed && current === newInterval) {
      isNewPushed = true;
      const mergedLast = merged.pop()!;
      const newMerged = mergeTwo(mergedLast, item);
      merged = [...merged, ...newMerged];
    }

    res = [...res, ...merged];
  });

  if (!isNewPushed) {
    const newLastOne = res.pop()!;
    res = [...res, ...mergeTwo(newLastOne, newInterval)];
  }

  return res;
};

const testIntervals = [
  [1, 3],
  [2, 6],
  [8, 10],
  [15, 18],
];

console.log(mergeIntervals(testIntervals));
