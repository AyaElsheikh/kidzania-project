import { defineStore } from 'pinia'
import { adminApi } from '@/api/adminApi.js'

const LS_ADMIN = 'kidzania_admin'
const LS_ADMIN_SESSION = 'kidzania_admin_session'
const PRIMARY_ADMIN_USERNAME = 'admin@gmail.com'
const PRIMARY_ADMIN_PASSWORD = 'admin123'

function normalizeUsername(username) {
  return String(username || '').trim().toLowerCase()
}

function hash(s) {
  try { return btoa(s) } catch { return s }
}

export const useAdminStore = defineStore('admin', {
  state: () => ({ 
    admin: null, 
    loggedIn: false,
    isLoading: false,
    error: null
  }),
  actions: {
    async load() {
      // Load admin record from localStorage (record only; session flag controls loggedIn)
      const raw = localStorage.getItem(LS_ADMIN)
      if (raw) {
        try { this.admin = JSON.parse(raw) } catch { this.admin = null }
      }
      
      // Load admin from API if exists
      this.isLoading = true
      this.error = null
      try {
        const admins = await adminApi.list()
        const list = Array.isArray(admins) ? admins : []
        const primary = list.find(a => String(a?.username || '').toLowerCase() === PRIMARY_ADMIN_USERNAME)

        if (primary) {
          this.admin = primary
          localStorage.setItem(LS_ADMIN, JSON.stringify(this.admin))
        } else {
          // Ensure the primary admin exists in the demo DB
          try {
            const created = await adminApi.create({
              id: 'admin1',
              name: 'Admin',
              username: PRIMARY_ADMIN_USERNAME,
              password: hash(PRIMARY_ADMIN_PASSWORD),
              createdAt: new Date().toISOString()
            })
            this.admin = created
            localStorage.setItem(LS_ADMIN, JSON.stringify(this.admin))
          } catch (e) {
            // If create fails (race/duplicate), ignore
          }
        }
      } catch (e) {
        this.error = e?.message || 'Failed to load admin'
        console.error('Failed to load admin:', e)
      } finally {
        this.isLoading = false
      }

      // Session is controlled by a flag set on successful admin login
      const hasSession = localStorage.getItem(LS_ADMIN_SESSION) === '1'
      const isPrimary = String(this.admin?.username || '').toLowerCase() === PRIMARY_ADMIN_USERNAME
      this.loggedIn = Boolean(hasSession && isPrimary)
    },
    async setup({ name, username, password }) {
      this.isLoading = true
      this.error = null
      try {
        // Enforce single admin account
        if (normalizeUsername(username) !== PRIMARY_ADMIN_USERNAME) {
          throw new Error('Only the primary admin account is allowed')
        }
        // Check if admin exists
        const existing = await adminApi.findByUsername(username)
        if (Array.isArray(existing) && existing.length > 0) {
          throw new Error('Admin already exists')
        }
        
        const adminData = {
          id: 'admin1',
          name,
          username,
          password: hash(password),
          createdAt: new Date().toISOString()
        }
        
        const created = await adminApi.create(adminData)
        this.admin = created
        localStorage.setItem(LS_ADMIN, JSON.stringify(this.admin))
        return created
      } catch (e) {
        this.error = e?.message || 'Failed to setup admin'
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async login({ username, password }) {
      this.isLoading = true
      this.error = null
      try {
        if (String(username || '').toLowerCase() !== PRIMARY_ADMIN_USERNAME) {
          this.loggedIn = false
          localStorage.removeItem(LS_ADMIN_SESSION)
          return false
        }
        const admins = await adminApi.findByUsername(username)
        const admin = Array.isArray(admins) ? admins[0] : null
        
        if (!admin) {
          this.loggedIn = false
          localStorage.removeItem(LS_ADMIN_SESSION)
          return false
        }
        
        const ok = admin.password === hash(password)
        this.loggedIn = ok
        
        if (ok) {
          this.admin = admin
          localStorage.setItem(LS_ADMIN, JSON.stringify(this.admin))
          localStorage.setItem(LS_ADMIN_SESSION, '1')
        } else {
          localStorage.removeItem(LS_ADMIN_SESSION)
        }
        
        return ok
      } catch (e) {
        this.error = e?.message || 'Failed to login'
        this.loggedIn = false
        localStorage.removeItem(LS_ADMIN_SESSION)
        return false
      } finally {
        this.isLoading = false
      }
    },
    logout() { 
      this.loggedIn = false 
      localStorage.removeItem(LS_ADMIN_SESSION)
    }
  }
})
