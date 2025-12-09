import { defineStore } from 'pinia'

const LS_ADMIN = 'kidzania_admin'

function hash(s) {
  try { return btoa(s) } catch { return s }
}

export const useAdminStore = defineStore('admin', {
  state: () => ({ admin: null, loggedIn: false }),
  actions: {
    load() {
      const raw = localStorage.getItem(LS_ADMIN)
      if (raw) this.admin = JSON.parse(raw)
      this.loggedIn = false
    },
    setup({ name, username, password }) {
      this.admin = { name, username, password: hash(password) }
      localStorage.setItem(LS_ADMIN, JSON.stringify(this.admin))
    },
    login({ username, password }) {
      if (!this.admin) return false
      const ok = this.admin.username === username && this.admin.password === hash(password)
      this.loggedIn = ok
      return ok
    },
    logout() { this.loggedIn = false }
  }
})
