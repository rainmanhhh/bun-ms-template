import type { SQL } from 'drizzle-orm'
import type { Table } from 'drizzle-orm/table'
import * as conditions from 'drizzle-orm/sql/expressions/conditions'

export const dbUtil = {
  /**
   * 为复杂查询（例如分页）构建查询条件
   * @param table
   * @param fn
   * @example
   * ```ts
   * const where = dbUtil.condition(table, (t, c) => c.and(
   *   c.eq(t.foo, 'foo'),
   *   c.gte(t.bar, 'bar'),
   * ))
   * const total = await db.$count(table, where)
   * const list = await db.query.table.findMany({
   *   where,
   *   limit: pageSize,
   *   offset: (pageNo - 1) * pageSize,
   *   orderBy: (t, { desc }) => desc(t.id),
   * })
   * return {
   *   status: 200,
   *   headers: {
   *     xTotalCount: total
   *   },
   *   body: list
   * }
   * ```
   */
  condition<T extends Table>(table: T, fn: (t: T, c: typeof conditions) => (SQL | undefined)) {
    return fn(table, conditions)
  }
}
