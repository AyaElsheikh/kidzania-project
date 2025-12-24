import { defineStore } from 'pinia'
import { usersApi } from '@/api/usersApi.js'

const LS_KEY = 'kidzania_auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    users: [],
    isLoading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    persistUser() {
      if (!this.user) return
      localStorage.setItem(LS_KEY, JSON.stringify(this.user))
    },
    async load() {
      // Load current user from localStorage
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        try {
          this.user = JSON.parse(raw)
        } catch {
          this.user = null
        }
      }
      
      // Load all users from API
      this.isLoading = true
      this.error = null
      try {
        const list = await usersApi.list()
        this.users = Array.isArray(list) ? list : []
        
        // Hydrate user from API if exists
        if (this.user) {
          const full = this.users.find(u => u.id === this.user.id) || this.users.find(u => u.email === this.user.email)
          if (full) {
            this.user = { 
              id: full.id, 
              name: full.name, 
              email: full.email, 
              phone: full.phone || '', 
              avatar: full.avatar || '',
              age: full.age || '',
              grade: full.grade || ''
            }
            this.persistUser()
          }
        }
      } catch (e) {
        this.error = e?.message || 'Failed to load users'
        this.users = []
        console.error('Failed to load users:', e)
      } finally {
        this.isLoading = false
      }
    },
    async register({ name, email, password, phone, age, grade }) {
      this.isLoading = true
      this.error = null
      try {
        // Check if user exists
        const existing = await usersApi.findByEmail(email)
        if (Array.isArray(existing) && existing.length > 0) {
          throw new Error('user-exists')
        }
        
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password,
          phone: phone || '',
          avatar: '',
          status: 'active',
          age: age || '',
          grade: grade || '',
          createdAt: new Date().toISOString()
        }
        
        const created = await usersApi.create(newUser)
        this.users.push(created)
        this.user = { 
          id: created.id, 
          name: created.name, 
          email: created.email, 
          phone: created.phone || '', 
          avatar: created.avatar || '',
          age: created.age || '',
          grade: created.grade || ''
        }
        this.persistUser()
        return created
      } catch (e) {
        this.error = e?.message || 'Failed to register'
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async login({ email, password }) {
      this.isLoading = true
      this.error = null
      try {
        const users = await usersApi.findByEmail(email)
        const exists = Array.isArray(users) ? users[0] : null
        
        if (!exists) throw new Error('no-user')
        if (String(exists.status || '').toLowerCase() === 'suspended') throw new Error('suspended')
        if (exists.password !== password) throw new Error('bad-pass')
        
        this.user = { 
          id: exists.id, 
          name: exists.name, 
          email: exists.email, 
          phone: exists.phone || '', 
          avatar: exists.avatar || '',
          age: exists.age || '',
          grade: exists.grade || ''
        }
        this.persistUser()
        return this.user
      } catch (e) {
        this.error = e?.message || 'Failed to login'
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async loginOrRegister({ name, email, password, phone }) {
      try {
        const users = await usersApi.findByEmail(email)
        const exists = Array.isArray(users) ? users[0] : null
        
        if (exists) {
          if (String(exists.status || '').toLowerCase() === 'suspended') throw new Error('suspended')
          this.user = { 
            id: exists.id, 
            name: exists.name, 
            email: exists.email, 
            phone: exists.phone || '', 
            avatar: exists.avatar || '',
            age: exists.age || '',
            grade: exists.grade || ''
          }
        } else {
          await this.register({ name, email, password: password || '12345678', phone, age: '', grade: '' })
        }
        this.persistUser()
        return this.user
      } catch (e) {
        this.error = e?.message || 'Failed to login or register'
        throw e
      }
    },
    async updateProfile({ name, email, phone, avatar, age, grade }) {
      if (!this.user) throw new Error('no-user')
      
      this.isLoading = true
      this.error = null
      try {
        const nextEmail = (email || '').trim()
        const nextName = (name || '').trim()
        const nextPhone = (phone || '').trim()
        const nextAvatar = avatar || ''

        // Check email uniqueness
        const users = await usersApi.findByEmail(nextEmail)
        const emailOwner = Array.isArray(users) ? users.find(u => u.id !== this.user.id) : null
        if (emailOwner) throw new Error('email-exists')

        const updated = await usersApi.update(this.user.id, {
          name: nextName,
          email: nextEmail,
          phone: nextPhone,
          avatar: nextAvatar,
          age: (age ?? this.user.age) || '',
          grade: (grade ?? this.user.grade) || '',
          updatedAt: new Date().toISOString()
        })
        
        // Update local state
        const idx = this.users.findIndex(u => u.id === this.user.id)
        if (idx !== -1) {
          this.users[idx] = updated
        }
        
        this.user = { 
          id: updated.id, 
          name: updated.name, 
          email: updated.email, 
          phone: updated.phone || '', 
          avatar: updated.avatar || '',
          age: updated.age || '',
          grade: updated.grade || ''
        }
        this.persistUser()
        return updated
      } catch (e) {
        this.error = e?.message || 'Failed to update profile'
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async changePassword({ currentPassword, newPassword }) {
      if (!this.user) throw new Error('no-user')
      
      this.isLoading = true
      this.error = null
      try {
        const user = await usersApi.get(this.user.id)
        if (!user) throw new Error('no-user')
        if (user.password !== currentPassword) throw new Error('bad-pass')
        
        await usersApi.update(this.user.id, {
          password: newPassword,
          updatedAt: new Date().toISOString()
        })
        
        // Update local state
        const idx = this.users.findIndex(u => u.id === this.user.id)
        if (idx !== -1) {
          this.users[idx] = { ...this.users[idx], password: newPassword }
        }
      } catch (e) {
        this.error = e?.message || 'Failed to change password'
        throw e
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.user = null
      localStorage.removeItem(LS_KEY)
    }
  }
})
