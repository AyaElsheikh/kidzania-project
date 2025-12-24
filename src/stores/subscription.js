import { defineStore } from 'pinia'
import { useAuthStore } from './auth.js'
import { subscriptionsApi } from '@/api/subscriptionsApi.js'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscriptions: [], // [{ id, userId, courseId, createdAt }]
    isLoading: false,
    error: null
  }),
  getters: {
    byUser: (state) => (userId) => state.subscriptions.filter(s => s.userId === userId),
    courseIdsByUser: (state) => (userId) => state.subscriptions.filter(s => s.userId === userId).map(s => s.courseId)
  },
  actions: {
    async load() {
      const auth = useAuthStore()
      if (!auth.user) {
        this.subscriptions = []
        return
      }
      
      this.isLoading = true
      this.error = null
      try {
        const list = await subscriptionsApi.getByUser(auth.user.id)
        this.subscriptions = Array.isArray(list) ? list : []
      } catch (e) {
        this.error = e?.message || 'Failed to load subscriptions'
        this.subscriptions = []
        console.error('Failed to load subscriptions:', e)
      } finally {
        this.isLoading = false
      }
    },
    isSubscribed(courseId) {
      const auth = useAuthStore()
      if (!auth.user) return false
      return this.subscriptions.some(s => s.userId === auth.user.id && s.courseId === courseId)
    },
    async subscribe(courseId) {
      const auth = useAuthStore()
      if (!auth.user) throw new Error('User must be logged in')
      
      // Check if already subscribed
      if (this.isSubscribed(courseId)) return
      
      try {
        const payload = {
          userId: auth.user.id,
          courseId,
          createdAt: new Date().toISOString()
        }
        await subscriptionsApi.create(payload)
        await this.load()
      } catch (e) {
        this.error = e?.message || 'Failed to subscribe'
        throw e
      }
    },
    async unsubscribe(courseId) {
      const auth = useAuthStore()
      if (!auth.user) throw new Error('User must be logged in')
      
      const sub = this.subscriptions.find(s => s.userId === auth.user.id && s.courseId === courseId)
      if (!sub) return
      
      try {
        await subscriptionsApi.remove(sub.id)
        await this.load()
      } catch (e) {
        this.error = e?.message || 'Failed to unsubscribe'
        throw e
      }
    }
  }
})
