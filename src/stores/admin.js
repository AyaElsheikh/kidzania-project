import { defineStore } from 'pinia'
import { adminApi } from '@/api/adminApi.js'

const LS_ADMIN = 'kidzania_admin'

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
      // Load admin session from localStorage
      const raw = localStorage.getItem(LS_ADMIN)
      if (raw) {
        try {
          this.admin = JSON.parse(raw)
        } catch {
          this.admin = null
        }
      }
      
      // Load admin from API if exists
      this.isLoading = true
      this.error = null
      try {
        const admins = await adminApi.list()
        if (Array.isArray(admins) && admins.length > 0) {
          // Use first admin if exists
          if (!this.admin) {
            this.admin = admins[0]
            localStorage.setItem(LS_ADMIN, JSON.stringify(this.admin))
          } else {
            // Update from API
            const apiAdmin = admins.find(a => a.id === this.admin.id || a.username === this.admin.username)
            if (apiAdmin) {
              this.admin = apiAdmin
              localStorage.setItem(LS_ADMIN, JSON.stringify(this.admin))
            }
          }
        }
      } catch (e) {
        this.error = e?.message || 'Failed to load admin'
        console.error('Failed to load admin:', e)
      } finally {
        this.isLoading = false
      }

      // Keep admin session persistent across refresh
      this.loggedIn = !!this.admin
    },
    async setup({ name, username, password }) {
      this.isLoading = true
      this.error = null
      try {
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
        const admins = await adminApi.findByUsername(username)
        const admin = Array.isArray(admins) ? admins[0] : null
        
        if (!admin) {
          this.loggedIn = false
          return false
        }
        
        const ok = admin.password === hash(password)
        this.loggedIn = ok
        
        if (ok) {
          this.admin = admin
          localStorage.setItem(LS_ADMIN, JSON.stringify(this.admin))
        }
        
        return ok
      } catch (e) {
        this.error = e?.message || 'Failed to login'
        this.loggedIn = false
        return false
      } finally {
        this.isLoading = false
      }
    },
    logout() { 
      this.loggedIn = false 
    }
  }
})
