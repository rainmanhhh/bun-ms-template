import type { FooBarApi, GetMySeqResponse } from '../../generated/server/api/fooBar/types'

import { routes } from '../server/server'

export class FooBarApiImpl implements FooBarApi {
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
routes.fooBar = new FooBarApiImpl()
