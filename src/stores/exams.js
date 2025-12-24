import { defineStore } from 'pinia'
import { examsApi } from '@/api/examsApi.js'

function nowIso() {
  return new Date().toISOString()
}

function normalizeExam(raw) {
  const id = raw?.id
  return {
    id,
    title: raw?.title || 'Untitled test',
    courseId: raw?.courseId || '',
    status: raw?.status || 'draft', // draft | published
    points: Number(raw?.points ?? 10),
    timeLimitMins: Number(raw?.timeLimitMins ?? 10),
    difficulty: raw?.difficulty || 'easy', // easy | medium | hard
    ageGroup: raw?.ageGroup || '4-6',
    createdAt: raw?.createdAt || nowIso(),
    updatedAt: raw?.updatedAt || nowIso(),
    publishedAt: raw?.publishedAt || null,
    questions: Array.isArray(raw?.questions) ? raw.questions : []
  }
}

export const useExamsStore = defineStore('exams', {
  state: () => ({
    exams: [],
    isLoading: false,
    error: null
  }),
  getters: {
    published: (state) => state.exams.filter(e => e.status === 'published')
  },
  actions: {
    async load() {
      this.isLoading = true
      this.error = null
      try {
        const list = await examsApi.list()
        this.exams = Array.isArray(list) ? list.map(normalizeExam) : []
      } catch (e) {
        this.error = e?.message || 'Failed to load exams'
        this.exams = []
      } finally {
        this.isLoading = false
      }
    },
    async createDraft(payload) {
      const exam = normalizeExam({
        ...payload,
        status: 'draft',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        publishedAt: null
      })
      const created = await examsApi.create(exam)
      await this.load()
      return created
    },
    async save(id, patch) {
      const updated = await examsApi.update(id, { ...patch, updatedAt: nowIso() })
      await this.load()
      return updated
    },
    async publish(id) {
      const updated = await examsApi.update(id, {
        status: 'published',
        publishedAt: nowIso(),
        updatedAt: nowIso()
      })
      await this.load()
      return updated
    },
    async remove(id) {
      await examsApi.remove(id)
      await this.load()
    }
  }
})
