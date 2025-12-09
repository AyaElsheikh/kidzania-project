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
    loginOrRegister({ name, email }) {
      const exists = this.users.find(u => u.email === email)
      if (exists) {
        this.user = exists
      } else {
        this.user = { id: Date.now().toString(), name, email }
        this.users.push(this.user)
        localStorage.setItem(LS_USERS, JSON.stringify(this.users))
      }
      localStorage.setItem(LS_KEY, JSON.stringify(this.user))
    },
    login(payload) { this.loginOrRegister(payload) },
    logout() {
      this.user = null
      localStorage.removeItem(LS_KEY)
    }
  }
})
