<template>
  <div class="cert-page" v-if="course">
    <header class="cert-hero">
      <div class="container cert-hero-inner">
        <div class="cert-hero-text">
          <h1 class="cert-page-title">{{ t('certificate.pageTitle') }}</h1>
          <p class="cert-page-sub">{{ t('certificate.pageSubtitle') }}</p>
        </div>

        <div class="cert-hero-actions">
          <button class="cert-btn cert-btn-primary" type="button" :disabled="!eligible || downloading" @click="downloadPdf">
            {{ downloading ? t('certificate.downloading') : t('certificate.download') }}
          </button>
          <router-link class="cert-btn cert-btn-ghost" to="/my-courses">
            {{ t('certificate.goToMyCourses') }}
          </router-link>
        </div>
      </div>
      <div class="cert-wave" aria-hidden="true"></div>
    </header>

    <main class="container cert-main">
      <section v-if="!eligible" class="cert-not-eligible card-soft">
        <h2 class="cert-not-title">{{ t('certificate.notEligibleTitle') }}</h2>
        <p class="cert-not-text">{{ t('certificate.notEligibleText') }}</p>
        <router-link class="cert-btn cert-btn-primary" :to="`/course-player/${course.id}`">
          {{ t('certificate.goToPlayer') }}
        </router-link>
      </section>

      <template v-else>
        <div class="cert-sheet-wrap">
          <!-- This is the only area captured into PDF -->
          <section ref="certEl" class="cert-sheet card-soft" aria-label="Certificate">
            <div class="cert-decor cert-decor--left" aria-hidden="true">
              <div class="cert-sun"></div>
              <div class="cert-spark cert-spark--a"></div>
              <div class="cert-spark cert-spark--b"></div>
            </div>
            <div class="cert-decor cert-decor--right" aria-hidden="true">
              <div class="cert-star"></div>
              <div class="cert-spark cert-spark--c"></div>
              <div class="cert-spark cert-spark--d"></div>
            </div>

            <div class="cert-top">
              <div class="cert-medal" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z" />
                </svg>
              </div>
              <h2 class="cert-title">{{ t('certificate.certificateOfAchievement') }}</h2>
              <div class="cert-line cert-line--small">{{ t('certificate.certifyThat') }}</div>
              <div class="cert-student">{{ studentName }}</div>
              <div class="cert-line">{{ t('certificate.completedCourse') }}</div>
              <div class="cert-course">{{ displayCourseTitle }}</div>
              <div class="cert-line cert-line--muted">{{ t('certificate.recognition') }}</div>

              <div class="cert-badges" aria-hidden="true">
                <div class="cert-badge cert-badge--pink"></div>
                <div class="cert-badge cert-badge--gold"></div>
                <div class="cert-badge cert-badge--blue"></div>
              </div>
            </div>

            <div class="cert-footer">
              <div class="cert-foot-col">
                <div class="cert-foot-label">{{ t('certificate.dateOfCompletion') }}</div>
                <div class="cert-foot-value">{{ formattedIssuedDate }}</div>
                <div class="cert-foot-line" aria-hidden="true"></div>
              </div>
              <div class="cert-foot-col">
                <div class="cert-foot-label">{{ t('certificate.authorizedSignature') }}</div>
                <div class="cert-foot-value">Kidzademy</div>
                <div class="cert-foot-line" aria-hidden="true"></div>
              </div>
            </div>
          </section>

          <section class="cert-stats">
            <div class="cert-stat card-soft">
              <div class="cert-stat-icon cert-stat-icon--pink" aria-hidden="true">★</div>
              <div class="cert-stat-value">{{ completionPercent }}%</div>
              <div class="cert-stat-label">{{ t('certificate.completion') }}</div>
            </div>
            <div class="cert-stat card-soft">
              <div class="cert-stat-icon cert-stat-icon--gold" aria-hidden="true">🏆</div>
              <div class="cert-stat-value">{{ lessonsCompleted }}</div>
              <div class="cert-stat-label">{{ t('certificate.lessonsCompleted') }}</div>
            </div>
            <div class="cert-stat card-soft">
              <div class="cert-stat-icon cert-stat-icon--blue" aria-hidden="true">🎓</div>
              <div class="cert-stat-value">{{ finalGrade }}</div>
              <div class="cert-stat-label">{{ t('certificate.finalGrade') }}</div>
            </div>
          </section>

          <section class="cert-congrats card-soft">
            <h3 class="cert-congrats-title">{{ t('certificate.congratsTitle') }}</h3>
            <p class="cert-congrats-text">{{ t('certificate.congratsText') }}</p>
            <div class="cert-congrats-actions">
              <button class="cert-btn cert-btn-primary" type="button" :disabled="downloading" @click="downloadPdf">
                {{ downloading ? t('certificate.downloading') : t('certificate.download') }}
              </button>
              <router-link class="cert-btn cert-btn-ghost" to="/courses">
                {{ t('certificate.continueLearning') }}
              </router-link>
            </div>
          </section>
        </div>
      </template>
    </main>
  </div>

  <section v-else class="container cert-notfound">
    <p class="section-title">{{ t('courseDetail.notFound') }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useCoursesStore } from '@/stores/courses.js'
import { useAuthStore } from '@/stores/auth.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useResultsStore } from '@/stores/results.js'
import { useI18nStore } from '@/stores/i18n.js'
import { getCertificate, issueCertificateIfNeeded } from '@/utils/certificates.js'

const route = useRoute()
const coursesStore = useCoursesStore()
const auth = useAuthStore()
const sub = useSubscriptionStore()
const results = useResultsStore()
const i18n = useI18nStore()
const t = i18n.t

const LS_DONE = 'kidzania_course_player_done'

const certEl = ref(null)
const downloading = ref(false)
const cert = ref(null)

function safeParseJSON(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}

function getDoneLessonIds(courseId) {
  const map = safeParseJSON(localStorage.getItem(LS_DONE), {})
  return Array.isArray(map?.[courseId]) ? map[courseId] : []
}

function computeGradeFromPercent(percent) {
  const p = Number(percent ?? NaN)
  if (!Number.isFinite(p)) return 'A+'
  if (p >= 97) return 'A+'
  if (p >= 93) return 'A'
  if (p >= 85) return 'B+'
  if (p >= 75) return 'B'
  return 'C'
}

function bestExamPercentForCourse({ userId, courseId }) {
  const list = Array.isArray(results.results) ? results.results : []
  const filtered = list.filter(r => String(r.userId) === String(userId) && String(r.courseId) === String(courseId))
  if (!filtered.length) return null
  return filtered.reduce((best, r) => Math.max(best, Number(r.percent ?? 0)), 0)
}

function formatDate(iso) {
  const d = new Date(iso || Date.now())
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat(i18n.locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(d)
}

function safeFilePart(v) {
  return String(v || '')
    .trim()
    .replace(/[\\/:*?"<>|]/g, '-') // Windows-safe
    .replace(/\s+/g, ' ')
    .slice(0, 80)
}

const courseId = computed(() => String(route.params.courseId || ''))

const course = computed(() => {
  const c = coursesStore.getById(courseId.value)
  if (!c) return null
  if ((c.status || 'published') !== 'published') return null
  return c
})

const displayCourseTitle = computed(() => {
  if (!course.value) return ''
  return i18n.locale === 'en'
    ? (course.value.title_en || course.value.title)
    : (course.value.title_ar || course.value.title)
})

const studentName = computed(() => auth.user?.name || t('profile.guestName'))

const totalLessons = computed(() => Number(course.value?.lessons?.length || 0))
const lessonsCompleted = computed(() => (doneLessonIds.value || []).length)
const completionPercent = computed(() => {
  const total = totalLessons.value
  if (!total) return 0
  return Math.round((lessonsCompleted.value / total) * 100)
})

const doneLessonIds = computed(() => getDoneLessonIds(courseId.value))

const courseCompleted = computed(() => {
  const total = totalLessons.value
  if (!total) return false
  const done = new Set(doneLessonIds.value || [])
  return (course.value?.lessons || []).every(l => done.has(l.id))
})

const existingCert = computed(() => {
  const uid = auth.user?.id || 'guest'
  return getCertificate(uid, courseId.value)
})

const eligible = computed(() => Boolean(existingCert.value || courseCompleted.value))

const finalGrade = computed(() => {
  const uid = auth.user?.id
  if (!uid) return 'A+'
  const best = bestExamPercentForCourse({ userId: uid, courseId: courseId.value })
  return computeGradeFromPercent(best)
})

const formattedIssuedDate = computed(() => {
  const iso = cert.value?.issuedAt || existingCert.value?.issuedAt || new Date().toISOString()
  return formatDate(iso)
})

onMounted(async () => {
  await auth.load()
  await coursesStore.load()
  await sub.load()
  await results.load()

  // if eligible, ensure we have a stored certificate (so date/serial are stable)
  const uid = auth.user?.id || 'guest'
  if (courseId.value) {
    const maybeExisting = getCertificate(uid, courseId.value)
    if (maybeExisting) {
      cert.value = maybeExisting
      return
    }
  }

  if (courseCompleted.value && sub.isSubscribed(courseId.value)) {
    cert.value = issueCertificateIfNeeded(uid, courseId.value, {
      userName: auth.user?.name || '',
      courseTitle: displayCourseTitle.value,
      completionPercent: 100,
      lessonsCompleted: totalLessons.value,
      finalGrade: finalGrade.value,
      locale: i18n.locale
    })
  }
})

async function downloadPdf() {
  if (!eligible.value || !certEl.value) return
  downloading.value = true
  try {
    // Ensure fonts are loaded before rasterizing
    if (document.fonts?.ready) await document.fonts.ready

    const canvas = await html2canvas(certEl.value, {
      scale: Math.min(4, Math.max(2, (window.devicePixelRatio || 1) * 2)),
      useCORS: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })

    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()

    const imgW = canvas.width
    const imgH = canvas.height
    const ratio = Math.min(pageW / imgW, pageH / imgH)
    const w = imgW * ratio
    const h = imgH * ratio
    const x = (pageW - w) / 2
    const y = (pageH - h) / 2

    pdf.addImage(imgData, 'PNG', x, y, w, h, undefined, 'FAST')

    const fileName = `Certificate-${safeFilePart(studentName.value)}-${safeFilePart(displayCourseTitle.value)}.pdf`
    pdf.save(fileName)
  } finally {
    downloading.value = false
  }
}
</script>

<style scoped>
.cert-page {
  background: #fff;
  min-height: 100vh;
}

.cert-hero {
  position: relative;
  background: linear-gradient(to right, #81DFFF, #90EE90);
  padding: 56px 0 92px;
  overflow: hidden;
}

.cert-hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.cert-page-title {
  margin: 0 0 8px;
  font-weight: 900;
  color: var(--primary, #033B62);
  font-size: clamp(1.6rem, 2.6vw, 2.2rem);
  text-align: start;
}

.cert-page-sub {
  margin: 0;
  color: rgba(3, 59, 98, 0.75);
  font-weight: 800;
  text-align: start;
}

.cert-hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.cert-btn {
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
  white-space: nowrap;
}

.cert-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.cert-btn-primary {
  background: var(--primary, #033B62);
  color: #fff;
}

.cert-btn-ghost {
  background: rgba(255, 255, 255, 0.55);
  color: rgba(3, 59, 98, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.85);
}

.cert-wave {
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

.cert-main {
  margin-top: -44px;
  padding-bottom: 56px;
  position: relative;
  z-index: 2;
}

.cert-not-eligible {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 18px;
  text-align: center;
}

.cert-not-title {
  margin: 0 0 8px;
  font-weight: 900;
  color: var(--primary, #033B62);
}

.cert-not-text {
  margin: 0 0 14px;
  color: rgba(3, 59, 98, 0.7);
  font-weight: 800;
}

.cert-sheet-wrap {
  display: grid;
  gap: 14px;
}

.cert-sheet {
  position: relative;
  background: #fff;
  border-radius: 20px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 26px 22px 18px;
  overflow: hidden;
}

.cert-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.9;
}

.cert-decor--left { left: 0; right: auto; width: 40%; }
.cert-decor--right { right: 0; left: auto; width: 40%; }

.cert-sun {
  position: absolute;
  top: 18px;
  left: 18px;
  width: 58px;
  height: 58px;
  border-radius: 999px;
  border: 3px solid rgba(3, 59, 98, 0.35);
  box-shadow: inset 0 0 0 10px rgba(129, 223, 255, 0.25);
}

.cert-star {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(144, 238, 144, 0.25);
  border: 2px solid rgba(144, 238, 144, 0.55);
  transform: rotate(12deg);
}

.cert-spark {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid rgba(0, 191, 255, 0.55);
}

.cert-spark--a { top: 32px; left: 96px; border-color: rgba(255, 215, 0, 0.75); }
.cert-spark--b { top: 92px; left: 26px; border-color: rgba(255, 160, 122, 0.65); }
.cert-spark--c { top: 80px; right: 92px; border-color: rgba(255, 192, 203, 0.75); }
.cert-spark--d { top: 128px; right: 30px; border-color: rgba(0, 191, 255, 0.6); }

.cert-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  padding-top: 12px;
}

.cert-medal {
  width: 58px;
  height: 58px;
  border-radius: 999px;
  background: rgba(255, 215, 0, 0.22);
  border: 2px solid rgba(255, 215, 0, 0.55);
  color: rgba(3, 59, 98, 0.9);
  display: grid;
  place-items: center;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
}

.cert-medal svg {
  width: 26px;
  height: 26px;
}

.cert-title {
  margin: 0;
  font-weight: 1000;
  color: var(--primary, #033B62);
  font-size: clamp(1.4rem, 2.6vw, 2.1rem);
  letter-spacing: 1px;
}

.cert-student {
  margin: 0;
  font-weight: 1000;
  font-size: clamp(1.5rem, 3.1vw, 2.6rem);
  color: var(--primary-medium, #00BFFF);
}

.cert-course {
  margin: 0;
  font-weight: 1000;
  font-size: clamp(1.05rem, 1.8vw, 1.4rem);
  color: rgba(3, 59, 98, 0.95);
}

.cert-line {
  font-weight: 900;
  color: rgba(3, 59, 98, 0.7);
}

.cert-line--small {
  font-size: 0.88rem;
  color: rgba(3, 59, 98, 0.6);
}

.cert-line--muted {
  font-size: 0.85rem;
  color: rgba(3, 59, 98, 0.55);
}

.cert-badges {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.cert-badge {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 2px solid rgba(3, 59, 98, 0.08);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
}

.cert-badge--pink { background: rgba(255, 192, 203, 0.55); }
.cert-badge--gold { background: rgba(255, 215, 0, 0.5); }
.cert-badge--blue { background: rgba(129, 223, 255, 0.55); }

.cert-footer {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  border-top: 1px solid rgba(3, 59, 98, 0.08);
  padding-top: 14px;
}

.cert-foot-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cert-foot-label {
  font-size: 0.75rem;
  font-weight: 1000;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(3, 59, 98, 0.55);
  text-align: start;
}

.cert-foot-value {
  font-size: 1rem;
  font-weight: 1000;
  color: rgba(3, 59, 98, 0.9);
  text-align: start;
}

.cert-foot-line {
  height: 2px;
  background: rgba(3, 59, 98, 0.12);
  border-radius: 999px;
}

.cert-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.cert-stat {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 14px;
  text-align: center;
}

.cert-stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  margin: 0 auto 10px;
  display: grid;
  place-items: center;
  font-weight: 1000;
}

.cert-stat-icon--pink { background: rgba(255, 192, 203, 0.5); color: rgba(3, 59, 98, 0.9); }
.cert-stat-icon--gold { background: rgba(255, 215, 0, 0.45); color: rgba(3, 59, 98, 0.9); }
.cert-stat-icon--blue { background: rgba(129, 223, 255, 0.45); color: rgba(3, 59, 98, 0.9); }

.cert-stat-value {
  font-weight: 1000;
  color: var(--primary, #033B62);
  font-size: 1.35rem;
}

.cert-stat-label {
  font-weight: 900;
  color: rgba(3, 59, 98, 0.65);
  font-size: 0.9rem;
}

.cert-congrats {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(3, 59, 98, 0.08);
  padding: 18px;
  text-align: center;
}

.cert-congrats-title {
  margin: 0 0 8px;
  font-weight: 1000;
  color: var(--primary, #033B62);
}

.cert-congrats-text {
  margin: 0 0 14px;
  color: rgba(3, 59, 98, 0.75);
  font-weight: 800;
  line-height: 1.6;
}

.cert-congrats-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.cert-notfound {
  padding: 80px 0;
}

@media (max-width: 992px) {
  .cert-hero-inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .cert-hero-actions {
    justify-content: flex-start;
  }
  .cert-stats {
    grid-template-columns: 1fr;
  }
  .cert-footer {
    grid-template-columns: 1fr;
  }
}
</style>


