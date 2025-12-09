<template>
  <section class="container mx-auto px-4 py-10">
    <h2 class="section-title">{{ t('profile.title') }}</h2>
    <div v-if="courses.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CourseCard v-for="c in courses" :key="c.id" :course="c" />
    </div>
    <p v-else>{{ t('profile.empty') }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import CourseCard from '@/components/CourseCard.vue'
import { useI18nStore } from '@/stores/i18n.js'
const store = useCoursesStore()
const sub = useSubscriptionStore()
onMounted(() => { store.load(); sub.load() })
const courses = computed(() => store.courses.filter(c => sub.isSubscribed(c.id)))
const i18n = useI18nStore()
const t = i18n.t
</script>
