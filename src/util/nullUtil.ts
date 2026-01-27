type ReplaceNullWithUndefined<T> = {
  [K in keyof T]: null extends T[K]
    ? Exclude<T[K], null> | undefined
    : T[K];
}

/**
 * 内部函数：只处理单个对象，将 null 替换为 undefined
 * 并返回正确的转换后类型
 */
function replaceNullsInObject<T extends Record<string, any>>(
  record: T
): ReplaceNullWithUndefined<T> {
  if (record == null) {
    return record as any
  }

  const copy = { ...record } as Record<keyof T, unknown>

  for (const key in copy) {
    if (copy[key] === null) {
      copy[key] = undefined
    }
  }

  return copy as ReplaceNullWithUndefined<T>
}

export const nullUtil = {
  /**
   * 转换对象中的 null字段 为 undefined
   */
  convertObject: replaceNullsInObject,
  /**
   * 转换数组中的对象中的 null字段 为 undefined
   */
  convertArray<T extends Record<string, any>>(records: T[]): ReplaceNullWithUndefined<T>[] {
    return records.map(item => replaceNullsInObject(item))
  }
}
