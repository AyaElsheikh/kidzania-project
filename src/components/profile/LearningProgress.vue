<template>
  <div class="card-custom h-100">
    <h5 class="mb-3">{{ t('profile.learningProgress.title') }}</h5>

    <div class="d-flex justify-content-around text-center mb-3">
      <div>
        <h3 class="text-primary-custom">{{ stats.total }}</h3>
        <p class="mb-0 text-muted">{{ t('profile.learningProgress.courses') }}</p>
      </div>
      <div>
        <h3 class="text-primary-custom">{{ stats.completed }}</h3>
        <p class="mb-0 text-muted">{{ t('profile.learningProgress.completed') }}</p>
      </div>
    </div>

    <p class="text-center small">{{ t('profile.learningProgress.percentCompleted', { percent: stats.percent }) }}</p>
    <div class="progress mb-3">
      <div class="progress-bar" :style="{ width: stats.percent + '%' }"></div>
    </div>

    <div class="text-center">
      <button class="btn btn-success-custom rounded-pill px-4" type="button" @click="continueLearning">
        {{ t('profile.learningProgress.continueLearning') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useI18nStore } from '@/stores/i18n.js'

const router = useRouter()
const coursesStore = useCoursesStore()
const sub = useSubscriptionStore()

const i18n = useI18nStore()
const t = i18n.t

const LS_PROGRESS = 'kidzania_course_progress'
const progressById = ref({})

function safeParseJSON(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function seededPercent(id) {
  const s = String(id || '0')
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return 20 + (h % 71) // 20..90
}

onMounted(() => {
  coursesStore.load()
  sub.load()
  progressById.value = safeParseJSON(localStorage.getItem(LS_PROGRESS), {})
})

const subscribedCourses = computed(() => coursesStore.courses.filter(c => sub.isSubscribed(c.id)))
const coursesWithProgress = computed(() => subscribedCourses.value.map(c => ({
  ...c,
  __progress: clamp(Number(progressById.value[c.id] ?? seededPercent(c.id)), 0, 100)
})))

const completedCourses = computed(() => coursesWithProgress.value.filter(c => c.__progress >= 100))

const stats = computed(() => {
  const total = subscribedCourses.value.length
  const completed = completedCourses.value.length
  const percent = total ? Math.round((completed / total) * 100) : 0
  return { total, completed, percent }
})

function continueLearning() {
  if (!coursesWithProgress.value.length) {
    router.push('/courses')
    return
  }
  const inProgress = coursesWithProgress.value.filter(c => c.__progress < 100)
  const pick = (inProgress.length ? inProgress : coursesWithProgress.value)
    .slice()
    .sort((a, b) => b.__progress - a.__progress)[0]
  router.push(`/course-player/${pick.id}`)
}
</script>

<style scoped>
.card-custom {
  background: #fff;
  padding: 18px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.text-primary-custom {
  color: var(--primary, #033B62);
  font-weight: bold;
  font-size: 1.75rem;
}

.progress {
  height: 8px;
  border-radius: 8px;
  background-color: #e9ecef;
}

.progress-bar {
  background-color: var(--primary-medium, #00b4ff);
  border-radius: 10px;
}

.btn-success-custom {
  background-color: var(--secondary-green, #90EE90);
  border: none;
  color: #fff;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-success-custom:hover {
  filter: brightness(0.95);
}
</style>
