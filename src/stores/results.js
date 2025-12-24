import { defineStore } from 'pinia'
import { resultsApi } from '@/api/resultsApi.js'

export const useResultsStore = defineStore('results', {
  state: () => ({
    results: [],
    isLoading: false,
    error: null
  }),
  actions: {
    async load() {
      this.isLoading = true
      this.error = null
      try {
        const list = await resultsApi.list()
        this.results = Array.isArray(list) ? list : []
      } catch (e) {
        this.error = e?.message || 'Failed to load results'
        this.results = []
      } finally {
        this.isLoading = false
      }
    },
    async create(payload) {
      const created = await resultsApi.create(payload)
      // Avoid reloading everything; just append
      this.results.unshift(created)
      return created
    }
  }
})


