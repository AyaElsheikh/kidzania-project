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

  // json-server returns 204 for some ops
  if (res.status === 204) return null
  return await res.json()
}

export const examsApi = {
  list: () => http('GET', '/exams'),
  get: (id) => http('GET', `/exams/${id}`),
  create: (payload) => http('POST', '/exams', payload),
  update: (id, payload) => http('PATCH', `/exams/${id}`, payload),
  remove: (id) => http('DELETE', `/exams/${id}`)
}


