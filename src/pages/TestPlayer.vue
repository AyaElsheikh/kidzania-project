<template>
  <div class="tp-page">
    <header class="tp-hero">
      <div class="container tp-hero-inner">
        <button class="btn btn-light btn-pill" @click="goBack">← Back</button>
        <div class="tp-hero-meta">
          <h1 class="tp-title">{{ exam?.title || 'Test' }}</h1>
          <div class="tp-sub">
            <span class="pill">{{ courseTitle }}</span>
            <span class="pill" v-if="exam">{{ exam.points }} pts</span>
            <span class="pill" v-if="exam">{{ exam.timeLimitMins }} mins</span>
          </div>
        </div>
        <div class="tp-timer" v-if="exam">
          <div class="timer-label">Time</div>
          <div class="timer-value" :class="{ danger: remainingSecs <= 30 }">{{ timerText }}</div>
        </div>
      </div>
    </header>

    <div class="container tp-body">
      <div v-if="isLoading" class="card-soft">Loading…</div>
      <div v-else-if="!exam" class="card-soft">
        <div class="fw-bold">Test not found</div>
        <div class="text-muted mt-1">It may be unpublished or deleted.</div>
        <button class="btn btn-primary btn-pill mt-3" @click="goBack">Back to Tests</button>
      </div>

      <div v-else-if="isFinished" class="tp-finish-wrap">
        <div class="card-soft tp-finish">
          <div class="finish-top">
            <div class="finish-stars" aria-hidden="true">
              <span class="star" :class="{ on: stars >= 1 }">★</span>
              <span class="star" :class="{ on: stars >= 2 }">★</span>
              <span class="star" :class="{ on: stars >= 3 }">★</span>
            </div>
            <div class="finish-badge">Completed</div>
          </div>

          <h2 class="finish-title">{{ titleText }}</h2>
          <div class="finish-sub text-muted">{{ subtitleText }}</div>

          <div class="finish-metrics">
            <div class="metric">
              <div class="metric-label">Accuracy</div>
              <div class="metric-value">{{ percent }}%</div>
            </div>
            <div class="metric">
              <div class="metric-label">Questions</div>
              <div class="metric-value">{{ questions.length }}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Time</div>
              <div class="metric-value">{{ timerText }}</div>
            </div>
          </div>

          <div class="finish-save">
            <div v-if="savingResult" class="text-muted">Saving your result…</div>
            <div v-else-if="saveError" class="text-danger">{{ saveError }}</div>
            <div v-else class="text-muted">Result saved ✔</div>
          </div>

          <div class="finish-actions">
            <button class="btn btn-outline-primary btn-pill" @click="restart">Try Again</button>
            <button class="btn btn-primary btn-pill" @click="goBack">Back to Tests</button>
          </div>
        </div>

        <div class="card-soft tp-review">
          <div class="review-head">
            <div class="review-title">Review</div>
            <div class="review-note text-muted">Tap a question to see the correct answer.</div>
          </div>

          <div class="review-list">
            <button
              v-for="(q, idx) in questions"
              :key="q.id"
              class="review-item"
              @click="qIndex = idx; isFinished = false"
            >
              <span class="review-num">{{ idx + 1 }}</span>
              <span class="review-text">{{ q.text }}</span>
              <span class="review-status" :class="{ ok: answers[q.id] === q.correctOptionId, bad: answers[q.id] && answers[q.id] !== q.correctOptionId }">
                {{ answers[q.id] === q.correctOptionId ? 'Correct' : 'Wrong' }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="tp-grid">
        <div class="card-soft tp-card">
          <div class="tp-progress">
            <div class="tp-progress-text">
              Question <strong>{{ qIndex + 1 }}</strong> / {{ questions.length }}
            </div>
            <div class="tp-bar">
              <div class="tp-bar-fill" :style="{ width: `${progressPct}%` }"></div>
            </div>
          </div>

          <div class="tp-q">
            {{ currentQ.text }}
          </div>

          <div class="tp-options">
            <button
              v-for="opt in currentQ.options"
              :key="opt.id"
              class="tp-opt"
              :class="optClass(opt.id)"
              :disabled="answered"
              @click="choose(opt.id)"
            >
              <span class="opt-dot" aria-hidden="true"></span>
              <span class="opt-text">{{ opt.text }}</span>
            </button>
          </div>

          <div v-if="feedback" class="tp-feedback" :class="{ ok: lastWasCorrect, bad: !lastWasCorrect }">
            {{ feedback }}
          </div>

          <div class="tp-actions">
            <button class="btn btn-light btn-pill" :disabled="qIndex === 0" @click="prev">Previous</button>
            <button class="btn btn-primary btn-pill" :disabled="!answered" @click="next">
              {{ qIndex === questions.length - 1 ? 'Finish' : 'Next' }}
            </button>
          </div>
        </div>

        <div class="card-soft tp-side">
          <div class="side-title">Questions</div>
          <div class="side-list">
            <button
              v-for="(q, idx) in questions"
              :key="q.id"
              class="side-item"
              :class="{ active: idx === qIndex, done: answers[q.id] }"
              @click="jump(idx)"
            >
              <span class="num">{{ idx + 1 }}</span>
              <span class="label">Question {{ idx + 1 }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useExamsStore } from '@/stores/exams.js'
import { useAuthStore } from '@/stores/auth.js'
import { useI18nStore } from '@/stores/i18n.js'
import { useResultsStore } from '@/stores/results.js'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const examsStore = useExamsStore()
const authStore = useAuthStore()
const i18n = useI18nStore()
const resultsStore = useResultsStore()

const isLoading = ref(true)
const isFinished = ref(false)
const qIndex = ref(0)
const answers = ref({}) // { [questionId]: optionId }
const feedback = ref('')
const lastWasCorrect = ref(false)
const remainingSecs = ref(0)
const startedAt = ref(null)
const savingResult = ref(false)
const savedResultId = ref(null)
const saveError = ref('')

let timer = null

const exam = computed(() => {
  const id = route.params.id
  return (examsStore.published || []).find(e => String(e.id) === String(id)) || null
})

const questions = computed(() => exam.value?.questions || [])
const currentQ = computed(() => questions.value[qIndex.value])

const courseTitle = computed(() => {
  const c = coursesStore.courses.find(c0 => c0.id === exam.value?.courseId)
  return c ? (c.title_en || c.title) : '—'
})

const maxScore = computed(() => {
  const pts = Number(exam.value?.points ?? 0)
  return pts * questions.value.length
})

const score = computed(() => {
  const pts = Number(exam.value?.points ?? 0)
  return questions.value.reduce((acc, q) => {
    const picked = answers.value[q.id]
    if (!picked) return acc
    return acc + (picked === q.correctOptionId ? pts : 0)
  }, 0)
})

const percent = computed(() => {
  if (!maxScore.value) return 0
  return Math.round((score.value / maxScore.value) * 100)
})

const stars = computed(() => {
  const p = percent.value
  if (p >= 90) return 3
  if (p >= 60) return 2
  return 1
})

const titleText = computed(() => {
  const isAr = i18n.locale === 'ar'
  const p = percent.value
  if (p >= 90) return isAr ? 'ممتاز جدًا!' : 'Excellent!'
  if (p >= 60) return isAr ? 'شغل رائع!' : 'Great job!'
  return isAr ? 'ممتاز… كمل تدريب!' : 'Nice try—keep practicing!'
})

const subtitleText = computed(() => {
  const isAr = i18n.locale === 'ar'
  return isAr
    ? `درجتك ${score.value} من ${maxScore.value} (${percent.value}%)`
    : `You scored ${score.value} out of ${maxScore.value} (${percent.value}%)`
})

const answered = computed(() => Boolean(answers.value[currentQ.value?.id]))

const progressPct = computed(() => {
  if (!questions.value.length) return 0
  return Math.round(((qIndex.value + 1) / questions.value.length) * 100)
})

const timerText = computed(() => {
  // While taking the test: show remaining; after finish: show time spent
  const totalLimit = Math.max(0, Math.floor(Number(exam.value?.timeLimitMins ?? 0) * 60))
  const remaining = Math.max(0, remainingSecs.value)
  const spent = totalLimit ? Math.max(0, totalLimit - remaining) : 0
  const s = isFinished.value ? spent : remaining
  const mm = String(Math.floor(s / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${mm}:${ss}`
})

function goBack() {
  router.push('/tests')
}

function optClass(optId) {
  if (!answered.value) return ''
  const q = currentQ.value
  const picked = answers.value[q.id]
  if (optId === q.correctOptionId) return 'correct'
  if (optId === picked && picked !== q.correctOptionId) return 'wrong'
  return 'dim'
}

function choose(optId) {
  const q = currentQ.value
  answers.value = { ...answers.value, [q.id]: optId }

  const opt = q.options.find(o => o.id === optId)
  const isCorrect = optId === q.correctOptionId
  lastWasCorrect.value = isCorrect
  feedback.value = opt?.feedback || (isCorrect ? 'Great job!' : 'Try again!')
}

function next() {
  feedback.value = ''
  if (qIndex.value >= questions.value.length - 1) {
    finish()
    return
  }
  qIndex.value++
}

function prev() {
  feedback.value = ''
  qIndex.value = Math.max(0, qIndex.value - 1)
}

function jump(idx) {
  feedback.value = ''
  qIndex.value = idx
}

function finish() {
  isFinished.value = true
  stopTimer()
  void saveResultOnce()
}

function restart() {
  isFinished.value = false
  qIndex.value = 0
  answers.value = {}
  feedback.value = ''
  savedResultId.value = null
  saveError.value = ''
  savingResult.value = false
  startTimer()
}

function startTimer() {
  stopTimer()
  const mins = Number(exam.value?.timeLimitMins ?? 0)
  remainingSecs.value = Math.max(0, Math.floor(mins * 60))
  startedAt.value = Date.now()
  if (!remainingSecs.value) return
  timer = setInterval(() => {
    remainingSecs.value -= 1
    if (remainingSecs.value <= 0) {
      remainingSecs.value = 0
      finish()
    }
  }, 1000)
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}

onMounted(async () => {
  isLoading.value = true
  authStore.load?.()
  i18n.load?.()
  await Promise.all([coursesStore.load(), examsStore.load()])
  isLoading.value = false

  // If exam exists, start timer; otherwise show not found.
  if (exam.value) startTimer()
})

onUnmounted(() => stopTimer())

async function saveResultOnce() {
  if (!exam.value) return
  if (savedResultId.value) return
  if (savingResult.value) return

  savingResult.value = true
  saveError.value = ''
  try {
    const finishedAt = Date.now()
    const durationSecs = startedAt.value ? Math.max(0, Math.round((finishedAt - startedAt.value) / 1000)) : 0

    const payload = {
      examId: exam.value.id,
      examTitle: exam.value.title,
      courseId: exam.value.courseId,
      userId: authStore?.user?.id || null,
      userName: authStore?.user?.name || null,
      score: score.value,
      maxScore: maxScore.value,
      percent: percent.value,
      stars: stars.value,
      pointsPerQuestion: Number(exam.value.points ?? 0),
      questionCount: questions.value.length,
      timeLimitMins: Number(exam.value.timeLimitMins ?? 0),
      timeSpentSecs: durationSecs,
      startedAt: startedAt.value ? new Date(startedAt.value).toISOString() : null,
      finishedAt: new Date(finishedAt).toISOString(),
      answers: questions.value.map((q) => ({
        questionId: q.id,
        text: q.text,
        selectedOptionId: answers.value[q.id] || null,
        correctOptionId: q.correctOptionId,
        correct: (answers.value[q.id] || null) === q.correctOptionId
      }))
    }

    const created = await resultsStore.create(payload)
    savedResultId.value = created?.id ?? 'saved'
  } catch (e) {
    saveError.value = e?.message || 'Failed to save result'
  } finally {
    savingResult.value = false
  }
}
</script>

<style scoped>
.tp-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Fredoka', sans-serif;
}

.tp-hero {
  background: linear-gradient(135deg, #00bfff, #3b82f6);
  color: #fff;
  padding: 26px 0;
}

.tp-hero-inner {
  display: grid;
  grid-template-columns: 170px 1fr 140px;
  gap: 14px;
  align-items: center;
}

.tp-title {
  margin: 0;
  font-weight: 900;
  letter-spacing: 0.3px;
}

.tp-sub {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.pill {
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.22);
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
}

.tp-timer {
  text-align: right;
}
.timer-label {
  opacity: 0.85;
  font-weight: 700;
  font-size: 0.9rem;
}
.timer-value {
  font-weight: 900;
  font-size: 1.15rem;
}
.timer-value.danger {
  color: #fff7ed;
}

.tp-body {
  padding-top: 18px;
  padding-bottom: 40px;
}

.card-soft {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
  padding: 18px;
}

.tp-grid {
  display: grid;
  grid-template-columns: 1.6fr 0.8fr;
  gap: 16px;
  align-items: start;
}

.tp-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.tp-bar {
  flex: 1 1 auto;
  height: 10px;
  border-radius: 999px;
  background: #eef2f7;
  overflow: hidden;
}
.tp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #00bfff);
  border-radius: 999px;
}

.tp-q {
  font-weight: 900;
  font-size: 1.25rem;
  color: #00335a;
  margin: 8px 0 14px;
}

.tp-options {
  display: grid;
  gap: 10px;
}

.tp-opt {
  border: 1px solid rgba(0,0,0,0.08);
  background: #fff;
  border-radius: 16px;
  padding: 14px 14px;
  text-align: left;
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 10px;
  align-items: center;
  font-weight: 700;
  transition: transform 0.12s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.tp-opt:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  border-color: rgba(0,191,255,0.5);
}

.opt-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #e2e8f0;
}

.tp-opt.correct {
  border-color: rgba(34,197,94,0.6);
  background: rgba(34,197,94,0.06);
}
.tp-opt.correct .opt-dot {
  background: #22c55e;
}
.tp-opt.wrong {
  border-color: rgba(239,68,68,0.55);
  background: rgba(239,68,68,0.06);
}
.tp-opt.wrong .opt-dot {
  background: #ef4444;
}
.tp-opt.dim {
  opacity: 0.7;
}

.tp-feedback {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 16px;
  font-weight: 800;
  border: 1px solid rgba(0,0,0,0.06);
}
.tp-feedback.ok {
  background: rgba(34,197,94,0.08);
  border-color: rgba(34,197,94,0.25);
  color: #166534;
}
.tp-feedback.bad {
  background: rgba(239,68,68,0.08);
  border-color: rgba(239,68,68,0.25);
  color: #991b1b;
}

.tp-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 16px;
}

.btn-pill {
  border-radius: 999px;
  padding: 10px 16px;
  font-weight: 800;
}

.tp-side .side-title {
  font-weight: 900;
  color: #00335a;
  margin-bottom: 10px;
}
.side-list {
  display: grid;
  gap: 8px;
}
.side-item {
  border: 1px solid rgba(0,0,0,0.06);
  background: #fff;
  border-radius: 14px;
  padding: 12px;
  text-align: left;
  display: grid;
  grid-template-columns: 26px 1fr;
  gap: 10px;
  align-items: center;
}
.side-item.active {
  border-color: rgba(0,191,255,0.65);
  box-shadow: 0 0 0 3px rgba(0,191,255,0.12);
}
.side-item.done .num {
  background: #dcfce7;
  color: #16a34a;
}
.num {
  width: 26px;
  height: 26px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #eef2f7;
  font-weight: 900;
  color: #334155;
}

.tp-finish {
  text-align: center;
}
.tp-finish-wrap {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
.finish-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}
.finish-stars {
  display: flex;
  gap: 6px;
  font-size: 22px;
  line-height: 1;
}
.star {
  color: rgba(255,255,255,0.5);
  text-shadow: 0 6px 16px rgba(0,0,0,0.12);
}
.star.on {
  color: #fbbf24;
}
.finish-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 14px;
}
.metric {
  background: linear-gradient(180deg, #fbfcff, #f6f8fc);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
}
.metric-label {
  font-weight: 800;
  color: #64748b;
  font-size: 0.9rem;
}
.metric-value {
  font-weight: 900;
  color: #00335a;
  font-size: 1.1rem;
  margin-top: 4px;
}
.finish-save {
  margin-top: 12px;
}

.tp-review .review-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.tp-review .review-title {
  font-weight: 900;
  color: #00335a;
}
.review-list {
  display: grid;
  gap: 10px;
}
.review-item {
  border: 1px solid rgba(0,0,0,0.06);
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  text-align: left;
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 10px;
  align-items: center;
}
.review-item:hover {
  box-shadow: 0 12px 24px rgba(0,0,0,0.06);
}
.review-num {
  width: 28px;
  height: 28px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #eef2f7;
  font-weight: 900;
  color: #334155;
}
.review-text {
  font-weight: 800;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.review-status {
  font-weight: 900;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.06);
  background: #f1f5f9;
  color: #475569;
}
.review-status.ok {
  background: #dcfce7;
  color: #16a34a;
}
.review-status.bad {
  background: #fee2e2;
  color: #dc2626;
}
.finish-badge {
  display: inline-block;
  background: #dcfce7;
  color: #16a34a;
  font-weight: 900;
  padding: 8px 12px;
  border-radius: 999px;
}
.finish-title {
  margin: 14px 0 6px;
  font-weight: 900;
  color: #00335a;
}
.finish-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
  flex-wrap: wrap;
}

@media (max-width: 992px) {
  .tp-hero-inner {
    grid-template-columns: 1fr;
    text-align: left;
  }
  .tp-timer {
    text-align: left;
  }
  .tp-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .finish-metrics {
    grid-template-columns: 1fr;
  }
  .review-item {
    grid-template-columns: 28px 1fr;
  }
  .review-status {
    grid-column: 1 / -1;
    justify-self: start;
  }
}
</style>


