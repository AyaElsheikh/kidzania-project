import { defineStore } from 'pinia'
import { coursesApi } from '@/api/coursesApi.js'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    isLoading: false,
    error: null
  }),
  getters: {
    byCategory: (state) => (cat) => state.courses.filter(c => c.category === cat),
    getById: (state) => (id) => state.courses.find(c => c.id === id)
  },
  actions: {
    async load() {
      this.isLoading = true
      this.error = null
      try {
        const list = await coursesApi.list()
        this.courses = Array.isArray(list) ? list : []
      } catch (e) {
        this.error = e?.message || 'Failed to load courses'
        this.courses = []
        console.error('Failed to load courses:', e)
      } finally {
        this.isLoading = false
      }
    },
    async addCourse(course) {
      try {
        const created = await coursesApi.create(course)
        await this.load()
        return created
      } catch (e) {
        this.error = e?.message || 'Failed to add course'
        throw e
      }
    },
    async updateCourse(course) {
      try {
        const updated = await coursesApi.update(course.id, course)
        await this.load()
        return updated
      } catch (e) {
        this.error = e?.message || 'Failed to update course'
        throw e
      }
    },
    async deleteCourse(id) {
      try {
        await coursesApi.remove(id)
        await this.load()
      } catch (e) {
        this.error = e?.message || 'Failed to delete course'
        throw e
      }
    }
  }
})
