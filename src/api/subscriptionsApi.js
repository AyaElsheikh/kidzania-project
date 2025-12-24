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

export const subscriptionsApi = {
  // Get subscriptions for a user
  getByUser: (userId) => http('GET', `/subscriptions?userId=${userId}`),
  
  // Get all subscriptions (admin)
  list: () => http('GET', '/subscriptions'),
  
  // Create subscription
  create: (payload) => http('POST', '/subscriptions', payload),
  
  // Remove subscription
  remove: (id) => http('DELETE', `/subscriptions/${id}`),
  
  // Check if user is subscribed to a course
  check: (userId, courseId) => http('GET', `/subscriptions?userId=${userId}&courseId=${courseId}`)
}

