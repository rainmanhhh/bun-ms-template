// 1. 复用生成代码的通用响应类型（无需改动）
type ApiResponse<T = unknown> =
  | {status: number; contentType: string; body: T}
  | {status: 'undocumented'; contentType?: string; response: Response}
  | {status: 'error'; error: unknown}

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
