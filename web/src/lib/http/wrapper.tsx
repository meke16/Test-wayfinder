export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const opts = { ...init, credentials: 'include' as const } // always send cookies
  const resp = await fetch(input, opts)

  if (!resp.ok) {
    const errorResponse = await resp.json()
    throw new Error(errorResponse.error || 'Unknown error')
  }

  return resp.json()
}
