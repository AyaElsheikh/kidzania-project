<template>
  <section class="container mx-auto px-4 py-10" v-if="course">
    <div class="grid md:grid-cols-3 gap-8">
      <div class="md:col-span-2 card">
        <h2 class="section-title">{{ displayTitle }}</h2>
        <p class="mb-4">{{ displayDesc }}</p>
        <div class="flex gap-3 mb-6">
          <button v-if="!isSub" class="btn" @click="showSub=true">{{ t('courseDetail.subscribe') }}</button>
          <button v-else class="btn-outline" @click="scrollToLessons">{{ t('courseDetail.start') }}</button>
        </div>
        <img :src="course.thumbnail" class="rounded-2xl w-full h-64 object-cover" />
      </div>
      <div class="card">
        <p class="font-fredoka text-deepSkyBlue">${{ course.price }}</p>
        <p class="mt-2">{{ t('course.categoryLabel') }}: {{ categoryText }}</p>
      </div>
    </div>

    <h3 id="lessons" class="section-title mt-10">{{ t('courseDetail.lessons') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="l in course.lessons" :key="l.id">
        <h4 class="font-fredoka text-xl mb-2">{{ l.title }}</h4>
        <VideoPlayer :course-id="course.id" :video-url="l.videoUrl" />
      </div>
    </div>

    <SubscribeModal v-if="showSub" :course-id="course.id" @close="showSub=false" />
  </section>
  <section v-else class="container mx-auto px-4 py-20 text-center">
    <p>{{ t('courseDetail.notFound') }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import VideoPlayer from '@/components/VideoPlayer.vue'
import SubscribeModal from '@/components/SubscribeModal.vue'
import { useI18nStore } from '@/stores/i18n.js'
const route = useRoute()
const store = useCoursesStore()
const sub = useSubscriptionStore()
const showSub = ref(false)
onMounted(() => { store.load(); sub.load() })
const course = computed(() => {
  const c = store.getById(route.params.id)
  if (!c) return null
  // Do not show drafts to students
  if ((c.status || 'published') !== 'published') return null
  return c
})
const isSub = computed(() => course.value ? sub.isSubscribed(course.value.id) : false)
const scrollToLessons = () => {
  const el = document.getElementById('lessons')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
const i18n = useI18nStore()
const t = i18n.t
const displayTitle = computed(() => {
  if (!course.value) return ''
  return i18n.locale === 'en' ? (course.value.title_en || course.value.title) : (course.value.title_ar || course.value.title)
})
const displayDesc = computed(() => {
  if (!course.value) return ''
  return i18n.locale === 'en' ? (course.value.description_en || course.value.description) : (course.value.description_ar || course.value.description)
})
const categoryText = computed(() => {
  if (!course.value) return ''
  const map = { Arabic: t('category.arabic'), English: t('category.english'), Math: t('category.math') }
  return map[course.value.category] || course.value.category
})
</script>
