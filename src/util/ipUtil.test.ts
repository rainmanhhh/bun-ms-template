import { expect, test } from 'bun:test'
import { ipUtil } from './ipUtil.ts'

test('matchSubnet', () => {
  expect(ipUtil.matchSubnet('192.168.0.0/24', '192.168.0.123')).toBe(true)
  expect(ipUtil.matchSubnet('10.1.2.3/16', '10.2.2.3')).toBe(false)
})
