<template>
  <div>
    <h2 class="section-title">Exams</h2>
    <form class="card grid grid-cols-1 md:grid-cols-2 gap-3 mb-6" @submit.prevent="add">
      <input v-model="title" placeholder="Exam Title" class="p-3 rounded-xl border col-span-1 md:col-span-2" />
      <select v-model="courseId" class="p-3 rounded-xl border">
        <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.title_en || c.title }}</option>
      </select>
      <textarea v-model="question" placeholder="Question" class="p-3 rounded-xl border col-span-1 md:col-span-2"></textarea>
      <input v-model="optionA" placeholder="Option A" class="p-3 rounded-xl border" />
      <input v-model="optionB" placeholder="Option B" class="p-3 rounded-xl border" />
      <input v-model="answer" placeholder="Answer (A/B)" class="p-3 rounded-xl border" />
      <button class="btn col-span-1 md:col-span-2" type="submit">Add Exam</button>
    </form>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="e in exams" :key="e.id" class="card">
        <div class="font-fredoka text-darkblue">{{ e.title }}</div>
        <div class="text-sm text-gray-600">Course: {{ courseTitle(e.courseId) }}</div>
        <div class="mt-2">Q: {{ e.questions[0]?.q }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useExamsStore } from '@/stores/exams.js'
import { useCoursesStore } from '@/stores/courses.js'
const store = useExamsStore()
const coursesStore = useCoursesStore()
onMounted(() => { store.load(); coursesStore.load() })
const courses = coursesStore.courses
const exams = store.exams
const title = ref('')
const courseId = ref('')
const question = ref('')
const optionA = ref('')
const optionB = ref('')
const answer = ref('A')
const add = () => {
  if (!courseId.value) return
  store.addExam({ title: title.value, courseId: courseId.value, questions: [{ q: question.value, options: ['A: ' + optionA.value, 'B: ' + optionB.value], answer: answer.value }] })
  title.value = question.value = optionA.value = optionB.value = ''
}
const courseTitle = (id) => {
  const c = coursesStore.courses.find(c => c.id === id)
  return c ? (c.title_en || c.title) : id
}
</script>
