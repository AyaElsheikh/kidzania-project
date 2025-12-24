<template>
  <div class="builder-page">
    <div class="builder-top">
      <div>
        <h2 class="builder-title">Create New Test</h2>
        <div class="builder-subtitle text-muted">Build questions, set rules, then publish.</div>
      </div>

      <div class="builder-actions">
        <button class="btn btn-outline-primary btn-pill" :disabled="isSaving" @click="saveDraft">
          {{ isSaving ? 'Saving…' : (draftSaved ? 'Saved' : 'Save Draft') }}
        </button>
        <button
          class="btn btn-primary btn-pill"
          type="button"
          :disabled="isSaving"
          :class="{ 'opacity-75': !canPublish }"
          @click="publishTest"
        >
          <span class="me-2" aria-hidden="true">⬆</span>
          {{ isSaving ? 'Publishing…' : 'Publish Test' }}
        </button>
      </div>
    </div>

    <div class="builder-grid">
      <!-- Main column -->
      <div class="builder-main">
        <div class="card-soft">
          <div class="meta-row">
            <div class="meta-item">
              <label class="form-label">Test title</label>
              <input v-model.trim="draft.title" class="form-control input-soft" placeholder="e.g. Math Basics Quiz" />
            </div>

            <div class="meta-item">
              <label class="form-label">Course</label>
              <select v-model="draft.courseId" class="form-select input-soft">
                <option value="">Select a course</option>
                <option v-for="c in courses" :key="c.id" :value="c.id">
                  {{ c.title_en || c.title }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="activeQuestion" class="question-card card-soft">
          <div class="q-head">
            <div class="q-badge">?</div>
            <div class="q-title">Question {{ activeIndex + 1 }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label">Question Text</label>
            <input
              v-model.trim="activeQuestion.text"
              class="form-control input-soft"
              placeholder="Enter your question here… e.g., What is 5+3?"
            />
          </div>

          <div class="mb-2">
            <div class="d-flex justify-content-between align-items-end">
              <div>
                <div class="fw-bold">Answers Options</div>
                <div class="text-muted small">Select the right answer</div>
              </div>
              <button
                class="btn btn-sm btn-light btn-pill"
                type="button"
                :disabled="activeQuestion.options.length >= 4"
                @click="addOption"
              >
                + Add Option
              </button>
            </div>
          </div>

          <div class="text-muted small mb-2">
            {{ activeQuestion.options.length }} / 4 options
          </div>

          <div class="options">
            <div v-for="opt in activeQuestion.options" :key="opt.id" class="option-row">
              <label class="radio-wrap">
                <input
                  type="radio"
                  :name="`correct-${activeQuestion.id}`"
                  :checked="activeQuestion.correctOptionId === opt.id"
                  @change="activeQuestion.correctOptionId = opt.id"
                />
                <span class="radio-ui" />
              </label>

              <input v-model.trim="opt.text" class="form-control input-soft option-input" placeholder="Option text" />
              <input v-model.trim="opt.feedback" class="form-control input-soft feedback-input" placeholder="Feedback (optional)" />

              <button
                class="icon-btn"
                type="button"
                title="Delete option"
                :disabled="activeQuestion.options.length <= 4"
                @click="removeOption(opt.id)"
              >
                🗑
              </button>
            </div>
          </div>

          <div class="add-option-area" v-if="activeQuestion.options.length === 0">
            <button class="btn btn-light btn-pill" type="button" @click="addOption">+ Add Option</button>
          </div>
        </div>

        <div v-else class="card-soft empty-main">
          <div class="text-muted">No questions yet. Add your first question.</div>
          <button class="btn btn-primary btn-pill mt-3" @click="addQuestion">+ Add Question</button>
        </div>

        <div class="mt-3">
          <button class="btn btn-outline-secondary btn-pill" @click="addQuestion">+ Add Question</button>
        </div>
      </div>

      <!-- Side column -->
      <div class="builder-side">
        <div class="card-soft">
          <div class="side-title">
            <span class="side-icon" aria-hidden="true">☰</span>
            <span>Questions Lists</span>
          </div>

          <div class="questions-list" @dragover.prevent>
            <div
              v-for="(q, idx) in draft.questions"
              :key="q.id"
              class="q-item"
              :class="{ active: idx === activeIndex }"
              draggable="true"
              @dragstart="onDragStart(idx)"
              @drop="onDrop(idx)"
              @click="activeIndex = idx"
            >
              <span class="drag" aria-hidden="true">⋮⋮</span>
              <span class="q-item-title">Question {{ idx + 1 }}</span>
              <button class="icon-btn" type="button" title="Delete question" @click.stop="removeQuestion(q.id)">
                🗑
              </button>
            </div>
          </div>
        </div>

        <div class="card-soft mt-3">
          <div class="side-title">
            <span class="side-icon" aria-hidden="true">🏆</span>
            <span>Scoring and Rules</span>
          </div>

          <div class="rules-grid">
            <div>
              <label class="form-label">Points</label>
              <input v-model.number="draft.points" type="number" min="1" class="form-control input-soft" />
            </div>
            <div>
              <label class="form-label">Time Limit</label>
              <select v-model.number="draft.timeLimitMins" class="form-select input-soft">
                <option :value="5">5 Mins</option>
                <option :value="10">10 Mins</option>
                <option :value="15">15 Mins</option>
                <option :value="20">20 Mins</option>
              </select>
            </div>
          </div>

          <div class="mt-3">
            <label class="form-label">Difficulty</label>
            <div class="segmented">
              <button class="seg-btn" :class="{ active: draft.difficulty === 'easy' }" @click="draft.difficulty = 'easy'">Easy</button>
              <button class="seg-btn" :class="{ active: draft.difficulty === 'medium' }" @click="draft.difficulty = 'medium'">Medium</button>
              <button class="seg-btn" :class="{ active: draft.difficulty === 'hard' }" @click="draft.difficulty = 'hard'">Hard</button>
            </div>
          </div>

          <div class="mt-3">
            <label class="form-label">Age Group</label>
            <select v-model="draft.ageGroup" class="form-select input-soft">
              <option value="3-5">3-5 Years</option>
              <option value="4-6">4-6 Years</option>
              <option value="5-7">5-7 Years</option>
              <option value="6-8">6-8 Years</option>
              <option value="7-9">7-9 Years</option>
              <option value="8-10">8-10 Years</option>
            </select>
          </div>

          <div class="mt-3">
            <label class="form-label d-flex align-items-center gap-2">
              <input type="checkbox" v-model="draft.allowRetry" class="form-check-input" style="width: 20px; height: 20px; cursor: pointer;" />
              <span>Allow Retry (Students can retake this test)</span>
            </label>
          </div>
        </div>

        <div v-if="draft.status === 'published'" class="card-soft mt-3 published-badge">
          Published ✅
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useExamsStore } from '@/stores/exams.js'
import { useI18nStore } from '@/stores/i18n.js'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const examsStore = useExamsStore()
const coursesStore = useCoursesStore()
const i18n = useI18nStore()
const toast = useToast()

const isSaving = ref(false)
const draftSaved = ref(false)
const lastSavedSig = ref('')
const activeIndex = ref(0)
const dragFrom = ref(null)

const draft = reactive({
  id: null,
  title: '',
  courseId: '',
  status: 'draft',
  points: 10,
  timeLimitMins: 10,
  difficulty: 'easy',
  ageGroup: '4-6',
  allowRetry: true,
  questions: []
})

const draftSig = computed(() => JSON.stringify({
  title: draft.title,
  courseId: draft.courseId,
  points: draft.points,
  timeLimitMins: draft.timeLimitMins,
  difficulty: draft.difficulty,
  ageGroup: draft.ageGroup,
  allowRetry: draft.allowRetry,
  questions: draft.questions
}))

watch(draftSig, (sig) => {
  if (!lastSavedSig.value) return
  if (sig !== lastSavedSig.value) draftSaved.value = false
})

const courses = computed(() => coursesStore.courses)

const activeQuestion = computed(() => draft.questions[activeIndex.value] || null)

const canPublish = computed(() => {
  if (!draft.title || !draft.courseId) return false
  if (!draft.questions.length) return false
  // strict validation: each question has text, exactly 4 options, and a correct answer
  return draft.questions.every((q) => !getQuestionValidationError(q))
})

function uid(prefix) {
  return `${prefix}_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`
}

function msg(ar, en) {
  return i18n.locale === 'ar' ? ar : en
}

function normalizeText(s) {
  return (s ?? '').toString().trim()
}

function getQuestionValidationError(q) {
  if (!q) return msg('السؤال غير صالح.', 'Invalid question.')

  if (!normalizeText(q.text)) {
    return msg('من فضلك اكتب نص السؤال.', 'Please enter the question text.')
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    return msg('يجب أن يكون عدد الاختيارات 4 بالضبط.', 'You must have exactly 4 options.')
  }

  const optionTexts = q.options.map((o) => normalizeText(o?.text))
  if (optionTexts.some((t) => !t)) {
    return msg('من فضلك اكتب نص كل اختيار (4 اختيارات).', 'Please fill in all 4 option texts.')
  }

  const normalized = optionTexts.map((t) => t.toLowerCase())
  if (new Set(normalized).size !== normalized.length) {
    return msg('لا يمكن تكرار نفس الاختيار أكثر من مرة.', 'Duplicate options are not allowed.')
  }

  if (!q.correctOptionId) {
    return msg('يجب اختيار الإجابة الصحيحة قبل حفظ/إضافة السؤال.', 'Please select the correct answer before saving/adding the question.')
  }

  const correctExists = q.options.some((o) => o.id === q.correctOptionId)
  if (!correctExists) {
    return msg('الإجابة الصحيحة المختارة غير موجودة ضمن الاختيارات.', 'Selected correct answer is not one of the options.')
  }

  return null
}

function ensureQuestionIsValidOrToast(q, idxForMessage = null) {
  const err = getQuestionValidationError(q)
  if (!err) return true
  const prefix = idxForMessage != null
    ? msg(`خطأ في السؤال رقم ${idxForMessage + 1}: `, `Question ${idxForMessage + 1} error: `)
    : ''
  toast.error(prefix + err)
  return false
}

function ensureAtLeastOneQuestion() {
  // Intentionally do nothing.
  // We start with zero questions and let the admin click "+ Add Question",
  // so we don't show a "question added" toast just by opening the page.
}

function addQuestion() {
  // If there is an active question, require it to be valid before creating the next one
  if (activeQuestion.value) {
    const ok = ensureQuestionIsValidOrToast(activeQuestion.value, activeIndex.value)
    if (!ok) return
  }

  const q = {
    id: uid('q'),
    text: '',
    options: [
      { id: uid('o'), text: '', feedback: '' },
      { id: uid('o'), text: '', feedback: '' },
      { id: uid('o'), text: '', feedback: '' },
      { id: uid('o'), text: '', feedback: '' }
    ],
    correctOptionId: null
  }
  draft.questions.push(q)
  activeIndex.value = draft.questions.length - 1
  toast.success(msg('تمت إضافة سؤال جديد.', 'New question added.'))
}

function removeQuestion(id) {
  const idx = draft.questions.findIndex(q => q.id === id)
  if (idx === -1) return
  draft.questions.splice(idx, 1)
  activeIndex.value = Math.max(0, Math.min(activeIndex.value, draft.questions.length - 1))
  toast.info(msg('تم حذف السؤال.', 'Question removed.'))
}

function addOption() {
  if (!activeQuestion.value) return
  if (activeQuestion.value.options.length >= 4) {
    toast.warning(msg('لا يمكن إضافة أكثر من 4 اختيارات.', 'You cannot add more than 4 options.'))
    return
  }
  activeQuestion.value.options.push({ id: uid('o'), text: '', feedback: '' })
  toast.info(msg('تمت إضافة اختيار.', 'Option added.'))
}

function removeOption(id) {
  if (!activeQuestion.value) return
  const q = activeQuestion.value
  if (Array.isArray(q.options) && q.options.length <= 4) {
    toast.warning(msg('يجب أن يكون للسؤال 4 اختيارات. لا يمكن الحذف الآن.', 'A question must have 4 options. You cannot delete an option now.'))
    return
  }
  q.options = q.options.filter(o => o.id !== id)
  if (q.correctOptionId === id) q.correctOptionId = null
  toast.info(msg('تم حذف الاختيار.', 'Option removed.'))
}

function onDragStart(idx) {
  dragFrom.value = idx
}

function onDrop(idx) {
  if (dragFrom.value == null) return
  const from = dragFrom.value
  const to = idx
  dragFrom.value = null
  if (from === to) return
  const item = draft.questions.splice(from, 1)[0]
  draft.questions.splice(to, 0, item)
  activeIndex.value = to
}

async function loadIfEditing() {
  await Promise.all([coursesStore.load(), examsStore.load()])
  const id = route.params.id
  if (!id) {
    return
  }

  const found = examsStore.exams.find(e => String(e.id) === String(id))
  if (!found) return

  draft.id = found.id
  draft.title = found.title || ''
  draft.courseId = found.courseId || ''
  draft.status = found.status || 'draft'
  draft.points = Number(found.points ?? 10)
  draft.timeLimitMins = Number(found.timeLimitMins ?? 10)
  draft.difficulty = found.difficulty || 'easy'
  draft.ageGroup = found.ageGroup || '4-6'
  draft.allowRetry = found.allowRetry !== undefined ? Boolean(found.allowRetry) : true
  draft.questions = Array.isArray(found.questions) ? JSON.parse(JSON.stringify(found.questions)) : []
}

let autosaveTimer = null
function scheduleAutosave() {
  if (!draft.id) return
  if (draft.status !== 'draft') return
  clearTimeout(autosaveTimer)
  autosaveTimer = setTimeout(() => {
    // fire and forget
    saveDraft(true).catch(() => {})
  }, 700)
}

async function saveDraft(isAuto = false) {
  if (isSaving.value) return
  isSaving.value = true
  try {
    const payload = {
      title: draft.title || 'Untitled test',
      courseId: draft.courseId || '',
      status: 'draft',
      points: draft.points,
      timeLimitMins: draft.timeLimitMins,
      difficulty: draft.difficulty,
      ageGroup: draft.ageGroup,
      allowRetry: draft.allowRetry,
      questions: draft.questions
    }

    if (!draft.id) {
      const created = await examsStore.createDraft(payload)
      draft.id = created?.id
      if (draft.id) {
        router.replace({ name: 'admin-exams-edit', params: { id: draft.id } })
      }
    } else {
      await examsStore.save(draft.id, payload)
    }
    lastSavedSig.value = draftSig.value
    draftSaved.value = true
    if (!isAuto) {
      toast.success(msg('تم حفظ المسودة بنجاح.', 'Draft saved successfully.'))
    }
  } catch (e) {
    if (!isAuto) {
      toast.error((e?.message || '').toString() || msg('فشل حفظ المسودة.', 'Failed to save draft.'))
    }
  } finally {
    isSaving.value = false
  }
}

async function publishTest() {
  if (isSaving.value) return

  // Validate before publishing (show the first error and jump to it)
  if (!draft.title || !draft.courseId) {
    toast.error(msg('من فضلك اكتب عنوان الامتحان واختر الكورس.', 'Please enter the test title and select a course.'))
    return
  }
  if (!draft.questions.length) {
    toast.error(msg('أضف سؤالًا واحدًا على الأقل.', 'Add at least one question.'))
    return
  }
  for (let i = 0; i < draft.questions.length; i++) {
    const ok = ensureQuestionIsValidOrToast(draft.questions[i], i)
    if (!ok) {
      activeIndex.value = i
      return
    }
  }

  isSaving.value = true
  try {
    // For new exam: create draft directly (don't rely on saveDraft which might be blocked by isSaving)
    if (!draft.id) {
      const payload = {
        title: draft.title || 'Untitled test',
        courseId: draft.courseId || '',
        status: 'draft',
        points: draft.points,
        timeLimitMins: draft.timeLimitMins,
        difficulty: draft.difficulty,
        ageGroup: draft.ageGroup,
        allowRetry: draft.allowRetry,
        questions: draft.questions
      }
      const created = await examsStore.createDraft(payload)
      if (!created?.id) {
        throw new Error(msg('فشل إنشاء المسودة.', 'Failed to create draft.'))
      }
      draft.id = created.id
      // Update URL if needed
      if (route.params.id !== String(draft.id)) {
        router.replace({ name: 'admin-exams-edit', params: { id: draft.id } })
      }
    }

    // Save latest data before publishing
    await examsStore.save(draft.id, {
      title: draft.title,
      courseId: draft.courseId,
      points: draft.points,
      timeLimitMins: draft.timeLimitMins,
      difficulty: draft.difficulty,
      ageGroup: draft.ageGroup,
      allowRetry: draft.allowRetry,
      questions: draft.questions
    })

    // Publish
    await examsStore.publish(draft.id)
    draft.status = 'published'
    toast.success(msg('تم نشر الامتحان بنجاح.', 'Test published successfully.'))
    router.push({ name: 'admin-exams' })
  } catch (e) {
    const errorMsg = e?.message || msg('فشل نشر الامتحان.', 'Failed to publish test.')
    toast.error(errorMsg)
    console.error('Publish error:', e)
  } finally {
    isSaving.value = false
  }
}

watch(
  () => ({
    title: draft.title,
    courseId: draft.courseId,
    points: draft.points,
    timeLimitMins: draft.timeLimitMins,
    difficulty: draft.difficulty,
    ageGroup: draft.ageGroup,
    allowRetry: draft.allowRetry,
    questions: draft.questions
  }),
  () => scheduleAutosave(),
  { deep: true }
)

onMounted(loadIfEditing)
</script>

<style scoped>
.builder-page {
  font-family: 'Fredoka', sans-serif;
}

.builder-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.builder-title {
  margin: 0;
  font-weight: 800;
  color: #00335a;
}

.builder-subtitle {
  margin-top: 6px;
}

.builder-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-pill {
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 700;
}

.builder-grid {
  display: grid;
  grid-template-columns: 1.6fr 0.9fr;
  gap: 18px;
  align-items: start;
}

.card-soft {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
  padding: 18px;
}

.input-soft {
  border-radius: 14px;
  border: 1px solid #e9eef5;
  background: #fbfcff;
  padding: 12px 14px;
}

.meta-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.question-card {
  margin-top: 14px;
}

.q-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.q-badge {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #e6f7ff;
  color: #00aaff;
  font-weight: 900;
}
.q-title {
  font-weight: 900;
  color: #00335a;
}

.options {
  display: grid;
  gap: 10px;
}

.option-row {
  display: grid;
  grid-template-columns: 44px 1fr 0.9fr 44px;
  gap: 10px;
  align-items: center;
  padding: 12px;
  border-radius: 14px;
  background: #f6f8fc;
  border: 1px solid rgba(0,0,0,0.05);
}

.radio-wrap {
  display: grid;
  place-items: center;
}
.radio-wrap input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.radio-ui {
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 2px solid #cbd5e1;
  background: #fff;
  display: inline-block;
  position: relative;
}
.radio-wrap input:checked + .radio-ui {
  border-color: #00aaff;
}
.radio-wrap input:checked + .radio-ui::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #00aaff;
  position: absolute;
  inset: 0;
  margin: auto;
}

.icon-btn {
  border: none;
  background: transparent;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #64748b;
}
.icon-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.icon-btn:disabled:hover {
  background: transparent;
  color: #64748b;
}
.icon-btn:hover {
  background: #eef2f7;
  color: #dc3545;
}

.side-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  color: #00335a;
  margin-bottom: 12px;
}
.side-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #e6f7ff;
  color: #00aaff;
}

.questions-list {
  display: grid;
  gap: 10px;
}

.q-item {
  display: grid;
  grid-template-columns: 28px 1fr 44px;
  align-items: center;
  gap: 10px;
  padding: 12px 12px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.06);
  background: #fff;
  cursor: pointer;
}
.q-item.active {
  border-color: rgba(0,170,255,0.6);
  box-shadow: 0 0 0 3px rgba(0,170,255,0.12);
}
.drag {
  color: #94a3b8;
  text-align: center;
}
.q-item-title {
  font-weight: 700;
  color: #0f172a;
}

.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.segmented {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 8px;
  background: #f6f8fc;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 14px;
}
.seg-btn {
  border: none;
  background: transparent;
  padding: 10px 8px;
  border-radius: 12px;
  font-weight: 800;
  color: #64748b;
}
.seg-btn.active {
  background: #fff;
  color: #16a34a;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.published-badge {
  font-weight: 900;
  color: #16a34a;
  text-align: center;
}

.empty-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

@media (max-width: 1100px) {
  .builder-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .builder-top {
    flex-direction: column;
    align-items: stretch;
  }
  .builder-actions {
    justify-content: flex-end;
  }
  .meta-row {
    grid-template-columns: 1fr;
  }
  .option-row {
    grid-template-columns: 44px 1fr 44px;
  }
  .feedback-input {
    grid-column: 2 / 3;
  }
}
</style>


