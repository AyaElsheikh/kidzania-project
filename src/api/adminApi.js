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

export const adminApi = {
  list: () => http('GET', '/admins'),
  get: (id) => http('GET', `/admins/${id}`),
  create: (payload) => http('POST', '/admins', payload),
  update: (id, payload) => http('PATCH', `/admins/${id}`, payload),
  findByUsername: (username) => http('GET', `/admins?username=${encodeURIComponent(username)}`)
}

