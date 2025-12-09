import { defineStore } from 'pinia'
import data from '@/data/courses.json'

const LS_CUSTOM = 'kidzania_courses_custom'
const LS_OVERRIDES = 'kidzania_courses_overrides'
const LS_HIDDEN = 'kidzania_courses_hidden'

export const useCoursesStore = defineStore('courses', {
  state: () => ({
    courses: [],
    custom: [],
    overrides: {},
    hidden: []
  }),
  getters: {
    byCategory: (state) => (cat) => state.courses.filter(c => c.category === cat),
    getById: (state) => (id) => state.courses.find(c => c.id === id)
  },
  actions: {
    load() {
      try {
        const raw = localStorage.getItem(LS_CUSTOM)
        this.custom = raw ? JSON.parse(raw) : []
      } catch { this.custom = [] }
      try {
        const ov = localStorage.getItem(LS_OVERRIDES)
        this.overrides = ov ? JSON.parse(ov) : {}
      } catch { this.overrides = {} }
      try {
        const hid = localStorage.getItem(LS_HIDDEN)
        this.hidden = hid ? JSON.parse(hid) : []
      } catch { this.hidden = [] }

      const base = data.courses
        .filter(c => !this.hidden.includes(c.id))
        .map(c => ({ ...c, ...(this.overrides[c.id] || {}) }))
      this.courses = [...base, ...this.custom]
    },
    addCourse(course) {
      this.custom.push(course)
      localStorage.setItem(LS_CUSTOM, JSON.stringify(this.custom))
      this.courses.push(course)
    },
    updateCourse(course) {
      // update custom if exists
      const idx = this.custom.findIndex(c => c.id === course.id)
      if (idx !== -1) {
        this.custom[idx] = { ...this.custom[idx], ...course }
        localStorage.setItem(LS_CUSTOM, JSON.stringify(this.custom))
      } else {
        // override base course
        this.overrides[course.id] = { ...((this.overrides[course.id]) || {}), ...course }
        localStorage.setItem(LS_OVERRIDES, JSON.stringify(this.overrides))
      }
      // refresh effective list
      this.load()
    },
    deleteCourse(id) {
      // try remove from custom
      const before = this.custom.length
      this.custom = this.custom.filter(c => c.id !== id)
      if (this.custom.length !== before) {
        localStorage.setItem(LS_CUSTOM, JSON.stringify(this.custom))
      } else {
        // mark base course hidden
        if (!this.hidden.includes(id)) this.hidden.push(id)
        localStorage.setItem(LS_HIDDEN, JSON.stringify(this.hidden))
      }
      // also clean overrides
      if (this.overrides[id]) {
        delete this.overrides[id]
        localStorage.setItem(LS_OVERRIDES, JSON.stringify(this.overrides))
      }
      this.load()
    }
  }
})
