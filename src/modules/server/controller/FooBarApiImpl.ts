import type { FooBarApi, GetMySeqResponse } from '../../../generated/server/api/fooBar/types.ts'
import { dateUtil } from '../../../util/dateUtil.ts'
import { routes } from '../routes.ts'

export class FooBarApiImpl implements FooBarApi {
  async getMySeq() {
    return {
      status: 200,
      body: {
        value: 1,
        create_time: dateUtil.now().toDate()
      }
    } satisfies GetMySeqResponse
  }
}
routes.fooBar = new FooBarApiImpl()
