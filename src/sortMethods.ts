/** 快速排序极限版 */
const quickSort = (arr: number[]) =>
  arr.length < 2
    ? [...arr]
    : [
        ...quickSort(arr.filter((i) => i < arr[0])),
        arr[0],
        ...quickSort(arr.filter((i) => i > arr[0])),
      ];
