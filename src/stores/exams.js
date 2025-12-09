import { defineStore } from 'pinia'

const LS_EXAMS = 'kidzania_exams'

export const useExamsStore = defineStore('exams', {
  state: () => ({ exams: [] }),
  actions: {
    load() {
      const raw = localStorage.getItem(LS_EXAMS)
      this.exams = raw ? JSON.parse(raw) : []
    },
    addExam(exam) {
      this.exams.push({ ...exam, id: Date.now().toString() })
      localStorage.setItem(LS_EXAMS, JSON.stringify(this.exams))
    }
  }
})
