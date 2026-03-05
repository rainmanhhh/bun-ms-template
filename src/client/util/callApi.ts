type ApiResponse<T = unknown> =
  | {status: number; contentType: string; body: T}
  | {status: 'undocumented'; contentType?: string; response: Response}
  | {status: 'error'; error: unknown}

/**
 * 调用其他微服务接口
 * - 若http返回码为2xx，则正常返回解析后的响应报文，否则抛出错误
 * @param apiName 发生错误时用于显示接口名称，一般可用`XXXApi.xxxMethod`
 * @param apiCallback 实际调用api的动作（包括参数），例如`() => fooApi.barMethod(params)`
 */
export async function callApi<T>(apiName: string, apiCallback: () => Promise<ApiResponse<T>>): Promise<T> {
  const apiRes = await apiCallback()
  if (typeof apiRes.status === 'number' && apiRes.status >= 200 && apiRes.status < 400) {
    return apiRes.body
  } else if (apiRes.status === 'undocumented') {
    const resBody = await apiRes.response.text()
    throw new Error(`callApi [${apiName}] failed! status:${apiRes.response.status}, body:${resBody}`, {cause: apiRes.response})
  } else if (apiRes.status === 'error') {
    throw new Error(`callApi [${apiName}] error! ${(apiRes.error as Error)?.message || '未知错误'}`, {cause: apiRes.error})
  } else {
    throw new Error(`callApi [${apiName}] unknown res: ${JSON.stringify(apiRes)}`)
  }
}
