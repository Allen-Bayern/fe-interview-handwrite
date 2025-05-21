const deepClone = <T>(obj: T, m = new WeakMap()): T => {
  if (typeof obj !== "object" || obj === null) return obj;
  if (m.has(obj)) return m.get(obj);

  // 处理容器类型
  if (obj instanceof Set) {
    const copied = new Set();
    m.set(obj, copied);
    obj.forEach((v) => copied.add(deepClone(v, m)));
    return copied as T;
  }

  if (obj instanceof Map) {
    const copied = new Map();
    m.set(obj, copied);
    obj.forEach((v, k) => copied.set(deepClone(k, m), deepClone(v, m)));
    return copied as T;
  }

  // 处理数组/普通对象
  const copied = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  m.set(obj, copied);

  const keys = [
    ...Object.getOwnPropertyNames(obj),
    ...Object.getOwnPropertySymbols(obj),
  ];
  keys.forEach((k) => {
    copied[k] = deepClone(obj[k], m);
  });

  return copied as T;
};
