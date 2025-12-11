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
    load() {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) this.user = JSON.parse(raw)
      const list = localStorage.getItem(LS_USERS)
      if (list) this.users = JSON.parse(list)
    },
    register({ name, email, password, phone }) {
      const exists = this.users.find(u => u.email === email)
      if (exists) throw new Error('user-exists')
      const newUser = { id: Date.now().toString(), name, email, password, phone }
      this.users.push(newUser)
      localStorage.setItem(LS_USERS, JSON.stringify(this.users))
      this.user = { id: newUser.id, name: newUser.name, email: newUser.email }
      localStorage.setItem(LS_KEY, JSON.stringify(this.user))
    },
    login({ email, password }) {
      const exists = this.users.find(u => u.email === email)
      if (!exists) throw new Error('no-user')
      if (exists.password !== password) throw new Error('bad-pass')
      this.user = { id: exists.id, name: exists.name, email: exists.email }
      localStorage.setItem(LS_KEY, JSON.stringify(this.user))
    },
    loginOrRegister({ name, email, password, phone }) {
      // backwards compatibility
      const exists = this.users.find(u => u.email === email)
      if (exists) {
        this.user = { id: exists.id, name: exists.name, email: exists.email }
      } else {
        const newUser = { id: Date.now().toString(), name, email, password: password || '12345678', phone }
        this.users.push(newUser)
        localStorage.setItem(LS_USERS, JSON.stringify(this.users))
        this.user = { id: newUser.id, name: newUser.name, email: newUser.email }
      }
      localStorage.setItem(LS_KEY, JSON.stringify(this.user))
    },
    logout() {
      this.user = null
      localStorage.removeItem(LS_KEY)
    }
  }
})
