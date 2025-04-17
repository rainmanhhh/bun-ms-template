import type { GetMySeqResponse, KooOoApi } from '../../generated/server/api/kooOo/types'

import { routes } from '../server/routes'

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
routes.kooOo = new KooOoApiImpl()
