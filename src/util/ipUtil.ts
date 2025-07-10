import * as os from 'node:os'
import * as ipaddr from 'ipaddr.js'

export type IpFamily = 'IPv4' | 'IPv6'

export type Subnet = [ipaddr.IPv4 | ipaddr.IPv6, number]

export const ipUtil = {
  /**
   * 创建一个ip子网对象
   * @param patternOrSubnet
   */
  subnet(patternOrSubnet?: string | Subnet) {
    if (patternOrSubnet)
      return typeof patternOrSubnet === 'string' ? ipaddr.parseCIDR(patternOrSubnet) : patternOrSubnet
    else
      return null
  },
  /**
   * 检测ip是否在某个子网内
   * @param subnet
   * @param ip
   */
  matchSubnet(subnet: string | Subnet, ip: string | ipaddr.IPv4 | ipaddr.IPv6) {
    const address = typeof ip === 'string' ? ipaddr.parse(ip) : ip
    return ipaddr.subnetMatch(address, { target: [ipUtil.subnet(subnet)!] }) === 'target'
  },
  /**
   * 获取本机ip，可指定子网
   * @param family ip地址族
   * @param subnet 子网
   */
  address(family: IpFamily, subnet?: string | Subnet) {
    const sn = ipUtil.subnet(subnet)
    const iFaces = os.networkInterfaces()
    for (const dev in iFaces) {
      for (const iFace of iFaces[dev]!) {
        if (iFace.family === family) {
          if (sn) {
            if (ipUtil.matchSubnet(sn, iFace.address))
              return iFace.address
          } else {
            if (iFace.address !== '127.0.0.1' && iFace.address !== '::1')
              return iFace.address
          }
        }
      }
    }
    if (family === 'IPv4' && (!sn || ipUtil.matchSubnet(sn, '127.0.0.1')))
      return '127.0.0.1'
    else if (family === 'IPv6' && (!sn || ipUtil.matchSubnet(sn, '::1')))
      return '::1'
    throw new Error(`No ${family} address found for subnet: ${sn}`)
  },
  /**
   * 获取本机ipv4地址，可指定子网
   * @param subnetPattern
   */
  v4(subnetPattern?: string | Subnet) {
    return ipUtil.address('IPv4', subnetPattern)
  },
  /**
   * 获取本机ipv6地址，可指定子网
   * @param subnetPattern
   */
  v6(subnetPattern?: string | Subnet) {
    return ipUtil.address('IPv6', subnetPattern)
  }
}
