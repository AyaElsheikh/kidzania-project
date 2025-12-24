const LS_PREFIX = 'kidzania_certificates_v1'

function safeParseJSON(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function storageKey(userId) {
  return `${LS_PREFIX}:${String(userId || 'guest')}`
}

function readMap(userId) {
  return safeParseJSON(localStorage.getItem(storageKey(userId)), {})
}

function writeMap(userId, map) {
  localStorage.setItem(storageKey(userId), JSON.stringify(map || {}))
}

function makeCertificateId({ userId, courseId, issuedAt }) {
  // short, stable-ish id; does not need to be cryptographically secure
  const a = String(userId || 'guest')
  const b = String(courseId || 'course')
  const c = String(issuedAt || new Date().toISOString())
  return `${b}-${a}-${c}`.replace(/[^a-zA-Z0-9._-]/g, '')
}

export function getCertificate(userId, courseId) {
  const map = readMap(userId)
  return map?.[String(courseId)] || null
}

export function listCertificates(userId) {
  const map = readMap(userId)
  const list = Object.values(map || {})
  return list
    .filter(Boolean)
    .sort((a, b) => String(b.issuedAt || '').localeCompare(String(a.issuedAt || '')))
}

export function issueCertificateIfNeeded(userId, courseId, payload) {
  const uid = String(userId || 'guest')
  const cid = String(courseId || '')
  if (!cid) return null

  const map = readMap(uid)
  const existing = map?.[cid]
  if (existing) return existing

  const issuedAt = payload?.issuedAt || new Date().toISOString()
  const cert = {
    id: makeCertificateId({ userId: uid, courseId: cid, issuedAt }),
    userId: uid,
    courseId: cid,
    userName: payload?.userName || '',
    courseTitle: payload?.courseTitle || '',
    completionPercent: Number(payload?.completionPercent ?? 100),
    lessonsCompleted: Number(payload?.lessonsCompleted ?? 0),
    finalGrade: payload?.finalGrade || 'A+',
    locale: payload?.locale || 'ar',
    issuedAt
  }

  map[cid] = cert
  writeMap(uid, map)
  return cert
}


