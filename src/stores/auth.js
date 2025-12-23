import { defineStore } from 'pinia'

const LS_KEY = 'kidzania_auth'
const LS_USERS = 'kidzania_users'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    users: []
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    persistUser() {
      if (!this.user) return
      localStorage.setItem(LS_KEY, JSON.stringify(this.user))
    },
    load() {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) this.user = JSON.parse(raw)
      const list = localStorage.getItem(LS_USERS)
      if (list) this.users = JSON.parse(list)

      // Hydrate missing profile fields from users list (backwards compat)
      if (this.user) {
        const full = this.users.find(u => u.id === this.user.id) || this.users.find(u => u.email === this.user.email)
        if (full) {
          const next = { ...this.user }
          if (next.phone == null) next.phone = full.phone || ''
          if (next.avatar == null) next.avatar = full.avatar || ''
          this.user = next
          this.persistUser()
        }
      }
    },
    register({ name, email, password, phone }) {
      const exists = this.users.find(u => u.email === email)
      if (exists) throw new Error('user-exists')
      const newUser = { id: Date.now().toString(), name, email, password, phone, avatar: '' }
      this.users.push(newUser)
      localStorage.setItem(LS_USERS, JSON.stringify(this.users))
      this.user = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone || '', avatar: newUser.avatar || '' }
      this.persistUser()
    },
    login({ email, password }) {
      const exists = this.users.find(u => u.email === email)
      if (!exists) throw new Error('no-user')
      if (exists.password !== password) throw new Error('bad-pass')
      this.user = { id: exists.id, name: exists.name, email: exists.email, phone: exists.phone || '', avatar: exists.avatar || '' }
      this.persistUser()
    },
    loginOrRegister({ name, email, password, phone }) {
      // backwards compatibility
      const exists = this.users.find(u => u.email === email)
      if (exists) {
        this.user = { id: exists.id, name: exists.name, email: exists.email, phone: exists.phone || '', avatar: exists.avatar || '' }
      } else {
        const newUser = { id: Date.now().toString(), name, email, password: password || '12345678', phone, avatar: '' }
        this.users.push(newUser)
        localStorage.setItem(LS_USERS, JSON.stringify(this.users))
        this.user = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone || '', avatar: newUser.avatar || '' }
      }
      this.persistUser()
    },
    updateProfile({ name, email, phone, avatar }) {
      if (!this.user) throw new Error('no-user')

      const nextEmail = (email || '').trim()
      const nextName = (name || '').trim()
      const nextPhone = (phone || '').trim()
      const nextAvatar = avatar || ''

      const emailOwner = this.users.find(u => u.email === nextEmail)
      if (emailOwner && emailOwner.id !== this.user.id) throw new Error('email-exists')

      const idx = this.users.findIndex(u => u.id === this.user.id)
      if (idx !== -1) {
        this.users[idx] = {
          ...this.users[idx],
          name: nextName,
          email: nextEmail,
          phone: nextPhone,
          avatar: nextAvatar
        }
        localStorage.setItem(LS_USERS, JSON.stringify(this.users))
      }

      this.user = { ...this.user, name: nextName, email: nextEmail, phone: nextPhone, avatar: nextAvatar }
      this.persistUser()
    },
    changePassword({ currentPassword, newPassword }) {
      if (!this.user) throw new Error('no-user')
      const idx = this.users.findIndex(u => u.id === this.user.id)
      if (idx === -1) throw new Error('no-user')
      if (this.users[idx].password !== currentPassword) throw new Error('bad-pass')
      this.users[idx] = { ...this.users[idx], password: newPassword }
      localStorage.setItem(LS_USERS, JSON.stringify(this.users))
    },
    logout() {
      this.user = null
      localStorage.removeItem(LS_KEY)
    }
  }
})
