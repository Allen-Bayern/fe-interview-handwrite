const selfPow = (x: number, n = 1) => {
  if (!Number.isInteger(n)) {
    throw new Error("n是整数");
  }

  if (x === n && !x) {
    throw new Error("不可以同时为0");
  }

  if (!n) {
    return 1;
  }

  if (n === 1) {
    return x;
  }

  const { abs, floor } = Math;
  const nHalf = floor(abs(n) / 2);
  const valueHalf = selfPow(x, nHalf);
  const isBelowZero = n < 0;

  if (abs(n) % 2) {
    return isBelowZero
      ? 1 / (valueHalf * valueHalf * x)
      : valueHalf * valueHalf * x;
  }

  return isBelowZero ? (1 / valueHalf) * valueHalf : valueHalf * valueHalf;
};
