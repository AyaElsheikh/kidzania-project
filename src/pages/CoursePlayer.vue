<template>
  <div class="cp-page" v-if="course">
    <header class="cp-hero">
      <div class="container cp-hero-inner">
        <div class="cp-hero-text">
          <h1 class="cp-title">{{ displayTitle }}</h1>
          <p class="cp-desc">{{ displayDesc }}</p>

          <div class="cp-meta">
            <span class="cp-chip">{{ categoryText }}</span>
            <span class="cp-chip">{{ course.age ? `${course.age} ${t('explore.years')}` : '—' }}</span>
            <span class="cp-chip">{{ (course.lessons?.length || 0) }} {{ t('explore.lessons') }}</span>
          </div>

          <div class="cp-actions">
            <button v-if="!isSub" class="cp-btn cp-btn-primary" type="button" @click="showSub = true">
              {{ t('courseDetail.subscribe') }}
            </button>
            <router-link class="cp-btn cp-btn-ghost" :to="`/course-details/${course.id}`">
              {{ t('courseDetail.overview') }}
            </router-link>
          </div>
        </div>

        <div class="cp-hero-card card-soft">
          <img :src="course.thumbnail" :alt="displayTitle" class="cp-thumb" />
        </div>
      </div>

      <div class="cp-wave" aria-hidden="true"></div>
    </header>

    <main class="container cp-main">
      <div class="cp-breadcrumbs">
        <router-link class="cp-crumb" to="/">{{ t('nav.home') }}</router-link>
        <span class="cp-sep">/</span>
        <router-link class="cp-crumb" to="/my-courses">{{ t('profile.title') }}</router-link>
        <span class="cp-sep">/</span>
        <span class="cp-crumb cp-crumb--current">{{ displayTitle }}</span>
        <span class="cp-sep">/</span>
        <span class="cp-crumb cp-crumb--current">{{ t('cp.player') }}</span>
      </div>

      <div class="cp-toolbar card-soft">
        <div class="cp-toolbar-left">
          <div class="cp-toolbar-title">{{ activeLessonTitle }}</div>
          <div class="cp-toolbar-sub">{{ (lessonIndex + 1) }} / {{ (course.lessons?.length || 0) }}</div>
        </div>
        <div class="cp-toolbar-right">
          <label class="cp-toggle">
            <input type="checkbox" v-model="autoplayNext" />
            <span>{{ t('cp.autoplay') }}</span>
          </label>
          <button class="cp-mini" type="button" :disabled="!hasPrev" @click="goPrev">{{ t('cp.prev') }}</button>
          <button class="cp-mini" type="button" :disabled="!hasNext" @click="goNext">{{ t('cp.next') }}</button>
          <button class="cp-mini cp-mini--ok" type="button" @click="toggleComplete(activeLessonId)">
            {{ isLessonCompleted(activeLessonId) ? t('cp.completed') : t('cp.markComplete') }}
          </button>
        </div>
      </div>

      <div class="cp-grid">
        <section class="cp-player card-soft">
          <div class="cp-player-header">
            <h2 class="cp-player-title">{{ t('courseDetail.lessons') }}</h2>
            <div class="cp-player-sub">
              <span class="cp-pill">{{ activeLessonTitle }}</span>
            </div>
          </div>

          <CustomVideoPlayer
            v-if="activeLesson"
            :src="activeLesson.videoUrl"
            :poster="course.thumbnail"
            :storage-key="`${course.id}:${activeLessonId}`"
            @ended="onVideoEnded"
          />

          <div v-if="!isSub" class="cp-locked card-soft">
            <div class="cp-locked-title">{{ t('player.locked') }}</div>
            <button class="cp-btn cp-btn-primary" type="button" @click="showSub = true">
              {{ t('courseDetail.subscribe') }}
            </button>
          </div>
        </section>

        <aside class="cp-lessons card-soft">
          <div class="cp-lessons-header">
            <h3 class="cp-lessons-title">{{ t('courseDetail.outline') }}</h3>
            <div class="cp-lessons-count">{{ (course.lessons?.length || 0) }} {{ t('explore.lessons') }}</div>
          </div>

          <div class="cp-search">
            <input v-model="lessonQuery" class="cp-search-input" :placeholder="t('cp.search')" />
          </div>

          <div class="cp-list" role="list">
            <button
              v-for="(l, idx) in filteredLessons"
              :key="l.id"
              class="cp-item"
              :class="{ active: l.id === activeLessonId }"
              type="button"
              @click="setLesson(l.id)"
            >
              <div class="cp-item-left">
                <div class="cp-index">{{ idx + 1 }}</div>
                <div class="cp-item-text">
                  <div class="cp-item-title">{{ l.title }}</div>
                  <div class="cp-item-sub">
                    <span>{{ isSub ? t('cp.available') : t('cp.locked') }}</span>
                    <span v-if="isLessonCompleted(l.id)" class="cp-done">• {{ t('cp.completed') }}</span>
                  </div>
                </div>
              </div>
              <div class="cp-item-right" aria-hidden="true">▶</div>
            </button>
          </div>
        </aside>
      </div>

      <div class="cp-panels">
        <section class="cp-panel card-soft">
          <div class="cp-panel-title">{{ t('cp.notes') }}</div>
          <textarea v-model="noteText" class="cp-notes" :placeholder="t('cp.notesPh')" />
        </section>

        <section class="cp-panel card-soft">
          <div class="cp-panel-title">{{ t('cp.resources') }}</div>
          <ul class="cp-res">
            <li v-for="r in resources" :key="r.label">
              <a class="cp-res-link" :href="r.href">{{ r.label }}</a>
            </li>
          </ul>
        </section>
      </div>
    </main>

    <SubscribeModal v-if="showSub" :course-id="course.id" @close="showSub = false" />
  </div>

  <section v-else class="container cp-notfound">
    <p class="section-title">{{ t('courseDetail.notFound') }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useAuthStore } from '@/stores/auth.js'
import { useI18nStore } from '@/stores/i18n.js'
import CustomVideoPlayer from '@/components/CustomVideoPlayer.vue'
import SubscribeModal from '@/components/SubscribeModal.vue'
import { issueCertificateIfNeeded } from '@/utils/certificates.js'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const sub = useSubscriptionStore()
const auth = useAuthStore()
const i18n = useI18nStore()
const t = i18n.t

const showSub = ref(false)
const LS_PLAYER = 'kidzania_course_player_last'
const LS_AUTONEXT = 'kidzania_course_player_autonext'
const LS_DONE = 'kidzania_course_player_done'
const LS_NOTES = 'kidzania_course_player_notes'
const activeLessonId = ref('')
const autoplayNext = ref(true)
const lessonQuery = ref('')
const doneByCourse = ref({})
const noteText = ref('')

onMounted(() => {
  store.load()
  auth.load()
  sub.load()
  const saved = safeParseJSON(localStorage.getItem(LS_PLAYER), {})
  if (saved?.[route.params.id]) activeLessonId.value = saved[route.params.id]
  autoplayNext.value = Boolean(safeParseJSON(localStorage.getItem(LS_AUTONEXT), true))
  doneByCourse.value = safeParseJSON(localStorage.getItem(LS_DONE), {})
})

const course = computed(() => {
  const c = store.getById(route.params.id)
  if (!c) return null
  // Do not show drafts to students
  if ((c.status || 'published') !== 'published') return null
  return c
})
const isSub = computed(() => course.value ? sub.isSubscribed(course.value.id) : false)

watch(course, (c) => {
  if (!c) return
  const has = (c.lessons || []).some(l => l.id === activeLessonId.value)
  if (!activeLessonId.value || !has) {
    activeLessonId.value = (c.lessons || [])[0]?.id || ''
  }
}, { immediate: true })

watch(activeLessonId, (id) => {
  const courseId = String(route.params.id || '')
  if (!courseId || !id) return
  const saved = safeParseJSON(localStorage.getItem(LS_PLAYER), {})
  saved[courseId] = id
  localStorage.setItem(LS_PLAYER, JSON.stringify(saved))

  // load notes for lesson
  const notes = safeParseJSON(localStorage.getItem(LS_NOTES), {})
  noteText.value = notes?.[courseId]?.[id] || ''
})

watch(autoplayNext, (v) => {
  localStorage.setItem(LS_AUTONEXT, JSON.stringify(!!v))
})

watch(noteText, (txt) => {
  const courseId = String(route.params.id || '')
  const lessonId = String(activeLessonId.value || '')
  if (!courseId || !lessonId) return
  const notes = safeParseJSON(localStorage.getItem(LS_NOTES), {})
  notes[courseId] = notes[courseId] || {}
  notes[courseId][lessonId] = txt
  localStorage.setItem(LS_NOTES, JSON.stringify(notes))
})

const activeLesson = computed(() => {
  const c = course.value
  if (!c) return null
  return (c.lessons || []).find(l => l.id === activeLessonId.value) || (c.lessons || [])[0] || null
})

const activeLessonTitle = computed(() => activeLesson.value?.title || '')

const lessonIndex = computed(() => {
  const c = course.value
  if (!c) return 0
  return (c.lessons || []).findIndex(l => l.id === activeLessonId.value)
})

const hasPrev = computed(() => lessonIndex.value > 0)
const hasNext = computed(() => {
  const c = course.value
  if (!c) return false
  return lessonIndex.value >= 0 && lessonIndex.value < (c.lessons?.length || 0) - 1
})

const filteredLessons = computed(() => {
  const c = course.value
  const list = (c?.lessons || [])
  const q = (lessonQuery.value || '').trim().toLowerCase()
  if (!q) return list
  return list.filter(l => String(l.title || '').toLowerCase().includes(q))
})

const displayTitle = computed(() => {
  if (!course.value) return ''
  return i18n.locale === 'en'
    ? (course.value.title_en || course.value.title)
    : (course.value.title_ar || course.value.title)
})

const displayDesc = computed(() => {
  if (!course.value) return ''
  return i18n.locale === 'en'
    ? (course.value.description_en || course.value.description)
    : (course.value.description_ar || course.value.description)
})

const categoryText = computed(() => {
  if (!course.value) return ''
  const map = { Arabic: t('category.arabic'), English: t('category.english'), Math: t('category.math') }
  return map[course.value.category] || course.value.category
})

const resources = computed(() => {
  if (!course.value) return []
  const list = []
  list.push({ label: t('cp.res.coursePage'), href: `/course-details/${course.value.id}` })
  list.push({ label: t('cp.res.catalog'), href: `/courses` })
  const tags = course.value.tags || []
  if (tags.includes('Puzzles')) list.push({ label: t('cp.res.practice'), href: `https://www.w3schools.com/` })
  if (tags.includes('Stories')) list.push({ label: t('cp.res.reading'), href: `https://www.w3schools.com/` })
  return list
})

function setLesson(id) {
  activeLessonId.value = id
}

function goPrev() {
  if (!hasPrev.value) return
  const c = course.value
  if (!c) return
  const prev = c.lessons[lessonIndex.value - 1]
  if (prev) activeLessonId.value = prev.id
}

function goNext() {
  if (!hasNext.value) return
  const c = course.value
  if (!c) return
  const next = c.lessons[lessonIndex.value + 1]
  if (next) activeLessonId.value = next.id
}

function isLessonCompleted(lessonId) {
  const courseId = String(route.params.id || '')
  const list = doneByCourse.value?.[courseId] || []
  return list.includes(lessonId)
}

function toggleComplete(lessonId) {
  const courseId = String(route.params.id || '')
  if (!courseId || !lessonId) return
  const beforeList = doneByCourse.value?.[courseId] || []
  const beforeDone = new Set(beforeList)
  const current = doneByCourse.value?.[courseId] || []
  const next = current.includes(lessonId) ? current.filter(x => x !== lessonId) : [...current, lessonId]
  doneByCourse.value = { ...doneByCourse.value, [courseId]: next }
  localStorage.setItem(LS_DONE, JSON.stringify(doneByCourse.value))

  // If course just became fully completed, issue certificate and open it.
  const c = course.value
  if (!c || !Array.isArray(c.lessons) || !c.lessons.length) return
  const afterDone = new Set(next)
  const wasComplete = c.lessons.every(l => beforeDone.has(l.id))
  const nowComplete = c.lessons.every(l => afterDone.has(l.id))
  if (!wasComplete && nowComplete && isSub.value) {
    const uid = auth.user?.id || 'guest'
    issueCertificateIfNeeded(uid, courseId, {
      userName: auth.user?.name || '',
      courseTitle: displayTitle.value,
      completionPercent: 100,
      lessonsCompleted: c.lessons.length,
      finalGrade: 'A+',
      locale: i18n.locale
    })
    router.push({ name: 'certificate', params: { courseId } })
  }
}

function onVideoEnded() {
  if (activeLessonId.value) toggleComplete(activeLessonId.value)
  if (autoplayNext.value && hasNext.value) goNext()
}

function safeParseJSON(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}
</script>

<style scoped>
.cp-page {
  background: #fff;
  min-height: 100vh;
}

.cp-hero {
  position: relative;
  background: linear-gradient(to right, #81DFFF, #90EE90);
  padding: 56px 0 92px;
  overflow: hidden;
}

.cp-hero-inner {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;
  align-items: center;
}

.cp-title {
  margin: 0 0 10px;
  font-weight: 900;
  color: var(--primary, #033B62);
  font-size: clamp(1.8rem, 3.3vw, 3rem);
  text-align: start;
}

.cp-desc {
  margin: 0 0 14px;
  color: rgba(3, 59, 98, 0.8);
  font-weight: 700;
  line-height: 1.5;
  text-align: start;
}

.cp-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.cp-chip {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  color: rgba(3, 59, 98, 0.85);
  font-size: 0.85rem;
}

.cp-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.cp-btn {
  border: 0;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cp-btn-primary {
  background: var(--primary, #033B62);
  color: #fff;
}

.cp-btn-ghost {
  background: rgba(255, 255, 255, 0.55);
  color: rgba(3, 59, 98, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.85);
}

.cp-hero-card {
  background: rgba(255, 255, 255, 0.65);
  border-radius: 18px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.cp-thumb {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 14px;
}

.cp-wave {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 70px;
  background: #fff;
  border-top-left-radius: 120% 100%;
  border-top-right-radius: 120% 100%;
  transform: scaleX(1.15);
}

.cp-main {
  margin-top: -44px;
  padding-bottom: 56px;
  position: relative;
  z-index: 2;
}

.cp-breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: rgba(3, 59, 98, 0.65);
  font-weight: 900;
  font-size: 0.9rem;
}

.cp-crumb {
  color: rgba(3, 59, 98, 0.8);
  text-decoration: none;
}

.cp-crumb:hover {
  text-decoration: underline;
}

.cp-crumb--current {
  color: rgba(3, 59, 98, 0.9);
}

.cp-sep {
  opacity: 0.5;
}

.cp-toolbar {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.cp-toolbar-title {
  font-weight: 900;
  color: var(--primary, #033B62);
  text-align: start;
}

.cp-toolbar-sub {
  color: rgba(3, 59, 98, 0.6);
  font-weight: 900;
  font-size: 0.85rem;
  text-align: start;
}

.cp-toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.cp-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(3, 59, 98, 0.05);
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 900;
  color: rgba(3, 59, 98, 0.8);
}

.cp-mini {
  border: 0;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 900;
  cursor: pointer;
  background: rgba(0, 191, 255, 0.12);
  color: rgba(3, 59, 98, 0.9);
  border: 1px solid rgba(0, 191, 255, 0.22);
}

.cp-mini:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cp-mini--ok {
  background: rgba(144, 238, 144, 0.25);
  border-color: rgba(144, 238, 144, 0.35);
}

.cp-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 14px;
  align-items: start;
}

.cp-player {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 14px;
}

.cp-player-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.cp-player-title {
  margin: 0;
  font-weight: 900;
  color: var(--primary, #033B62);
  font-size: 1.1rem;
  text-align: start;
}

.cp-player-sub {
  display: flex;
  justify-content: flex-end;
}

.cp-pill {
  background: rgba(0, 191, 255, 0.12);
  border: 1px solid rgba(0, 191, 255, 0.25);
  color: var(--primary, #033B62);
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.cp-player :deep(.card) {
  border: 0;
  box-shadow: none;
}

.cp-player :deep(.kvp) { border-radius: 14px; }

.cp-locked {
  margin-top: 12px;
  background: rgba(3, 59, 98, 0.05);
  border: 1px solid rgba(3, 59, 98, 0.08);
  border-radius: 18px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cp-locked-title {
  font-weight: 900;
  color: rgba(3, 59, 98, 0.8);
  text-align: start;
}

.cp-lessons {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 14px;
}

.cp-search {
  margin: 10px 0 8px;
}

.cp-search-input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(3, 59, 98, 0.14);
  padding: 10px 12px;
  background: #fff;
  color: var(--primary, #033B62);
  font-weight: 800;
}

.cp-lessons-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.cp-lessons-title {
  margin: 0;
  font-weight: 900;
  color: var(--primary, #033B62);
  font-size: 1.1rem;
  text-align: start;
}

.cp-lessons-count {
  color: rgba(3, 59, 98, 0.6);
  font-weight: 900;
  font-size: 0.85rem;
}

.cp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 520px;
  overflow: auto;
  padding-right: 2px;
}

.cp-item {
  border: 1px solid rgba(3, 59, 98, 0.12);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--primary, #033B62);
  cursor: pointer;
  text-align: start;
}

.cp-item.active {
  border-color: rgba(0, 191, 255, 0.45);
  background: rgba(0, 191, 255, 0.08);
}

.cp-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.cp-index {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(3, 59, 98, 0.06);
  font-weight: 900;
  color: rgba(3, 59, 98, 0.7);
  flex: 0 0 auto;
}

.cp-item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.cp-item-title {
  font-weight: 900;
  font-size: 0.9rem;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cp-item-sub {
  color: rgba(3, 59, 98, 0.6);
  font-weight: 800;
  font-size: 0.8rem;
}

.cp-done {
  color: rgba(3, 59, 98, 0.8);
}

.cp-item-right {
  color: rgba(3, 59, 98, 0.45);
  font-weight: 900;
  flex: 0 0 auto;
}

.cp-notfound {
  padding: 80px 0;
}

.cp-panels {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 14px;
}

.cp-panel {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 14px;
}

.cp-panel-title {
  font-weight: 900;
  color: var(--primary, #033B62);
  margin-bottom: 10px;
  text-align: start;
}

.cp-notes {
  width: 100%;
  min-height: 140px;
  border-radius: 14px;
  border: 1px solid rgba(3, 59, 98, 0.14);
  padding: 12px;
  font-weight: 700;
  color: rgba(3, 59, 98, 0.9);
  resize: vertical;
}

.cp-res {
  margin: 0;
  padding-left: 18px;
  color: rgba(3, 59, 98, 0.8);
  font-weight: 800;
}

.cp-res-link {
  color: rgba(0, 125, 180, 0.95);
  text-decoration: none;
}

.cp-res-link:hover {
  text-decoration: underline;
}

@media (max-width: 992px) {
  .cp-hero-inner {
    grid-template-columns: 1fr;
  }

  .cp-grid {
    grid-template-columns: 1fr;
  }

  .cp-panels {
    grid-template-columns: 1fr;
  }

  .cp-thumb {
    height: 200px;
  }
}
</style>


