<template>
  <section class="container mx-auto px-4 py-10">
    <h2 class="section-title">{{ t('subscribe.title') }}</h2>
    <div v-if="course" class="card">
      <p>{{ t('subscribe.confirmText', { title: course.title }) }}</p>
      <button class="btn mt-4" @click="doSubscribe">{{ t('button.confirm') }}</button>
    </div>
    <p v-else>{{ t('courseDetail.notFound') }}</p>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useI18nStore } from '@/stores/i18n.js'
const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const sub = useSubscriptionStore()
onMounted(() => { store.load(); sub.load() })
const course = computed(() => store.getById(route.params.id))
const doSubscribe = () => { if (course.value) { sub.subscribe(course.value.id); router.push('/profile') } }
const i18n = useI18nStore()
const t = i18n.t
</script>
