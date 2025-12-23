<template>
  <div class="course-details-container">
    <!-- Hero Section -->
    <section class="hero-section position-relative overflow-hidden" v-if="course">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">{{ displayTitle }}</h1>
            <p class="hero-subtitle">{{ displaySubtitle }}</p>
            <div class="hero-meta">
              <span class="hero-pill">{{ t('course.categoryLabel') }}: {{ categoryText }}</span>
              <span v-if="course.age" class="hero-pill">{{ t('course.ageLabel') }} {{ course.age }}</span>
            </div>
            <button v-if="!isSub" class="btn enrol-btn" @click="router.push({ name: 'subscribe', params: { id: course.id } })">
              {{ t('courseDetail.enrollment') }}
            </button>
            <button v-else class="btn enrol-btn" @click="scrollToLessons">
              {{ t('courseDetail.start') }}
            </button>
          </div>
          <div class="hero-image">
            <div class="hero-image-card">
              <img :src="heroImage" :alt="displayTitle" class="maths-image">
            </div>
          </div>
        </div>
      </div>
      <!-- Wave Divider -->
      <div class="wave-divider">
        <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,75 C240,0 480,150 720,75 C960,0 1200,150 1440,75 L1440,150 L0,150 Z" fill="white"/>
        </svg>
      </div>
    </section>

    <!-- Course Overview Section -->
    <section class="course-overview-section" v-if="course">
      <div class="course-overview-container">
        <h2 class="section-title">{{ t('courseDetail.overview') }}</h2>
        <div class="course-content">
          <div class="course-image">
            <img :src="overviewImage" :alt="displayTitle" class="group-image">
          </div>
          <div class="course-description">
            <p class="course-text">{{ displayOverview }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Course Outline Section -->
    <section class="course-outline-section" v-if="course">
      <div class="course-outline-container">
        <h2 class="outline-title">{{ t('courseDetail.outline') }}</h2>
        <div class="outline-accordion accordion" id="courseAccordion">
          <div v-for="(lesson, index) in course.lessons" :key="lesson.id" class="accordion-item">
            <h2 class="accordion-header" :id="`heading${index}`">
              <button 
                class="accordion-button collapsed" 
                type="button" 
                data-bs-toggle="collapse" 
                :data-bs-target="`#collapse${index}`" 
                aria-expanded="false" 
                :aria-controls="`collapse${index}`"
              >
                <div class="accordion-content">
                  <div class="accordion-icon">
                    <img src="/assets/images/icon 1.png" alt="Video Icon" class="video-icon">
                  </div>
                  <div class="accordion-title-wrap">
                    <span class="accordion-title">{{ getLessonTitle(lesson) }}</span>
                    <span class="accordion-duration">{{ getLessonDuration(lesson) }}</span>
                  </div>
                  <div class="accordion-arrow">
                    <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </button>
            </h2>
            <div 
              :id="`collapse${index}`" 
              class="accordion-collapse collapse" 
              :aria-labelledby="`heading${index}`" 
              data-bs-parent="#courseAccordion"
            >
              <div class="accordion-body">
                {{ getLessonDesc(lesson) }}
                <div v-if="isSub" class="lesson-video">
                  <VideoPlayer :course-id="course.id" :video-url="lesson.videoUrl" />
                </div>
                <div v-else class="locked-lesson">
                  🔒 {{ t('courseDetail.lockedLesson') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Other Courses Section -->
    <section class="other-courses-section">
      <div class="other-courses-container">
        <h2 class="other-courses-title">{{ t('courseDetail.otherCourses') }}</h2>
        <div class="courses-grid">
          <div v-for="otherCourse in otherCourses" :key="otherCourse.id" class="course-card">
            <div class="course-image-container">
              <img :src="otherCourse.thumbnail" :alt="otherCourse.title" class="course-card-img">
            </div>
            <h3 class="course-card-title">{{ getDisplayTitle(otherCourse) }}</h3>
            <div class="tags-container">
              <span
                v-for="tag in getTags(otherCourse)"
                :key="tag"
                class="tag"
                :class="tagClass(tag)"
              >
                {{ tagLabel(tag) }}
              </span>
            </div>
            <p class="course-card-description">{{ getDisplayDesc(otherCourse) }}</p>
            <div class="course-card-divider"></div>
            <button class="course-card-btn" @click="viewOtherCourse(otherCourse.id)">{{ t('courseDetail.viewDetails') }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Subscribe Modal removed -->
    
    <!-- Not Found Section -->
    <section v-if="!course" class="container mx-auto px-4 py-20 text-center">
      <p class="section-title">{{ t('courseDetail.notFound') }}</p>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import VideoPlayer from '@/components/VideoPlayer.vue'
import { useI18nStore } from '@/stores/i18n.js'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const sub = useSubscriptionStore()

onMounted(() => { 
  store.load()
  sub.load() 
})

const course = computed(() => store.getById(route.params.id))
const isSub = computed(() => course.value ? sub.isSubscribed(course.value.id) : false)

const scrollToLessons = () => {
  const el = document.getElementById('courseAccordion')
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

const displayOverview = computed(() => {
  if (!course.value) return ''
  const ov = i18n.locale === 'en'
    ? (course.value.overview_en || course.value.overview || '')
    : (course.value.overview_ar || course.value.overview || '')
  return ov || displayDesc.value
})

const heroImage = computed(() => course.value?.heroImage || course.value?.thumbnail || '')
const overviewImage = computed(() => course.value?.overviewImage || course.value?.thumbnail || '')

const displaySubtitle = computed(() => {
  if (!course.value) return ''
  return t('courseDetail.subtitle', { title: displayTitle.value.toLowerCase() })
})

const categoryText = computed(() => {
  if (!course.value) return ''
  const map = { Arabic: t('category.arabic'), English: t('category.english'), Math: t('category.math') }
  return map[course.value.category] || course.value.category
})

const otherCourses = computed(() => {
  if (!course.value) return []
  return store.courses.filter(c => c.id !== course.value.id).slice(0, 3)
})

const getDisplayTitle = (courseItem) => {
  return i18n.locale === 'en' ? (courseItem.title_en || courseItem.title) : (courseItem.title_ar || courseItem.title)
}

const getDisplayDesc = (courseItem) => {
  return i18n.locale === 'en' ? (courseItem.description_en || courseItem.description) : (courseItem.description_ar || courseItem.description)
}

const getTags = (courseItem) => {
  const tags = Array.isArray(courseItem.tags) ? courseItem.tags : []
  return (tags.length ? tags : ['Music', 'Games', 'Puzzles']).slice(0, 3)
}

const tagLabel = (tag) => {
  const keyMap = {
    Music: 'course.tag.music',
    Games: 'course.tag.games',
    Puzzles: 'course.tag.puzzles',
    Spell: 'course.tag.spell',
    Stories: 'course.tag.stories',
    Count: 'course.tag.count',
    Score: 'course.tag.score'
  }
  const k = keyMap[tag]
  return k ? t(k) : String(tag)
}

const tagClass = (tag) => {
  const map = {
    Music: 'tag-music',
    Games: 'tag-games',
    Puzzles: 'tag-puzzles',
    Spell: 'tag-spell',
    Stories: 'tag-stories',
    Count: 'tag-count',
    Score: 'tag-score'
  }
  return map[tag] || 'tag-default'
}

const getLessonTitle = (lesson) => {
  const title = i18n.locale === 'en' ? (lesson.title_en || lesson.title) : (lesson.title_ar || lesson.title)
  return title || lesson.title || ''
}

const getLessonDesc = (lesson) => {
  const d = i18n.locale === 'en' ? (lesson.description_en || lesson.description) : (lesson.description_ar || lesson.description)
  return d || getDefaultDescription(getLessonTitle(lesson))
}

const getLessonDuration = (lesson) => {
  if (lesson.duration) return lesson.duration
  const s = String(lesson.id || '0')
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0
  const mins = 2 + (h % 7) // 2..8
  const secs = (h % 2) ? '30' : '10'
  return `${mins}:${secs}`
}

const getDefaultDescription = (lessonTitle) => {
  const descriptions = {
    ar: {
      'الحروف 1': 'تعلم الحروف العربية الأساسية من خلال أنشطة تفاعلية ممتعة وألعاب تعليمية.',
      'الحروف 2': 'استكمال تعلم الحروف العربية مع التركيز على النطق الصحيح والكتابة.',
      'ABC': 'تعلم الأبجدية الإنجليزية من خلال الأغاني الممتعة والألعاب والأنشطة التفاعلية.',
      'Words': 'بناء المفردات مع كلمات إنجليزية بسيطة ومعانيها من خلال التعلم البصري.',
      'Counting': 'تعلم العد من 1 إلى 20 مع أنشطة ممتعة ووسائل بصرية.',
      'Addition': 'اكتشف الجمع الأساسي من خلال الرسوم التوضيحية الملونة والأمثلة المرحة.'
    },
    en: {
      'الحروف 1': 'Learn basic Arabic letters through fun interactive activities and educational games.',
      'الحروف 2': 'Continue learning Arabic letters with focus on correct pronunciation and writing.',
      'ABC': 'Learn the English alphabet through fun songs, games, and interactive activities.',
      'Words': 'Build vocabulary with simple English words and their meanings through visual learning.',
      'Counting': 'Learn to count numbers from 1 to 20 with fun activities and visual aids.',
      'Addition': 'Discover basic addition through colorful illustrations and playful examples.'
    }
  }
  const defaultDesc = {
    ar: 'تعلم مفاهيم جديدة من خلال أنشطة تفاعلية ممتعة ومناسبة للأطفال.',
    en: 'Learn new concepts through fun and age-appropriate interactive activities.'
  }
  return descriptions[i18n.locale]?.[lessonTitle] || descriptions[i18n.locale === 'ar' ? 'en' : 'ar']?.[lessonTitle] || defaultDesc[i18n.locale] || defaultDesc.en
}

const viewOtherCourse = (courseId) => {
  router.push(`/course-details/${courseId}`)
}
</script>

<style scoped>
.course-details-container {
  min-height: 100vh;
  background-color: #ffffff;
}

/* Hero Section Styles */
.hero-section {
  background: linear-gradient(to right, #81DFFF, #90EE90);
  width: 100%;
  min-height: 420px;
  display: flex;
  align-items: center;
  padding: 110px 0 170px;
  margin: 0;
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

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
}

.hero-text {
  flex: 1;
  padding-right: 40px;
}

.hero-title {
  color: #033B62;
  font-weight: 700;
  font-size: 3.5rem;
  margin-bottom: 20px;
  line-height: 1.1;
  letter-spacing: 2px;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 35px;
  line-height: 1.3;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.hero-pill {
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.9rem;
  backdrop-filter: blur(6px);
}

.enrol-btn {
  background-color: #033B62 !important;
  color: white !important;
  font-weight: 600 !important;
  border: none;
  padding: 16px 50px !important;
  border-radius: 20px !important;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(3, 59, 98, 0.2);
  min-width: 200px;
}

.enrol-btn:hover {
  background-color: #022a4a !important;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(3, 59, 98, 0.3);
}

.hero-image {
  flex: 0 0 45%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image-card {
  width: min(520px, 100%);
  border-radius: 26px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(6px);
}

.maths-image {
  max-width: 100%;
  height: auto;
  border-radius: 18px;
  display: block;
}

/* Course Overview Section */
.course-overview-section {
  padding: 80px 0;
  background-color: white;
  width: 100%;
}

.course-overview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.section-title {
  color: #033B62;
  font-weight: 700;
  font-size: 2.8rem;
  text-align: left;
  margin-bottom: 50px;
  line-height: 1.2;
  padding-left: 0;
  letter-spacing: 2px;
}

.course-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  background: #f7fbff;
  border: 1px solid rgba(3, 59, 98, 0.08);
  border-radius: 24px;
  padding: 26px;
}

.course-image {
  flex: 0 0 40%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.group-image {
  max-width: 100%;
  height: auto;
}

.course-description {
  flex: 1;
}

.course-text {
  color: #033B62;
  font-weight: 400;
  font-size: 1.1rem;
  line-height: 1.7;
  text-align: justify;
  margin: 0;
  white-space: pre-line;
}

/* Course Outline Section */
.course-outline-section {
  padding: 80px 0;
  background-color: white;
  width: 100%;
}

.course-outline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.outline-title {
  color: #033B62;
  font-weight: 700;
  font-size: 2.8rem;
  text-align: left;
  margin-bottom: 50px;
  line-height: 1.2;
  letter-spacing: 2px;
}

/* Accordion Styles */
.outline-accordion {
  width: 100%;
}

.accordion-item {
  background-color: white;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 0;
}

.accordion-header {
  margin: 0;
}

.accordion-button {
  background-color: white !important;
  color: #033B62 !important;
  font-weight: 600 !important;
  font-size: 1.25rem;
  padding: 20px 0 !important;
  border: none !important;
  box-shadow: none !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.accordion-button::after {
  display: none !important;
}

.accordion-button:not(.collapsed) {
  background-color: white !important;
  color: #033B62 !important;
}

.accordion-button:focus {
  box-shadow: none !important;
  border-color: transparent !important;
}

.accordion-content {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.accordion-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.video-icon {
  width: 45px;
  height: 45px;
}

.accordion-title {
  color: #033B62;
  font-weight: 600;
  font-size: 1.25rem;
  margin: 0;
  flex: 1;
}

.accordion-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.accordion-duration {
  color: rgba(3, 59, 98, 0.7);
  font-weight: 600;
  font-size: 0.9rem;
}

.accordion-arrow {
  color: #00BFFF;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.chev {
  width: 24px;
  height: 24px;
}

.accordion-button:not(.collapsed) .accordion-arrow {
  transform: rotate(180deg);
}

.accordion-body {
  color: #033B62;
  font-weight: 400;
  font-size: 0.95rem;
  line-height: 1.6;
  padding: 15px 0 20px 65px !important;
  border-top: none;
}

.lesson-video {
  margin-top: 15px;
}

.locked-lesson {
  background: #E7F6FF;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #033B62;
  /* font-family: 'Fredoka', 'Segoe UI', sans-serif; */
  font-size: 1.1rem;
  margin-top: 15px;
}

/* Other Courses Section */
.other-courses-section {
  padding: 80px 0;
  background-color: white;
  width: 100%;
}

.other-courses-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.other-courses-title {
  color: #033B62;
  font-weight: 700;
  font-size: 2.8rem;
  text-align: center;
  margin-bottom: 50px;
  line-height: 1.2;
  letter-spacing: 2px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.course-card {
  background-color: white;
  border-radius: 30px;
  padding: 25px;
  border: 1px solid #D9D9D9;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image-container {
  width: 100%;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

.course-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-card-title {
  color: #033B62;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 15px;
  line-height: 1.2;
}

.tags-container {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  padding: 5px 12px;
  border-radius: 23px;
  font-size: 0.8rem;
  font-weight: 400;
  color: black;
}

.tag-music {
  background-color: #FFC0CB;
}

.tag-games {
  background-color: #90EE90;
}

.tag-puzzles {
  background-color: #FFD700;
}

.tag-stories { background-color: rgba(0, 191, 255, 0.20); }
.tag-spell { background-color: rgba(255, 160, 122, 0.35); }
.tag-count { background-color: rgba(144, 238, 144, 0.25); }
.tag-score { background-color: rgba(255, 215, 0, 0.25); }
.tag-default { background-color: rgba(3, 59, 98, 0.10); }

.course-card-description {
  color: rgba(3, 59, 98, 0.8);
  font-weight: 400;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
}

.course-card-divider {
  height: 1px;
  background-color: #e0e0e0;
  width: 100%;
  margin: 15px 0;
}

.course-card-btn {
  background-color: #00BFFF;
  color: white;
  font-weight: 400;
  border: none;
  padding: 12px 20px;
  border-radius: 30px;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  width: calc(100% - 10px);
  margin: 0 auto;
}

.course-card-btn:hover {
  background-color: #00a8e6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-20 {
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.text-center {
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .hero-title {
    font-size: 3rem;
  }
  .hero-subtitle {
    font-size: 1.3rem;
  }
  .hero-image {
    flex: 0 0 48%;
  }
  .maths-image {
    max-width: 100%;
  }
  .section-title {
    font-size: 2.5rem;
  }
  .course-text {
    font-size: 1.05rem;
  }
  .outline-title {
    font-size: 2.5rem;
  }
  .accordion-title {
    font-size: 1.2rem;
  }
  .other-courses-title {
    font-size: 2.5rem;
  }
  .courses-grid {
    gap: 25px;
  }
}

@media (max-width: 992px) {
  .hero-section {
    min-height: auto;
    padding: 80px 0 120px;
  }
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  .hero-text {
    padding-right: 0;
    margin-bottom: 40px;
    max-width: 700px;
  }
  .hero-title {
    font-size: 2.8rem;
  }
  .hero-subtitle {
    font-size: 1.2rem;
  }
  .hero-image {
    flex: 0 0 auto;
    max-width: 580px;
    width: 100%;
  }
  .maths-image {
    max-width: 100%;
  }
  .course-overview-section {
    padding: 60px 0;
  }
  .course-content {
    flex-direction: column;
    gap: 40px;
    padding: 18px;
  }
  .course-image {
    flex: 0 0 auto;
    max-width: 450px;
    width: 100%;
  }
  .section-title {
    font-size: 2.3rem;
    margin-bottom: 40px;
    text-align: center;
  }
  .course-text {
    text-align: center;
    font-size: 1.05rem;
  }
  .course-outline-section {
    padding: 60px 0;
  }
  .outline-title {
    font-size: 2.3rem;
    margin-bottom: 40px;
    text-align: center;
  }
  .accordion-button {
    font-size: 1.15rem;
    padding: 18px 0 !important;
  }
  .accordion-title {
    font-size: 1.15rem;
  }
  .accordion-body {
    padding: 15px 0 20px 15px !important;
  }
  .accordion-icon {
    width: 45px;
    height: 45px;
  }
  .video-icon {
    width: 40px;
    height: 40px;
  }
  .other-courses-section {
    padding: 60px 0;
  }
  .other-courses-title {
    font-size: 2.3rem;
    margin-bottom: 40px;
  }
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.4rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
  .enrol-btn {
    padding: 14px 40px !important;
    font-size: 1.1rem;
  }
  .hero-image {
    max-width: 520px;
  }
  .section-title {
    font-size: 2.1rem;
    margin-bottom: 35px;
  }
  .course-overview-section {
    padding: 50px 0;
  }
  .course-text {
    font-size: 1rem;
    line-height: 1.6;
  }
  .course-outline-section {
    padding: 50px 0;
  }
  .outline-title {
    font-size: 2.1rem;
    margin-bottom: 35px;
  }
  .accordion-button {
    font-size: 1.1rem;
    padding: 16px 0 !important;
  }
  .accordion-title {
    font-size: 1.1rem;
  }
  .accordion-icon {
    width: 40px;
    height: 40px;
  }
  .video-icon {
    width: 35px;
    height: 35px;
  }
  .accordion-body {
    font-size: 0.9rem;
    padding: 12px 0 18px 15px !important;
  }
  .other-courses-section {
    padding: 50px 0;
  }
  .other-courses-title {
    font-size: 2.1rem;
    margin-bottom: 35px;
  }
  .courses-grid {
    gap: 20px;
  }
  .course-card {
    padding: 20px;
  }
  .course-card-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 25px;
  }
  .enrol-btn {
    padding: 12px 35px !important;
    font-size: 1rem;
  }
  .hero-image {
    max-width: 420px;
  }
  .maths-image {
    filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.1));
  }
  .section-title {
    font-size: 1.9rem;
    margin-bottom: 30px;
  }
  .course-overview-section {
    padding: 40px 0;
  }
  .course-image {
    max-width: 350px;
  }
  .course-text {
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .course-outline-section {
    padding: 40px 0;
  }
  .outline-title {
    font-size: 1.9rem;
    margin-bottom: 30px;
  }
  .accordion-button {
    font-size: 1rem;
    padding: 15px 0 !important;
  }
  .accordion-title {
    font-size: 1rem;
  }
  .accordion-content {
    gap: 10px;
  }
  .accordion-icon {
    width: 35px;
    height: 35px;
  }
  .video-icon {
    width: 30px;
    height: 30px;
  }
  .accordion-body {
    font-size: 0.85rem;
    padding: 10px 0 15px 15px !important;
  }
  .lesson-duration {
    font-size: 0.8rem;
  }
  .other-courses-section {
    padding: 40px 0;
  }
  .other-courses-title {
    font-size: 1.9rem;
    margin-bottom: 30px;
  }
  .courses-grid {
    grid-template-columns: 1fr;
    gap: 25px;
    max-width: 400px;
    margin: 0 auto;
  }
  .course-image-container {
    height: 180px;
  }
  .course-card-title {
    font-size: 1.4rem;
  }
  .course-card-description {
    font-size: 0.85rem;
  }
  .course-card-btn {
    padding: 10px 15px;
    font-size: 0.95rem;
  }
}

@media (max-width: 400px) {
  .hero-title {
    font-size: 1.8rem;
  }
  .hero-subtitle {
    font-size: 0.95rem;
  }
  .hero-image {
    max-width: 350px;
  }
  .maths-image {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
  .section-title {
    font-size: 1.7rem;
  }
  .course-image {
    max-width: 300px;
  }
  .course-text {
    font-size: 0.9rem;
    line-height: 1.5;
  }
  .outline-title {
    font-size: 1.7rem;
    margin-bottom: 25px;
  }
  .accordion-button {
    padding: 12px 0 !important;
  }
  .accordion-body {
    padding: 8px 0 12px 15px !important;
  }
  .accordion-icon {
    width: 30px;
    height: 30px;
  }
  .video-icon {
    width: 25px;
    height: 25px;
  }
  .other-courses-title {
    font-size: 1.7rem;
    margin-bottom: 25px;
  }
  .course-card {
    padding: 18px;
  }
  .course-card-title {
    font-size: 1.3rem;
  }
  .tag {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
}
</style>