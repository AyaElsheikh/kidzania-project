<template>
  <div class="cb-page">
    <div class="cb-top">
      <div>
        <h2 class="cb-title">{{ editingId ? 'Edit Course' : 'Create New Course' }}</h2>
        <div class="cb-sub text-muted">{{ msg('أنشئ كورس جديد وأضف الدروس ثم انشره.', 'Create a new course, add lessons, then publish.') }}</div>
      </div>

      <div class="cb-actions">
        <button class="btn btn-outline-primary cb-pill" :disabled="isSaving" type="button" @click="saveDraft">
          {{ isSaving ? msg('جاري الحفظ…', 'Saving…') : (draftSaved ? msg('تم الحفظ', 'Saved') : msg('Save Draft', 'Save Draft')) }}
        </button>
        <button class="btn btn-primary cb-pill" :disabled="isSaving" type="button" @click="publishCourse">
          <span class="me-2" aria-hidden="true">⬆</span>
          {{ isSaving ? msg('جاري النشر…', 'Publishing…') : msg('Publish Course', 'Publish Course') }}
        </button>
      </div>
    </div>

    <div class="cb-grid">
      <!-- MAIN -->
      <div class="cb-main">
        <!-- Basic Information -->
        <section class="card-soft cb-card">
          <div class="cb-card-head">
            <div class="cb-head-icon" aria-hidden="true">≡</div>
            <div class="cb-head-title">{{ msg('Basic Information', 'Basic Information') }}</div>
          </div>

          <div class="cb-field">
            <label class="cb-label">{{ msg('Course Title', 'Course Title') }}</label>
            <input v-model.trim="draft.title_en" class="form-control cb-input" :placeholder="msg('e.g., Introduction to space science', 'e.g., Introduction to space science')" />
          </div>

          <div class="cb-field">
            <label class="cb-label cb-label-ar">{{ msg('عنوان الكورس', 'Course title (Arabic)') }}</label>
            <input v-model.trim="draft.title_ar" dir="rtl" class="form-control cb-input" :placeholder="msg('مثال: مقدمة عن علوم الفضاء', 'e.g., مقدمة عن علوم الفضاء')" />
          </div>

          <div class="cb-field">
            <label class="cb-label">{{ msg('Detailed Description', 'Detailed Description') }}</label>
            <textarea v-model.trim="draft.description_en" class="form-control cb-textarea" rows="4" :placeholder="msg('Describe what the student will learn in this course', 'Describe what the student will learn in this course')" />
          </div>

          <div class="cb-field">
            <label class="cb-label cb-label-ar">{{ msg('الوصف', 'Description (Arabic)') }}</label>
            <textarea v-model.trim="draft.description_ar" dir="rtl" class="form-control cb-textarea" rows="4" :placeholder="msg('اوصف ماذا سيدرس الطلاب في هذا الكورس', 'اوصف ماذا سيدرس الطلاب في هذا الكورس')" />
          </div>
        </section>

        <!-- Curriculum -->
        <section class="card-soft cb-card mt-3">
          <div class="cb-card-head cb-card-head-row">
            <div class="cb-head-left">
              <div class="cb-head-icon" aria-hidden="true">≡</div>
              <div class="cb-head-title">{{ msg('Curriculum', 'Curriculum') }}</div>
            </div>
            <button class="cb-link-btn" type="button" @click="addChapter">
              <span class="cb-plus" aria-hidden="true">+</span>
              {{ msg('Add Chapter', 'Add Chapter') }}
            </button>
          </div>

          <div v-if="!draft.curriculum.length" class="cb-empty">
            <div class="text-muted">{{ msg('لا يوجد فصول بعد. أضف أول فصل.', 'No chapters yet. Add your first chapter.') }}</div>
            <button class="btn btn-light cb-pill mt-2" type="button" @click="addChapter">{{ msg('Add Chapter', 'Add Chapter') }}</button>
          </div>

          <div class="cb-curr">
            <article v-for="(ch, chIdx) in draft.curriculum" :key="ch.id" class="cb-chapter">
              <div class="cb-ch-head">
                <span class="cb-dots" aria-hidden="true">⋮⋮</span>
                <div class="cb-ch-title-wrap">
                  <input v-model.trim="ch.title" class="form-control cb-input cb-input--sm" :placeholder="`${msg('Chapter', 'Chapter')} ${chIdx + 1}: ${msg('Title', 'Title')}`" />
                  <div class="cb-ch-sub text-muted">
                    {{ (ch.lessons?.length || 0) }} {{ msg('Lessons', 'Lessons') }}
                    <span class="mx-1">•</span>
                    {{ chapterMins(ch) }} {{ msg('Mins', 'Mins') }}
                  </div>
                </div>
                <button class="cb-icon-btn" type="button" :title="msg('حذف الفصل', 'Delete chapter')" @click="removeChapter(ch.id)">
                  🗑
                </button>
              </div>

              <div class="cb-lessons">
                <div v-for="(ls, lsIdx) in ch.lessons" :key="ls.id" class="cb-lesson">
                  <span class="cb-dots cb-dots--sm" aria-hidden="true">⋮⋮</span>
                  <div class="cb-play" aria-hidden="true">▶</div>
                  <div class="cb-lesson-fields">
                    <div class="cb-lesson-row">
                      <input v-model.trim="ls.title_en" class="form-control cb-input cb-input--sm" :placeholder="msg('Lesson title (EN)', 'Lesson title (EN)')" />
                      <input v-model.number="ls.durationMins" type="number" min="1" class="form-control cb-input cb-input--xs" :placeholder="msg('Mins', 'Mins')" />
                    </div>
                    <div class="cb-lesson-row">
                      <input v-model.trim="ls.title_ar" dir="rtl" class="form-control cb-input cb-input--sm" :placeholder="msg('عنوان الدرس (AR)', 'Lesson title (AR)')" />
                      <span class="cb-mini-muted text-muted">{{ msg('Video', 'Video') }}</span>
                    </div>
                    <input v-model.trim="ls.videoUrl" class="form-control cb-input cb-input--sm" :placeholder="msg('Video URL (mp4 / link)', 'Video URL (mp4 / link)')" />
                  </div>
                  <button class="cb-icon-btn" type="button" :title="msg('حذف الدرس', 'Delete lesson')" @click="removeLesson(ch.id, ls.id)">
                    🗑
                  </button>
                </div>

                <button class="cb-add-lesson" type="button" @click="addLesson(ch.id)">
                  <span class="cb-plus" aria-hidden="true">+</span>
                  {{ msg('Add Lesson', 'Add Lesson') }}
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>

      <!-- SIDE -->
      <aside class="cb-side">
        <!-- Thumbnail -->
        <section class="card-soft cb-card">
          <div class="cb-card-head">
            <div class="cb-head-icon" aria-hidden="true">🖼</div>
            <div class="cb-head-title">{{ msg('Course Thumbnail', 'Course Thumbnail') }}</div>
          </div>

          <input ref="fileInput" type="file" class="d-none" accept="image/*" @change="onFileChange" />

          <div
            class="cb-drop"
            role="button"
            tabindex="0"
            @click="openFilePicker"
            @keydown.enter.prevent="openFilePicker"
            @keydown.space.prevent="openFilePicker"
            @dragover.prevent
            @drop.prevent="onDropFile"
          >
            <template v-if="draft.thumbnail">
              <img class="cb-drop-img" :src="draft.thumbnail" alt="thumbnail" @error="draft.thumbnail = '/assets/images/topcourses1.png'" />
            </template>
            <template v-else>
              <div class="cb-drop-empty">
                <div class="cb-drop-ic" aria-hidden="true">⧉</div>
                <div class="cb-drop-text">
                  {{ msg('Drop your image here, or select Click to browse', 'Drop your image here, or select Click to browse') }}
                </div>
              </div>
            </template>
          </div>

          <div class="cb-hint text-muted">
            {{ msg('يمكنك رفع صورة واحدة على الأقل. اهتم بجودة الصورة.', 'You can upload at least 1 image. Pay attention to picture quality.') }}
          </div>

          <div class="cb-thumb-url">
            <input v-model.trim="draft.thumbnail" class="form-control cb-input cb-input--sm" :placeholder="msg('أو ضع رابط الصورة', 'Or enter image URL')" />
          </div>
        </section>

        <!-- Settings -->
        <section class="card-soft cb-card mt-3">
          <div class="cb-card-head">
            <div class="cb-head-icon" aria-hidden="true">≡</div>
            <div class="cb-head-title">{{ msg('Settings', 'Settings') }}</div>
          </div>

          <div class="cb-side-field">
            <label class="cb-side-label">{{ msg('Age Group', 'Age Group') }}</label>
            <select v-model="draft.age" class="form-select cb-input">
              <option value="3-5">3-5 Years</option>
              <option value="4-6">4-6 Years</option>
              <option value="5-7">5-7 Years</option>
              <option value="6-8">6-8 Years</option>
              <option value="7-9">7-9 Years</option>
              <option value="8-10">8-10 Years</option>
            </select>
          </div>

          <div class="cb-side-field">
            <label class="cb-side-label">{{ msg('Subject', 'Subject') }}</label>
            <select v-model="draft.category" class="form-select cb-input">
              <option value="Math">Math</option>
              <option value="Science">Science</option>
              <option value="Arabic">Arabic</option>
              <option value="English">English</option>
            </select>
          </div>

          <div class="cb-side-field">
            <label class="cb-side-label">{{ msg('Price', 'Price') }}</label>
            <input v-model.number="draft.price" type="number" min="0" step="0.01" class="form-control cb-input" placeholder="0.00" />
          </div>
        </section>

        <!-- Features -->
        <section class="card-soft cb-card mt-3">
          <div class="cb-card-head">
            <div class="cb-head-icon" aria-hidden="true">✨</div>
            <div class="cb-head-title">{{ msg('Features', 'Features') }}</div>
          </div>

          <div class="cb-features">
            <button
              v-for="f in featureOptions"
              :key="f"
              type="button"
              class="cb-chip"
              :class="{ active: draft.tags.includes(f) }"
              @click="toggleFeature(f)"
            >
              {{ f }}
            </button>
          </div>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useI18nStore } from '@/stores/i18n.js'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const coursesStore = useCoursesStore()
const i18n = useI18nStore()
const toast = useToast()

const msg = (ar, en) => (i18n.locale === 'ar' ? ar : en)

const isSaving = ref(false)
const fileInput = ref(null)
const draftSaved = ref(false)
const lastSavedSig = ref('')

const editingId = computed(() => {
  const id = route.params.id
  return id && id !== 'new' ? String(id) : null
})

const featureOptions = [
  'Music',
  'Games',
  'Score',
  'Spell',
  'Stories',
  'Puzzles',
  'Count'
]

function uid(prefix) {
  return `${prefix}${Date.now()}${Math.random().toString(16).slice(2, 6)}`
}

function normalizeLesson(raw, chapter) {
  return {
    id: raw?.id || uid('l'),
    chapterId: chapter?.id || raw?.chapterId || null,
    chapterTitle: chapter?.title || raw?.chapterTitle || '',
    title: raw?.title || raw?.title_en || '',
    title_en: raw?.title_en || raw?.title || '',
    title_ar: raw?.title_ar || '',
    description: raw?.description || raw?.description_en || '',
    description_en: raw?.description_en || raw?.description || '',
    description_ar: raw?.description_ar || '',
    videoUrl: raw?.videoUrl || '',
    durationMins: Number(raw?.durationMins ?? inferDurationMins(raw)) || 5
  }
}

function inferDurationMins(raw) {
  // support old shape: duration: "Video. 5Mins" or "5 Mins"
  const d = String(raw?.duration || '').toLowerCase()
  const m = d.match(/(\d+)\s*min/)
  if (m?.[1]) return Number(m[1])
  return 5
}

function normalizeCurriculumFromCourse(course) {
  const cur = course?.curriculum
  if (Array.isArray(cur) && cur.length) {
    return cur.map((c, idx) => ({
      id: String(c?.id || uid('ch')),
      title: String(c?.title || `Chapter ${idx + 1}`),
      lessons: Array.isArray(c?.lessons) ? c.lessons.map(l => normalizeLesson(l, c)) : []
    }))
  }

  // fallback: build from lessons
  const lessons = Array.isArray(course?.lessons) ? course.lessons : []
  if (!lessons.length) return []

  const byTitle = new Map()
  for (const l of lessons) {
    const t = String(l?.chapterTitle || 'Chapter 1')
    if (!byTitle.has(t)) byTitle.set(t, [])
    byTitle.get(t).push(l)
  }

  const result = []
  let i = 0
  for (const [title, items] of byTitle.entries()) {
    i++
    const ch = { id: uid('ch'), title: title || `Chapter ${i}` }
    result.push({
      ...ch,
      lessons: items.map(l => normalizeLesson(l, ch))
    })
  }
  return result
}

function flattenLessons(curriculum) {
  const flat = []
  curriculum.forEach((ch, chIdx) => {
    (ch.lessons || []).forEach((ls, lsIdx) => {
      const durationMins = Number(ls.durationMins ?? 5) || 5
      flat.push({
        id: ls.id || uid('l'),
        chapterId: ch.id,
        chapterTitle: ch.title || `Chapter ${chIdx + 1}`,
        order: chIdx * 1000 + lsIdx,
        title: ls.title_en || ls.title || '',
        title_en: ls.title_en || ls.title || '',
        title_ar: ls.title_ar || '',
        description: ls.description_en || '',
        description_en: ls.description_en || '',
        description_ar: ls.description_ar || '',
        videoUrl: ls.videoUrl || '',
        durationMins,
        duration: `Video. ${durationMins}Mins`
      })
    })
  })
  return flat
}

const draft = reactive({
  id: null,
  title_en: '',
  title_ar: '',
  description_en: '',
  description_ar: '',
  category: 'Science',
  age: '4-6',
  price: 0,
  thumbnail: '',
  tags: [],
  curriculum: []
})

const draftSig = computed(() => JSON.stringify({
  title_en: draft.title_en,
  title_ar: draft.title_ar,
  description_en: draft.description_en,
  description_ar: draft.description_ar,
  category: draft.category,
  age: draft.age,
  price: draft.price,
  thumbnail: draft.thumbnail,
  tags: draft.tags,
  curriculum: draft.curriculum
}))

watch(draftSig, (sig) => {
  if (!lastSavedSig.value) return
  if (sig !== lastSavedSig.value) draftSaved.value = false
})

onMounted(async () => {
  await coursesStore.load()

  if (editingId.value) {
    const course = coursesStore.getById(editingId.value)
    if (!course) {
      toast.error(msg('الكورس غير موجود.', 'Course not found.'))
      router.push({ name: 'admin-courses' })
      return
    }

    draft.id = course.id
    draft.title_en = course.title_en || course.title || ''
    draft.title_ar = course.title_ar || ''
    draft.description_en = course.description_en || course.description || course.overview_en || course.overview || ''
    draft.description_ar = course.description_ar || course.overview_ar || ''
    draft.category = course.category || 'Science'
    draft.age = course.age || '4-6'
    draft.price = Number(course.price ?? 0) || 0
    draft.thumbnail = course.thumbnail || ''
    draft.tags = Array.isArray(course.tags) ? [...course.tags] : []
    draft.curriculum = normalizeCurriculumFromCourse(course)
  } else {
    // defaults
    if (!draft.thumbnail) draft.thumbnail = '/assets/images/topcourses1.png'
    if (!draft.curriculum.length) {
      const ch = { id: uid('ch'), title: 'Chapter 1', lessons: [] }
      draft.curriculum.push(ch)
    }
  }
})

function openFilePicker() {
  fileInput.value?.click?.()
}

function onFileChange(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    draft.thumbnail = ev?.target?.result || draft.thumbnail
  }
  reader.readAsDataURL(file)
}

function onDropFile(e) {
  const file = e?.dataTransfer?.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    draft.thumbnail = ev?.target?.result || draft.thumbnail
  }
  reader.readAsDataURL(file)
}

function toggleFeature(feature) {
  const idx = draft.tags.indexOf(feature)
  if (idx >= 0) draft.tags.splice(idx, 1)
  else draft.tags.push(feature)
}

function addChapter() {
  const ch = { id: uid('ch'), title: `Chapter ${draft.curriculum.length + 1}`, lessons: [] }
  draft.curriculum.push(ch)
  toast.info(msg('تم إضافة فصل.', 'Chapter added.'))
}

function isLessonComplete(lesson) {
  if (!lesson) return false
  const titleOk = String(lesson.title_en || '').trim().length > 0
  const urlOk = String(lesson.videoUrl || '').trim().length > 0
  const minsOk = Number(lesson.durationMins ?? 0) >= 1
  return titleOk && urlOk && minsOk
}

function removeChapter(chId) {
  if (draft.curriculum.length <= 1) {
    toast.warning(msg('لا يمكن حذف آخر فصل.', 'You cannot delete the last chapter.'))
    return
  }
  draft.curriculum = draft.curriculum.filter(c => c.id !== chId)
  toast.success(msg('تم حذف الفصل.', 'Chapter deleted.'))
}

function addLesson(chId) {
  const ch = draft.curriculum.find(c => c.id === chId)
  if (!ch) return
  ch.lessons = Array.isArray(ch.lessons) ? ch.lessons : []

  // Prevent adding a new lesson until the last one is filled
  const last = ch.lessons[ch.lessons.length - 1]
  if (last && !isLessonComplete(last)) {
    toast.error(msg('من فضلك املأ بيانات الدرس الحالي أولاً (العنوان + رابط الفيديو + المدة) قبل إضافة درس جديد.', 'Please fill the current lesson details (title + video URL + duration) before adding a new lesson.'))
    return
  }

  ch.lessons.push({
    id: uid('l'),
    title_en: '',
    title_ar: '',
    videoUrl: '',
    durationMins: 5
  })
  toast.info(msg('تم إضافة درس.', 'Lesson added.'))
}

function removeLesson(chId, lessonId) {
  const ch = draft.curriculum.find(c => c.id === chId)
  if (!ch) return
  ch.lessons = (ch.lessons || []).filter(l => l.id !== lessonId)
  toast.success(msg('تم حذف الدرس.', 'Lesson deleted.'))
}

function chapterMins(ch) {
  return (ch.lessons || []).reduce((sum, l) => sum + (Number(l.durationMins ?? 0) || 0), 0)
}

function validateBase() {
  if (!String(draft.title_en || '').trim()) {
    toast.error(msg('من فضلك اكتب عنوان الكورس بالإنجليزية.', 'Please enter course title (English).'))
    return false
  }
  if (!String(draft.category || '').trim()) {
    toast.error(msg('من فضلك اختر المادة.', 'Please select subject.'))
    return false
  }
  return true
}

function validatePublish() {
  if (!validateBase()) return false

  const flat = flattenLessons(draft.curriculum)
  if (!flat.length) {
    toast.error(msg('أضف درسًا واحدًا على الأقل قبل النشر.', 'Add at least one lesson before publishing.'))
    return false
  }

  for (let i = 0; i < flat.length; i++) {
    const l = flat[i]
    if (!String(l.title_en || '').trim()) {
      toast.error(msg(`اكتب عنوان الدرس رقم ${i + 1}.`, `Please enter title for lesson #${i + 1}.`))
      return false
    }
    if (!String(l.videoUrl || '').trim()) {
      toast.error(msg(`ضع رابط الفيديو للدرس رقم ${i + 1}.`, `Please enter video URL for lesson #${i + 1}.`))
      return false
    }
  }
  return true
}

async function upsertCourse(status) {
  const now = new Date().toISOString()
  const curriculum = draft.curriculum.map((c, idx) => ({
    id: c.id || uid('ch'),
    title: c.title || `Chapter ${idx + 1}`,
    lessons: (c.lessons || []).map(l => normalizeLesson(l, c))
  }))
  const lessons = flattenLessons(curriculum)

  const payload = {
    title: draft.title_en || 'Untitled course',
    title_en: draft.title_en,
    title_ar: draft.title_ar,
    description: draft.description_en,
    description_en: draft.description_en,
    description_ar: draft.description_ar,
    overview_en: draft.description_en,
    overview_ar: draft.description_ar,
    category: draft.category,
    age: draft.age,
    price: Number(draft.price ?? 0) || 0,
    thumbnail: draft.thumbnail || '/assets/images/topcourses1.png',
    tags: draft.tags || [],
    curriculum,
    lessons,
    status,
    updatedAt: now
  }

  if (editingId.value) {
    const base = coursesStore.getById(editingId.value)
    payload.id = editingId.value
    payload.createdAt = base?.createdAt || now
    payload.grade = base?.grade || 'Grade 1-3'
    payload.seats = base?.seats || 10
    await coursesStore.updateCourse(payload)
    return payload.id
  }

  const id = `c${Date.now()}`
  payload.id = id
  payload.createdAt = now
  payload.grade = 'Grade 1-3'
  payload.seats = 10
  await coursesStore.addCourse(payload)
  return id
}

async function saveDraft() {
  if (isSaving.value) return
  if (!validateBase()) return
  isSaving.value = true
  try {
    const id = await upsertCourse('draft')
    toast.success(msg('تم حفظ المسودة.', 'Draft saved.'))
    lastSavedSig.value = draftSig.value
    draftSaved.value = true
    if (!editingId.value) router.replace({ name: 'admin-courses-edit', params: { id } })
  } catch (e) {
    toast.error((e?.message || '').toString() || msg('فشل حفظ المسودة.', 'Failed to save draft.'))
    console.error('Save draft error:', e)
  } finally {
    isSaving.value = false
  }
}

async function publishCourse() {
  if (isSaving.value) return
  if (!validatePublish()) return
  isSaving.value = true
  try {
    await upsertCourse('published')
    toast.success(msg('تم نشر الكورس بنجاح!', 'Course published successfully!'))
    router.push({ name: 'admin-courses' })
  } catch (e) {
    toast.error((e?.message || '').toString() || msg('فشل نشر الكورس.', 'Failed to publish course.'))
    console.error('Publish course error:', e)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.cb-page {
  padding: 0;
}

.cb-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 18px;
}

.cb-title {
  margin: 0;
  font-weight: 900;
  color: #00335a;
}

.cb-sub {
  margin-top: 6px;
}

.cb-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cb-pill {
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 800;
}

.cb-grid {
  display: grid;
  grid-template-columns: 1.6fr 0.9fr;
  gap: 18px;
  align-items: start;
}

.card-soft.cb-card {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
  padding: 18px;
}

.cb-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.cb-card-head-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cb-head-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cb-head-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #e6f7ff;
  color: #00aaff;
  font-weight: 900;
}

.cb-head-title {
  font-weight: 900;
  color: #00335a;
}

.cb-field {
  margin-top: 14px;
}

.cb-label {
  font-weight: 800;
  color: #0f172a;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.cb-label-ar {
  text-align: right;
}

.cb-input,
.cb-textarea {
  border-radius: 14px;
  border: 1px solid #e9eef5;
  background: #fbfcff;
  padding: 12px 14px;
  font-size: 0.95rem;
}

.cb-input:focus,
.cb-textarea:focus {
  border-color: rgba(0,170,255,0.65);
  box-shadow: 0 0 0 3px rgba(0,170,255,0.12);
}

.cb-input--sm {
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.cb-input--xs {
  width: 110px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.cb-link-btn {
  border: none;
  background: transparent;
  color: #00aaff;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cb-plus {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(0,170,255,0.12);
  color: #00aaff;
  font-weight: 900;
}

.cb-curr {
  display: grid;
  gap: 14px;
}

.cb-chapter {
  background: #f6f8fc;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 12px;
}

.cb-ch-head {
  display: grid;
  grid-template-columns: 22px 1fr 44px;
  gap: 10px;
  align-items: center;
}

.cb-dots {
  color: #94a3b8;
  text-align: center;
  font-weight: 900;
}

.cb-dots--sm {
  width: 18px;
}

.cb-ch-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cb-ch-sub {
  font-size: 0.85rem;
}

.cb-icon-btn {
  border: none;
  background: transparent;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #64748b;
}

.cb-icon-btn:hover {
  background: rgba(255,255,255,0.8);
  color: #dc3545;
}

.cb-lessons {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.cb-lesson {
  display: grid;
  grid-template-columns: 18px 34px 1fr 44px;
  gap: 10px;
  align-items: start;
  padding: 12px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
}

.cb-play {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #e6f7ff;
  color: #00aaff;
  font-weight: 900;
}

.cb-lesson-fields {
  display: grid;
  gap: 8px;
}

.cb-lesson-row {
  display: grid;
  grid-template-columns: 1fr 110px;
  gap: 10px;
  align-items: center;
}

.cb-mini-muted {
  font-weight: 800;
  font-size: 0.85rem;
  text-align: right;
}

.cb-add-lesson {
  border: 2px dashed rgba(0,0,0,0.18);
  background: transparent;
  border-radius: 14px;
  padding: 14px;
  font-weight: 800;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.cb-add-lesson:hover {
  border-color: rgba(0,170,255,0.45);
  color: #00aaff;
  background: rgba(0,170,255,0.06);
}

.cb-drop {
  border: 2px dashed rgba(0,0,0,0.18);
  border-radius: 16px;
  padding: 14px;
  background: #fbfcff;
  display: grid;
  place-items: center;
  min-height: 180px;
  cursor: pointer;
}

.cb-drop:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0,170,255,0.12);
  border-color: rgba(0,170,255,0.6);
}

.cb-drop-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.cb-drop-empty {
  display: grid;
  gap: 10px;
  justify-items: center;
  text-align: center;
  color: #94a3b8;
}

.cb-drop-ic {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,0.04);
  color: #94a3b8;
  font-weight: 900;
}

.cb-drop-text {
  font-size: 0.9rem;
  max-width: 240px;
}

.cb-hint {
  margin-top: 10px;
  font-size: 0.85rem;
}

.cb-thumb-url {
  margin-top: 12px;
}

.cb-side-field {
  margin-top: 14px;
}

.cb-side-label {
  font-weight: 800;
  color: #64748b;
  margin-bottom: 8px;
}

.cb-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cb-chip {
  border: 1px solid rgba(0,0,0,0.08);
  background: #f3f5f9;
  border-radius: 14px;
  padding: 10px 14px;
  font-weight: 800;
}

.cb-chip.active {
  background: rgba(22,163,74,0.12);
  border-color: rgba(22,163,74,0.35);
  color: #16a34a;
}

.cb-empty {
  padding: 10px 4px 2px;
}

@media (max-width: 1100px) {
  .cb-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .cb-top {
    flex-direction: column;
    align-items: stretch;
  }
  .cb-actions {
    justify-content: flex-end;
  }
  .cb-lesson-row {
    grid-template-columns: 1fr;
  }
  .cb-input--xs {
    width: 100%;
  }
}
</style>

