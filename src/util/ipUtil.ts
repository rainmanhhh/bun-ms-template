import * as os from 'node:os'
import ip from 'ip'

export type IpFamily = 'IPv4' | 'IPv6'

export const ipUtil = {
  address(family: IpFamily, subnetPattern?: string) {
    const subnet = subnetPattern ? ip.cidrSubnet(subnetPattern) : null
    const iFaces = os.networkInterfaces()
    for (const dev in iFaces) {
      for (const iFace of iFaces[dev]!) {
        if (iFace.family === family) {
          if (subnet) {
            if (subnet.contains(iFace.address))
              return iFace.address
          } else {
            if (iFace.address !== '127.0.0.1')
              return iFace.address
          }
        }
      }
    }
    if (family === 'IPv4' && !subnet)
      return '127.0.0.1'
    throw new Error(`No ${family} address found for subnet: ${subnetPattern}`)
  },
  v4(subnetPattern?: string) {
    return ipUtil.address('IPv4', subnetPattern)
  },
  v6(subnetPattern?: string) {
    return ipUtil.address('IPv6', subnetPattern)
  }
}
