<template>
  <div class="my-courses-page">
    <header class="hero position-relative overflow-hidden">
      <div class="hero-inner container">
        <h1 class="hero-title"><span>{{ t('myCourses.heroTitle') }}</span></h1>
        <p class="hero-subtitle">{{ t('myCourses.heroSubtitle') }}</p>
      </div>
      <!-- Wave Divider -->
      <div class="wave-divider">
        <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,75 C240,0 480,150 720,75 C960,0 1200,150 1440,75 L1440,150 L0,150 Z" fill="white"/>
        </svg>
      </div>
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
        <div v-if="hasEnrolledCourses && pagedCourses.length" class="myc-grid" role="tabpanel">
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

        <div v-else-if="!hasEnrolledCourses" class="myc-encouragement card-soft">
          <div class="encouragement-icon">📚</div>
          <h3 class="encouragement-title">{{ i18n.locale === 'ar' ? 'ابدأ رحلتك التعليمية!' : 'Start Your Learning Journey!' }}</h3>
          <p class="encouragement-text">
            {{ i18n.locale === 'ar' 
              ? 'لم تسجل في أي كورس بعد. استكشف مجموعتنا المتنوعة من الكورسات التعليمية وابدأ التعلم اليوم!' 
              : 'You haven\'t enrolled in any courses yet. Explore our diverse collection of educational courses and start learning today!' }}
          </p>
          <router-link to="/courses" class="encouragement-btn">
            {{ i18n.locale === 'ar' ? 'استكشف الكورسات' : 'Explore Courses' }}
            <span class="encouragement-arrow" aria-hidden="true">→</span>
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
        </div>

        <div v-if="completedCourses.length" class="myc-cert-grid">
          <article v-for="c in completedCourses" :key="c.id" class="myc-cert-card card-soft">
            <div class="myc-cert-media">
              <img :src="c.thumbnail" :alt="displayTitle(c)" class="myc-cert-img" />
            </div>
            <div class="myc-cert-body">
              <div class="myc-cert-name">{{ displayTitle(c) }}</div>
              <div class="myc-cert-meta">{{ (c.lessons?.length || 0) }} {{ t('explore.lessons') }}</div>
              <router-link class="myc-cert-open" :to="`/certificate/${c.id}`">
                {{ t('myCourses.certificates.view') }}
                <span aria-hidden="true">→</span>
              </router-link>
            </div>
          </article>
        </div>

        <div v-else class="myc-cert-box card-soft">
          <p class="myc-cert-subtitle">{{ t('profile.empty') }}</p>
          <router-link to="/courses" class="myc-cert-btn">{{ t('myCourses.discover.button') }}</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, onActivated, ref } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useI18nStore } from '@/stores/i18n.js'

const store = useCoursesStore()
const sub = useSubscriptionStore()
const i18n = useI18nStore()
const t = i18n.t

const LS_DONE = 'kidzania_course_player_done'
const activeTab = ref('in_progress')
const page = ref(1)
const pageSize = 5
const doneByCourse = ref({})

function safeParseJSON(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

// Calculate progress based on completed lessons
function calculateCourseProgress(course) {
  if (!course || !course.lessons || course.lessons.length === 0) return 0
  const courseId = String(course.id)
  const completedLessons = doneByCourse.value[courseId] || []
  const totalLessons = course.lessons.length
  const completedCount = completedLessons.length
  return Math.round((completedCount / totalLessons) * 100)
}

function setTab(tab) {
  activeTab.value = tab
  page.value = 1
}

let progressInterval = null

onMounted(() => {
  store.load()
  sub.load()
  loadLessonProgress()
  
  // Listen for storage events (when lesson completion changes in another tab/window)
  window.addEventListener('storage', handleStorageChange)
  
  // Poll for changes (when lesson completion changes in same tab)
  progressInterval = setInterval(() => {
    const current = safeParseJSON(localStorage.getItem(LS_DONE), {})
    const currentStr = JSON.stringify(current)
    const storedStr = JSON.stringify(doneByCourse.value)
    if (currentStr !== storedStr) {
      doneByCourse.value = current
    }
  }, 1000)
})

// Reload progress when page becomes active again (e.g., back button)
onActivated(() => {
  loadLessonProgress()
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})

function loadLessonProgress() {
  doneByCourse.value = safeParseJSON(localStorage.getItem(LS_DONE), {})
}

function handleStorageChange(e) {
  if (e.key === LS_DONE) {
    loadLessonProgress()
  }
}

// Only show courses the user is actually enrolled in
const courses = computed(() => {
  // Hide drafts from students even if they are somehow subscribed
  return store.courses.filter(c => sub.isSubscribed(c.id) && (c.status || 'published') === 'published')
})

const hasEnrolledCourses = computed(() => {
  return courses.value.length > 0
})

const coursesWithProgress = computed(() => {
  return courses.value.map(c => ({
    ...c,
    __progress: clamp(calculateCourseProgress(c), 0, 100)
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

/* Hero - matching Tests/PlayWithUs */
.hero {
  position: relative;
  width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('/assets/images/Mycourses.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 90px;
  padding-bottom: 120px;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 191, 255, 0.55), rgba(144, 238, 144, 0.45));
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 2;
}

.hero-title {
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  line-height: 1.05;
  font-size: clamp(2.2rem, 4.8vw, 3.2rem);
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  letter-spacing: 2px;
}

.hero-title span {
  display: block;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.95);
  margin: 12px 0 0 0;
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
  font-weight: 700;
}

.wave-divider {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 150px;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.wave-divider svg {
  width: 100%;
  height: 100%;
  display: block;
}

@media (max-width: 768px) {
  .hero {
    min-height: 58vh;
    padding-top: 70px;
    padding-bottom: 70px;
  }
}

@media (max-width: 480px) {
  .hero {
    min-height: 50vh;
    padding-top: 60px;
    padding-bottom: 60px;
  }
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

.myc-encouragement {
  margin-top: 18px;
  text-align: center;
  padding: 40px 30px;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.08), rgba(255, 215, 0, 0.06));
  border: 2px dashed rgba(0, 191, 255, 0.25);
}

.encouragement-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  line-height: 1;
}

.encouragement-title {
  margin: 0 0 12px;
  font-weight: 900;
  color: var(--primary, #033B62);
  font-size: 1.5rem;
}

.encouragement-text {
  margin: 0 0 24px;
  color: rgba(3, 59, 98, 0.75);
  font-size: 1.05rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.encouragement-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--primary-medium, #00BFFF);
  color: #fff;
  text-decoration: none;
  font-weight: 900;
  padding: 14px 28px;
  border-radius: 999px;
  font-size: 1.05rem;
  transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.encouragement-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(0, 191, 255, 0.3);
  background: #00a8e6;
}

.encouragement-arrow {
  font-weight: 900;
  font-size: 1.2rem;
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
  gap: 12px;
}

.myc-cert-box {
  width: min(720px, 100%);
  background: #fff;
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  text-align: center;
}

.myc-cert-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.myc-cert-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(3, 59, 98, 0.08);
}

.myc-cert-media { padding: 12px 12px 0; }
.myc-cert-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
}

.myc-cert-body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.myc-cert-name {
  font-weight: 900;
  color: var(--primary, #033B62);
  text-align: start;
}

.myc-cert-meta {
  color: rgba(3, 59, 98, 0.65);
  font-weight: 800;
  font-size: 0.85rem;
  text-align: start;
}

.myc-cert-open {
  margin-top: auto;
  background: rgba(0, 191, 255, 0.10);
  color: rgba(3, 59, 98, 0.9);
  border: 1px solid rgba(0, 191, 255, 0.22);
  border-radius: 999px;
  padding: 10px 12px;
  text-decoration: none;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.myc-cert-open:hover {
  background: rgba(0, 191, 255, 0.14);
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
  .myc-cert-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 576px) {
  .myc-hero-inner { padding: 34px 0 64px; }
  .myc-stats { grid-template-columns: 1fr; }
  .myc-stat { justify-content: flex-start; }
  .myc-grid { grid-template-columns: 1fr; }
  .myc-cert-grid { grid-template-columns: 1fr; }
}
</style>
