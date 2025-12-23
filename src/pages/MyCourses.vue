<template>
  <div class="my-courses-page">
    <header class="myc-hero">
      <div class="myc-hero-inner container">
        <h1 class="myc-hero-title">{{ t('myCourses.heroTitle') }}</h1>
        <p class="myc-hero-subtitle">{{ t('myCourses.heroSubtitle') }}</p>
      </div>
      <div class="myc-hero-wave" aria-hidden="true"></div>
    </header>

    <section class="container myc-content">
      <div class="myc-stats card-soft">
        <div class="myc-stat">
          <div class="myc-stat-icon myc-stat-icon--gold" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z" />
            </svg>
          </div>
          <div class="myc-stat-text">
            <div class="myc-stat-value">{{ stats.completed }}</div>
            <div class="myc-stat-label">{{ t('myCourses.stats.completed') }}</div>
          </div>
        </div>

        <div class="myc-stat">
          <div class="myc-stat-icon myc-stat-icon--purple" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.42a12.08 12.08 0 01.84 4.42c0 2.65-1.03 5.1-2.72 6.92L12 18l-4.28 3.92A9.95 9.95 0 015 15c0-1.54.35-3 .98-4.3L12 14z" />
            </svg>
          </div>
          <div class="myc-stat-text">
            <div class="myc-stat-value">{{ stats.inProgress }}</div>
            <div class="myc-stat-label">{{ t('myCourses.stats.inProgress') }}</div>
          </div>
        </div>

        <div class="myc-stat">
          <div class="myc-stat-icon myc-stat-icon--green" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div class="myc-stat-text">
            <div class="myc-stat-value">{{ stats.certificates }}</div>
            <div class="myc-stat-label">{{ t('myCourses.stats.certificates') }}</div>
          </div>
        </div>
      </div>

      <div class="myc-tabs" role="tablist" aria-label="My courses tabs">
        <button
          class="myc-tab"
          :class="{ active: activeTab === 'in_progress' }"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'in_progress'"
          @click="setTab('in_progress')"
        >
          {{ t('myCourses.tabs.inProgress') }}
        </button>
        <button
          class="myc-tab"
          :class="{ active: activeTab === 'completed' }"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'completed'"
          @click="setTab('completed')"
        >
          {{ t('myCourses.tabs.completed') }}
        </button>
        <button
          class="myc-tab"
          :class="{ active: activeTab === 'certificates' }"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'certificates'"
          @click="setTab('certificates')"
        >
          {{ t('myCourses.tabs.certificates') }}
        </button>
      </div>

      <div v-if="activeTab !== 'certificates'">
        <div v-if="pagedCourses.length" class="myc-grid" role="tabpanel">
          <article v-for="c in pagedCourses" :key="c.id" class="myc-course card-soft">
            <div class="myc-course-media">
              <img :src="c.thumbnail" :alt="displayTitle(c)" class="myc-course-img" />
            </div>
            <div class="myc-course-body">
              <h3 class="myc-course-title">{{ displayTitle(c) }}</h3>
              <p class="myc-course-desc">{{ displayDesc(c) }}</p>

              <div class="myc-progress">
                <div class="myc-progress-row">
                  <span class="myc-progress-label">{{ t('myCourses.progress') }}</span>
                  <span class="myc-progress-value">{{ c.__progress }}%</span>
                </div>
                <div class="myc-progress-bar" role="progressbar" :aria-valuenow="c.__progress" aria-valuemin="0" aria-valuemax="100">
                  <div class="myc-progress-fill" :style="{ width: c.__progress + '%' }"></div>
                </div>
              </div>

              <router-link class="myc-cta" :to="`/course-player/${c.id}`">
                {{ t('myCourses.continueLearning') }}
                <span class="myc-cta-arrow" aria-hidden="true">→</span>
              </router-link>
            </div>
          </article>

          <router-link to="/courses" class="myc-discover card-soft">
            <div class="myc-discover-plus" aria-hidden="true">+</div>
            <div class="myc-discover-title">{{ t('myCourses.discover.title') }}</div>
            <div class="myc-discover-text">{{ t('myCourses.discover.text') }}</div>
            <div class="myc-discover-btn">{{ t('myCourses.discover.button') }}</div>
          </router-link>
        </div>

        <p v-else class="myc-empty">{{ t('profile.empty') }}</p>

        <div v-if="totalPages > 1" class="myc-pagination" aria-label="Pagination">
          <button class="myc-page-btn" type="button" :disabled="page === 1" @click="page = Math.max(1, page - 1)">«</button>
          <button
            v-for="p in visiblePages"
            :key="p"
            class="myc-page-btn"
            :class="{ active: p === page }"
            type="button"
            @click="page = p"
          >
            {{ p }}
          </button>
          <button class="myc-page-btn" type="button" :disabled="page === totalPages" @click="page = Math.min(totalPages, page + 1)">»</button>
        </div>
      </div>

      <div v-else class="myc-certificates" role="tabpanel">
        <div class="myc-cert-box card-soft">
          <h3 class="myc-cert-title">{{ t('myCourses.certificates.title') }}</h3>
          <p class="myc-cert-subtitle">{{ t('myCourses.certificates.subtitle', { count: stats.certificates }) }}</p>
          <router-link to="/courses" class="myc-cert-btn">{{ t('myCourses.discover.button') }}</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useI18nStore } from '@/stores/i18n.js'

const store = useCoursesStore()
const sub = useSubscriptionStore()
const i18n = useI18nStore()
const t = i18n.t

const LS_PROGRESS = 'kidzania_course_progress'
const activeTab = ref('in_progress')
const page = ref(1)
const pageSize = 5
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

function ensureProgress(coursesList) {
  const next = { ...progressById.value }
  let changed = false
  for (const c of coursesList) {
    if (next[c.id] == null) {
      next[c.id] = seededPercent(c.id)
      changed = true
    }
  }
  if (changed) {
    progressById.value = next
    localStorage.setItem(LS_PROGRESS, JSON.stringify(next))
  }
}

function setTab(tab) {
  activeTab.value = tab
  page.value = 1
}

onMounted(() => {
  store.load()
  sub.load()
  progressById.value = safeParseJSON(localStorage.getItem(LS_PROGRESS), {})
})

const DEMO_COURSE_IDS = ['c1', 'c2', 'c3']

function pickDemoCourses(all) {
  const byId = new Map(all.map(c => [c.id, c]))
  const picked = DEMO_COURSE_IDS.map(id => byId.get(id)).filter(Boolean)
  return picked.length ? picked : all.slice(0, 3)
}

// If the user has no subscriptions yet, show a small demo list (dummy data) so the page doesn't look empty.
const courses = computed(() => {
  const real = store.courses.filter(c => sub.isSubscribed(c.id))
  if (real.length) return real
  return pickDemoCourses(store.courses)
})

const coursesWithProgress = computed(() => {
  ensureProgress(courses.value)
  return courses.value.map(c => ({
    ...c,
    __progress: clamp(Number(progressById.value[c.id] ?? seededPercent(c.id)), 0, 100)
  }))
})

const inProgressCourses = computed(() => coursesWithProgress.value.filter(c => c.__progress < 100))
const completedCourses = computed(() => coursesWithProgress.value.filter(c => c.__progress >= 100))

const stats = computed(() => ({
  completed: completedCourses.value.length,
  inProgress: inProgressCourses.value.length,
  certificates: completedCourses.value.length
}))

const activeCourses = computed(() => {
  if (activeTab.value === 'completed') return completedCourses.value
  return inProgressCourses.value
})

const totalPages = computed(() => Math.max(1, Math.ceil(activeCourses.value.length / pageSize)))

const visiblePages = computed(() => {
  const max = Math.min(totalPages.value, 4)
  const pages = []
  for (let i = 1; i <= max; i++) pages.push(i)
  return pages
})

const pagedCourses = computed(() => {
  const start = (page.value - 1) * pageSize
  return activeCourses.value.slice(start, start + pageSize)
})

function displayTitle(course) {
  return i18n.locale === 'en' ? (course.title_en || course.title) : (course.title_ar || course.title)
}

function displayDesc(course) {
  return i18n.locale === 'en' ? (course.description_en || course.description) : (course.description_ar || course.description)
}
</script>

<style scoped>
.my-courses-page {
  background: #fff;
}

.myc-hero {
  position: relative;
  width: 100%;
  min-height: clamp(280px, 45vh, 430px);
  display: grid;
  place-items: center;
  text-align: center;
  background-image: url('/assets/images/Mycourses.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}

.myc-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 191, 255, 0.55), rgba(144, 238, 144, 0.45));
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.myc-hero-inner {
  position: relative;
  z-index: 2;
  padding: 48px 0 70px;
}

.myc-hero-title {
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  line-height: 1.05;
  font-size: clamp(2rem, 5vw, 3.6rem);
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.myc-hero-subtitle {
  color: rgba(255, 255, 255, 0.95);
  margin-top: 12px;
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
}

.myc-hero-wave {
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

.myc-content {
  padding: 0 0 56px;
  margin-top: -28px;
  position: relative;
  z-index: 3;
}

.myc-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  background: #fff;
  border-radius: 18px;
  padding: 14px 16px;
  align-items: center;
}

.myc-stat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 12px;
}

.myc-stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #fff;
  flex: 0 0 auto;
}

.myc-stat-icon svg {
  width: 22px;
  height: 22px;
}

.myc-stat-icon--gold { background: rgba(255, 215, 0, 0.95); color: #1f2a37; }
.myc-stat-icon--purple { background: rgba(146, 110, 255, 0.95); }
.myc-stat-icon--green { background: rgba(144, 238, 144, 0.95); color: #1f2a37; }

.myc-stat-value {
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--primary, #033B62);
  line-height: 1.1;
  text-align: start;
}

.myc-stat-label {
  font-size: 0.82rem;
  color: rgba(3, 59, 98, 0.65);
  text-align: start;
}

.myc-tabs {
  margin: 22px auto 18px;
  width: max-content;
  background: rgba(3, 59, 98, 0.06);
  border-radius: 999px;
  padding: 6px;
  display: inline-flex;
  gap: 6px;
}

.myc-tab {
  border: 0;
  background: transparent;
  color: rgba(3, 59, 98, 0.7);
  font-weight: 700;
  padding: 9px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  font-size: 0.9rem;
}

.myc-tab.active {
  background: var(--primary-medium, #00BFFF);
  color: #fff;
  box-shadow: 0 10px 25px rgba(0, 191, 255, 0.25);
}

.myc-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  align-items: stretch;
}

.myc-course {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(3, 59, 98, 0.08);
}

.myc-course-media {
  padding: 12px 12px 0;
}

.myc-course-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
}

.myc-course-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100% - 154px);
}

.myc-course-title {
  font-size: 0.98rem;
  color: var(--primary, #033B62);
  font-weight: 800;
  margin: 0;
  line-height: 1.25;
}

.myc-course-desc {
  margin: 0;
  color: rgba(3, 59, 98, 0.65);
  font-size: 0.86rem;
  line-height: 1.5;
  min-height: 40px;
}

.myc-progress {
  margin-top: 2px;
}

.myc-progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.myc-progress-label {
  font-size: 0.82rem;
  color: rgba(3, 59, 98, 0.65);
  font-weight: 700;
}

.myc-progress-value {
  font-size: 0.82rem;
  color: rgba(3, 59, 98, 0.65);
  font-weight: 800;
}

.myc-progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(3, 59, 98, 0.1);
  border-radius: 999px;
  overflow: hidden;
}

.myc-progress-fill {
  height: 100%;
  background: var(--secondary-salmon, #FFA07A);
  border-radius: 999px;
  transition: width 0.25s ease;
}

.myc-cta {
  margin-top: auto;
  background: var(--primary-medium, #00BFFF);
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  border-radius: 999px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
  font-size: 0.9rem;
}

.myc-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px rgba(0, 191, 255, 0.25);
  background: #00a8e6;
}

.myc-cta-arrow {
  font-weight: 900;
}

.myc-discover {
  background: #fff;
  border-radius: 18px;
  border: 2px dashed rgba(3, 59, 98, 0.18);
  text-decoration: none;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--primary, #033B62);
}

.myc-discover-plus {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: rgba(3, 59, 98, 0.06);
  display: grid;
  place-items: center;
  font-size: 28px;
  font-weight: 900;
  color: rgba(3, 59, 98, 0.5);
}

.myc-discover-title {
  font-weight: 900;
  font-size: 1rem;
  text-align: center;
}

.myc-discover-text {
  color: rgba(3, 59, 98, 0.65);
  font-size: 0.88rem;
  text-align: center;
  max-width: 260px;
}

.myc-discover-btn {
  margin-top: 6px;
  background: rgba(0, 191, 255, 0.08);
  color: var(--primary-medium, #00BFFF);
  border: 1px solid rgba(0, 191, 255, 0.25);
  font-weight: 900;
  padding: 9px 14px;
  border-radius: 999px;
}

.myc-empty {
  margin-top: 18px;
  color: rgba(3, 59, 98, 0.7);
  text-align: center;
}

.myc-pagination {
  margin-top: 18px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.myc-page-btn {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(3, 59, 98, 0.12);
  background: #fff;
  color: rgba(3, 59, 98, 0.75);
  font-weight: 900;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.myc-page-btn.active {
  background: var(--primary-medium, #00BFFF);
  color: #fff;
  border-color: transparent;
}

.myc-page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.myc-certificates {
  margin-top: 18px;
  display: grid;
  place-items: center;
}

.myc-cert-box {
  width: min(720px, 100%);
  background: #fff;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  text-align: center;
}

.myc-cert-title {
  margin: 0 0 10px;
  font-weight: 900;
  color: var(--primary, #033B62);
}

.myc-cert-subtitle {
  margin: 0 0 16px;
  color: rgba(3, 59, 98, 0.65);
}

.myc-cert-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--primary-medium, #00BFFF);
  color: #fff;
  text-decoration: none;
  font-weight: 900;
}

@media (max-width: 992px) {
  .myc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 576px) {
  .myc-hero-inner { padding: 34px 0 64px; }
  .myc-stats { grid-template-columns: 1fr; }
  .myc-stat { justify-content: flex-start; }
  .myc-grid { grid-template-columns: 1fr; }
}
</style>
