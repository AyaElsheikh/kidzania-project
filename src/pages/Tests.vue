<template>
  <section class="container mx-auto px-4 py-10">
    <h2 class="section-title">{{ t('tests.title') }}</h2>
    <p class="text-center text-gray-600 mb-8">{{ t('tests.subtitle') }}</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="exam in exams" :key="exam.id" class="card">
        <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ exam.title }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ t('tests.course') }}: {{ getCourseTitle(exam.courseId) }}</p>
        <router-link :to="`/test/${exam.id}`" class="btn">{{ t('tests.start') }}</router-link>
      </div>
      <div v-if="exams.length === 0" class="col-span-2 text-center text-gray-600">
        {{ t('tests.empty') }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useExamsStore } from '@/stores/exams.js'
import { useCoursesStore } from '@/stores/courses.js'
import { useI18nStore } from '@/stores/i18n.js'

const examsStore = useExamsStore()
const coursesStore = useCoursesStore()
const i18n = useI18nStore()
const t = i18n.t

const exams = ref([])

onMounted(() => {
  examsStore.load()
  coursesStore.load()
  exams.value = examsStore.exams
})

const getCourseTitle = (courseId) => {
  const course = coursesStore.courses.find(c => c.id === courseId)
  return course ? (course.title_en || course.title) : 'Unknown'
}
</script>

