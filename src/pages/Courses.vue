<template>
  <section class="container mx-auto px-4 py-10">
    <h2 class="section-title">{{ t('courses.title') }}</h2>
    <div class="flex gap-2 mb-6">
      <router-link class="btn-outline" to="/courses">{{ t('filters.all') }}</router-link>
      <router-link class="btn-outline" to="/courses/arabic">{{ t('category.arabic') }}</router-link>
      <router-link class="btn-outline" to="/courses/english">{{ t('category.english') }}</router-link>
      <router-link class="btn-outline" to="/courses/math">{{ t('category.math') }}</router-link>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CourseCard v-for="c in filtered" :key="c.id" :course="c" />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import CourseCard from '@/components/CourseCard.vue'
import { useI18nStore } from '@/stores/i18n.js'

const props = defineProps({ category: { type: String, default: null } })
const route = useRoute()
const store = useCoursesStore()
onMounted(() => store.load())
const i18n = useI18nStore()
const t = i18n.t

const filtered = computed(() => {
  const cat = props.category || (route.path.includes('/courses/arabic') ? 'Arabic' : route.path.includes('/courses/english') ? 'English' : route.path.includes('/courses/math') ? 'Math' : null)
  return cat ? store.byCategory(cat) : store.courses
})
</script>
