import type { RouteDefinition } from './wayfinder'

type RequestBody = Record<string, unknown> | unknown[] | string | number | boolean | null

const isMethodWithBody = (method: string) =>
  method === 'post' || method === 'put' || method === 'patch'

export async function request<TResponse>(
  route: RouteDefinition<any> | { url: string; method?: string } | string,
  body?: RequestBody,
  init?: RequestInit,
): Promise<TResponse> {
  const url = typeof route === 'string' ? route : route.url
  const routeMethod =
    typeof route === 'string'
      ? undefined
      : 'method' in route
        ? route.method
        : 'methods' in route && Array.isArray(route.methods)
          ? route.methods[0]
          : undefined

  const method = (init?.method ?? routeMethod ?? 'get').toString()

  const headers = new Headers(init?.headers)
  const normalizedMethod = method.toLowerCase()

  const shouldSendBody = body !== undefined && isMethodWithBody(normalizedMethod)
  if (shouldSendBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, {
    ...init,
    method,
    headers,
    credentials: init?.credentials ?? 'include',
    body: shouldSendBody ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    // Try to pull a meaningful message from JSON errors first.
    try {
      const data = (await res.json()) as any
      const message =
        data?.message ||
        data?.error ||
        (typeof data === 'string' ? data : null) ||
        `${res.status} ${res.statusText}`
      throw new Error(message)
    } catch {
      throw new Error(`${res.status} ${res.statusText}`)
    }
  }

  if (res.status === 204) {
    return undefined as TResponse
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return (await res.json()) as TResponse
  }

  return (await res.text()) as unknown as TResponse
}
