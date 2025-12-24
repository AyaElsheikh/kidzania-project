const BASE = '/api-data'

async function http(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  return await res.json()
}

export const resultsApi = {
  list: () => http('GET', '/results'),
  create: (payload) => http('POST', '/results', payload),
  remove: (id) => http('DELETE', `/results/${id}`)
}


