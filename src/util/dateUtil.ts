import type { Dayjs, QUnitType } from 'dayjs'
import dayjs, { isDayjs } from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
/**
 * Date or string value will be converted to Dayjs by call dayjs function;
 * number means days from now, eg: 0 means today, -1 means yesterday, 1 means tomorrow
 */
export type DATE = Dayjs | Date | string | number

export interface DateRange<S extends DATE = DATE, E extends DATE = S> {
  start: S
  end: E
}

/**
 * dayjs: 0000-01-01 00:00:00
 */
function min(): Dayjs {
  return dayjs('0000-01-01 00:00:00')
}

/**
 * dayjs: 9999-12-31 23:59:59
 */
function max(): Dayjs {
  return dayjs('9999-12-31 23:59:59')
}

/**
 * 将`date`转为{@link Dayjs}对象
 * @param date
 * @param defaultValue 若`date`为`undefined`或`null`或空字符串，则使用该默认值（不传则使用{@link min}）
 */
function toDayjs(date: DATE | undefined | null, defaultValue: DATE = min()): Dayjs {
  let d: Dayjs
  let value = date
  if (value == null || value === '')
    value = defaultValue
  if (typeof value === 'number')
    d = dayjs().add(value, 'day')
  else if (isDayjs(value))
    d = value
  else
    d = dayjs(value)

  return d
}

export const dateUtil = {
  toDayjs,
  /**
   * convert unix timestamp(seconds) to dayjs object
   * @param unixSeconds
   */
  toDayjsFromUnix(unixSeconds: number) {
    return dayjs.unix(unixSeconds)
  },
  /**
   *
   * @param date default: now
   * @param pattern default: 'YYYY-MM-DD'
   */
  dateStr(date: DATE = dayjs(), pattern = 'YYYY-MM-DD') {
    if (date === '')
      return ''
    const d = toDayjs(date)
    return d.format(pattern)
  },
  /**
   *
   * @param date default: now
   * @param pattern default: 'HH:mm:ss'
   */
  timeStr(date: DATE = dayjs(), pattern = 'HH:mm:ss') {
    if (date === '')
      return ''
    const d = toDayjs(date)
    return d.format(pattern)
  },
  /**
   * WARNING: default output format(YYYY-MM-DD HH:mm:ss) should not be used for api date param,
   * because new Date(YYYY-MM-DD HH:mm:ss) not supported by IOS
   * @param date default: now
   * @param pattern default: 'YYYY-MM-DD HH:mm:ss'
   * @example dateUtil.datetimeStr(0, 'YYYYMMDDHHmmss') // 0 means now(dayjs() add 0 day)
   */
  datetimeStr(date: DATE = dayjs(), pattern = 'YYYY-MM-DD HH:mm:ss') {
    if (date === '')
      return ''
    const d = toDayjs(date)
    return d.format(pattern)
  },
  /**
   * use pattern `YYYYMMDDHHmmss` to format datetime string
   * @param date default: now
   * @example dateUtil.compactDatetimeStr(1) // 1 means tomorrow(dayjs() add 1 day)
   */
  compactDatetimeStr(date: DATE = dayjs()) {
    return dateUtil.datetimeStr(date, 'YYYYMMDDHHmmss')
  },
  /**
   * use pattern `MM-DD HH:mm` to format datetime string
   * @param date default: now
   * @example dateUtil.shortDatetimeStr(1) // 1 means tomorrow(dayjs() add 1 day)
   */
  shortDatetimeStr(date: DATE = dayjs()) {
    return dateUtil.datetimeStr(date, 'MM-DD HH:mm')
  },
  /**
   * create a DateRange object
   * @param start default: 00:00:00 at today
   * @param end default: 00:00:00 at the next day of start
   */
  range(
    start: DATE = dayjs().startOf('day'),
    end: DATE = toDayjs(start).endOf('day')
  ): DateRange {
    return {
      start,
      end
    }
  },
  /**
   * create a DateRange object with string format
   * e.g. `rangeStr(-30, 0)` means last 30 days(including today)
   * @param start default: 00:00:00 at today
   * @param end default: 00:00:00 at the next day of start
   * @param pattern default: YYYY-MM-DD
   */
  rangeStr(
    start: DATE = dayjs().startOf('day'),
    end: DATE = toDayjs(start).add(1, 'day').startOf('day'),
    pattern = 'YYYY-MM-DD'
  ): DateRange<string> {
    return {
      start: dateUtil.dateStr(start, pattern),
      end: dateUtil.dateStr(end, pattern)
    }
  },
  /**
   * 当前unix时间戳（毫秒）
   */
  currentMilliSeconds() {
    return new Date().getTime()
  },
  /**
   * 当前unix时间戳（秒）
   */
  currentSeconds() {
    return Math.floor(dateUtil.currentMilliSeconds() / 1000)
  },
  /**
   * dayjs: 当前时间
   */
  now() {
    return dayjs()
  },
  min,
  max,
  /**
   * 当日00:00
   */
  today() {
    return dayjs().startOf('day')
  },
  /**
   * 明日00:00
   */
  tomorrow() {
    return dayjs().startOf('day').add(1, 'day')
  },
  /**
   * 昨日00:00
   */
  yesterday() {
    return dayjs().startOf('day').subtract(1, 'day')
  },
  /**
   * 比较t1与t2，返回从t1到t2经历了多少时间（若t2比t1更早，则结果为负数）
   * - t2省略时，则比较t1与当前时间
   * - 例1：`diff('year', '2019, '2022')`的值为3
   * - 例2：假设当前为2024年，则`diff('year', '2025')`的值为-1
   * @param unit
   * @param t1
   * @param t2
   */
  diff(unit: QUnitType, t1: DATE, t2: DATE = dayjs()) {
    const d1 = dateUtil.toDayjs(t1)
    const d2 = dateUtil.toDayjs(t2)
    return d2.diff(d1, unit)
  },
  /**
   * 比较range.start和range.end
   * - 例如`diff('year', {start: '2019', end: '2022'})`的值为3
   * @param unit
   * @param range
   */
  diffRange(unit: QUnitType, range: DateRange) {
    return dateUtil.diff(unit, range.start, range.end)
  },
  /**
   * 判断某个时间点是否在当天
   * @param t
   */
  isToday(t: DATE | undefined) {
    if (!t)
      return false
    const d = dateUtil.toDayjs(t)
    return d.isSame(dayjs(), 'day')
  }
}
