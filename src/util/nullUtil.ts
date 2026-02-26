/**
 * 递归类型：将任意嵌套结构中的 null 替换为 undefined
 */
type DeepReplaceNullWithUndefined<T> =
// 基础类型：null 替换为 undefined，其他类型保持不变
  T extends null
    ? undefined
    : // 数组类型：递归处理数组元素
    T extends Array<infer U>
      ? Array<DeepReplaceNullWithUndefined<U>>
      : // 对象类型（排除数组/基础类型）：递归处理每个属性
      T extends Record<string, any>
        ? { [K in keyof T]: DeepReplaceNullWithUndefined<T[K]> }
        : // 其他类型（number/string/boolean 等）：保持不变
        T

/**
 * 内部函数：递归处理单个值，将 null 替换为 undefined（支持嵌套对象/数组）
 */
function deepReplaceNulls<T>(value: T): DeepReplaceNullWithUndefined<T> {
  // 1. 基础类型：null 直接替换为 undefined
  if (value == null) {
    return undefined as DeepReplaceNullWithUndefined<T>
  }

  // 2. 数组类型：递归处理每个元素
  if (Array.isArray(value)) {
    return value.map(item => deepReplaceNulls(item)) as DeepReplaceNullWithUndefined<T>
  }

  // 3. 对象类型（排除 null/数组/基础类型）：递归处理每个属性
  if (typeof value === 'object') {
    const copy = { ...value } as Record<string, unknown>
    for (const key in copy) {
      copy[key] = deepReplaceNulls(copy[key])
    }
    return copy as DeepReplaceNullWithUndefined<T>
  }

  // 4. 其他基础类型（string/number/boolean/undefined 等）：直接返回
  return value as DeepReplaceNullWithUndefined<T>
}

export const nullUtil = {
  /**
   * 递归转换对象（含嵌套对象/数组）中的 null 字段为 undefined
   */
  convertObject: <T extends Record<string, any>>(record: T) =>
    deepReplaceNulls(record) as DeepReplaceNullWithUndefined<T>,

  /**
   * 递归转换数组中的每个对象（含嵌套对象/数组）中的 null 字段为 undefined
   */
  convertArray: <T extends Record<string, any>>(records: T[] | undefined | null) =>
    deepReplaceNulls(records ?? []) as DeepReplaceNullWithUndefined<T>[]
}
