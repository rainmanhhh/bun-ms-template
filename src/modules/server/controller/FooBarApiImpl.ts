import type { FooBarApi, TestResponse } from '../../../generated/server/api/fooBar/types.ts'
import { dateUtil } from '../../../util/dateUtil.ts'
import { routes } from '../routes.ts'

class FooBarApiImpl implements FooBarApi {
  test: (err: string | undefined, __user: any) => Promise<TestResponse> = async err => {
    if (err)
      throw new Error(err)
    return {
      status: 200,
      body: {
        value: 1,
        create_time: dateUtil.now().toDate()
      }
    } satisfies TestResponse
  }
}
routes.fooBar = new FooBarApiImpl()
