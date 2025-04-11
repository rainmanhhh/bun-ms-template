import type { GetMySeqResponse, KooOoApi } from '../../generated/server/api/kooOo/types'
import { apis } from '../server'

export class KooOoApiImpl implements KooOoApi {
  async getMySeq() {
    return {
      status: 200,
      body: {
        value: 1,
        create_time: new Date()
      }
    } satisfies GetMySeqResponse
  }
}
apis.kooOo = new KooOoApiImpl()
