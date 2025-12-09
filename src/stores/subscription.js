import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'

const LS_KEY = 'kidzania_subscriptions'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    courseIds: [],
    byUser: {}
  }),
  actions: {
    load() {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        this.courseIds = parsed.courseIds || []
        this.byUser = parsed.byUser || {}
      }
    },
    persist() {
      localStorage.setItem(LS_KEY, JSON.stringify({ courseIds: this.courseIds, byUser: this.byUser }))
    },
    isSubscribed(id) {
      const auth = useAuthStore()
      const user = auth.user
      if (user) {
        const list = this.byUser[user.id] || []
        return list.includes(id)
      }
      return this.courseIds.includes(id)
    },
    subscribe(id) {
      const auth = useAuthStore()
      const user = auth.user
      if (user) {
        const list = this.byUser[user.id] || []
        if (!list.includes(id)) {
          list.push(id)
          this.byUser[user.id] = list
          this.persist()
        }
        return
      }
      if (!this.courseIds.includes(id)) {
        this.courseIds.push(id)
        this.persist()
      }
    },
    unsubscribe(id) {
      const auth = useAuthStore()
      const user = auth.user
      if (user) {
        const list = (this.byUser[user.id] || []).filter(x => x !== id)
        this.byUser[user.id] = list
        this.persist()
        return
      }
      this.courseIds = this.courseIds.filter(x => x !== id)
      this.persist()
    }
  }
})
