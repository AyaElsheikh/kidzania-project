<template>
  <section class="container py-5">
    <h2 class="section-title text-center">{{ t('tests.title') }}</h2>
    <p class="text-center text-muted mb-4">{{ t('tests.subtitle') }}</p>
    <div class="row g-3">
      <div v-for="exam in exams" :key="exam.id" class="col-12 col-md-6">
        <div class="card h-100 card-soft p-3">
          <h3 class="fs-5 text-darkblue mb-2">{{ exam.title }}</h3>
          <p class="text-muted small mb-3">{{ t('tests.course') }}: {{ getCourseTitle(exam.courseId) }}</p>
          <router-link :to="`/test/${exam.id}`" class="btn btn-primary btn-sm">{{ t('tests.start') }}</router-link>
        </div>
      </div>
      <div v-if="exams.length === 0" class="col-12 text-center text-muted">
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

