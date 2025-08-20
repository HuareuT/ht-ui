// 原生实现omit函数
export function omitKeys(obj, keys) {
  const result = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
