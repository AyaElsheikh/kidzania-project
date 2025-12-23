
<template>
  <!-- Hero Section -->
  <section class="hero-section position-relative overflow-hidden text-white" :class="{ 'hero-flipped': i18n.locale === 'ar' }">
    <div class="container py-5">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <h1 class="hero-heading mb-3">
            {{ t('home.heroLine1') }}<br />
            {{ t('home.heroLine2') }}<br />
            {{ t('home.heroLine3') }}
          </h1>
          <p class="hero-sub mb-4">
            {{ t('home.desc') }}
          </p>
          <router-link to="/courses" class="btn btn-lg  hero-cta">
            {{ t('home.exploreNow') }}
          </router-link>
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

  <!-- Empowering Young Minds Section -->
  <section class="empower-section">
    <div class="container">
      <h2 class="section-title text-center">{{ t('home.empowering') }}</h2>
      <p class="section-sub text-center">
        {{ t('home.empowering.subtitle') }}
      </p>
      <div class="row align-items-center gy-4">
        <div class="col-lg-6 text-center">
          
            <div class="feature-image-bg">
              <img src="/assets/images/Home-Feature.png" alt="Kid learning" class="img-fluid feature-main" />
            </div>
           
          
        </div>
        <div class="col-lg-6">
          <div class="feature-list">
            <div
              v-for="item in features"
              :key="item.title"
              class="feature-item"
              :style="{ borderColor: item.border }"
            >
              <div class="feature-icon">
                <img :src="item.icon" :alt="item.title" />
              </div>
              <div class="feature-body">
                <h3 class="feature-title">{{ item.title }}</h3>
                <p class="feature-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Our Top Courses Section -->
  <section class="top-courses-section position-relative overflow-hidden">
    <div class="container position-relative">
      <h2 class="section-title text-center">{{ t('home.topCourses') }}</h2>
      <p class="section-sub text-center">
        {{ t('recommended.subtitle') }}
      </p>
      <div class="row g-3">
        <div v-for="course in topCourses" :key="course.title" class="col-12 col-md-4">
          <div class="course-card h-100">
            <img :src="course.image" :alt="course.title" class="course-img" />
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-tags">
              <span v-for="tag in course.tags" :key="tag" class="course-tag">{{ tag }}</span>
            </div>
            <p class="course-text">{{ course.desc }}</p>
            <button class="course-btn" @click="viewCourseDetails(course)">{{ t('home.viewDetails') }}</button>
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

  <!-- Trusted by Parents Section -->
  <section class="trusted-section position-relative">
    <img src="/assets/images/Trusted by parents Sun.svg" alt="sun" class="trusted-sun" />
    <img src="/assets/images/Trusted by parents cloude.svg" alt="cloud" class="trusted-cloud" />
    <div class="container">
      <h2 class="section-title text-center">{{ t('testimonials.title') }}</h2>
      <p class="section-sub text-center">
        {{ t('testimonials.subtitle') }}
      </p>
      <div class="row gy-4 align-items-center justify-content-center">
        <div class="col-md-5">
          <div class="trusted-image">
            <img src="/assets/images/mother-hugging-daughter.png" alt="Mother hugging daughter" class="w-100 h-100" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="trusted-card">
            <div class="trusted-controls">
              <button class="ctrl-btn" aria-label="Previous" @click="prevTestimonial">‹</button>
              <span class="ctrl-index">{{ (currentTestimonial + 1).toString().padStart(2, '0') }} / {{ totalTestimonials.toString().padStart(2, '0') }}</span>
              <button class="ctrl-btn" aria-label="Next" @click="nextTestimonial">›</button>
            </div>
            <div class="trusted-quote">
              <img src="/assets/images/Trusted by parents Quotes.svg" alt="quotes" />
              <p>"{{ activeTestimonial.quote }}"</p>
            </div>
            <p class="trusted-author">— {{ activeTestimonial.author }} <span class="trusted-role">{{ activeTestimonial.role }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Floating AI Chat Widget (Home only) -->
  <HomeChatbotWidget />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'
import HomeChatbotWidget from '@/components/HomeChatbotWidget.vue'

const i18n = useI18nStore()
const t = i18n.t

const features = computed(() => [
  {
    title: t('feature.creative'),
    desc: t('feature.creativeDesc'),
    icon: '/assets/images/icon 1.png',
    bg: '#FDE7F1',
    border: '#81DFFF'
  },
  {
    title: t('feature.lessons'),
    desc: t('feature.lessonsDesc'),
    icon: '/assets/images/icon 2.png',
    bg: '#FFE5E9',
    border: '#f6b8c5'
  },
  {
    title: t('feature.games'),
    desc: t('feature.gamesDesc'),
    icon: '/assets/images/icon 3.png',
    bg: '#E6F8EA',
    border: '#8ed39e'
  },
  {
    title: t('feature.story'),
    desc: t('feature.storyDesc'),
    icon: '/assets/images/icon 4.png',
    bg: '#FFF1E4',
    border: '#f6c58f'
  }
])

const topCourses = computed(() => [
  {
    title: t('course.learnArabic'),
    image: '/assets/images/topcourses1.png',
    tags: [t('course.tag.music'), t('course.tag.games'), t('course.tag.puzzles')],
    desc: t('course.learnArabicDesc')
  },
  {
    title: t('course.abcLearning'),
    image: '/assets/images/topcourses2.png',
    tags: [t('course.tag.spell'), t('course.tag.games'), t('course.tag.stories')],
    desc: t('course.abcLearningDesc')
  },
  {
    title: t('course.123Learning'),
    image: '/assets/images/topcourses3.png',
    tags: [t('course.tag.count'), t('course.tag.score'), t('course.tag.puzzles')],
    desc: t('course.123LearningDesc')
  }
])

const testimonials = computed(() => [
  {
    quote: t('testimonials.quote1'),
    author: t('testimonials.author1'),
    role: t('testimonials.role1')
  },
  {
    quote: t('testimonials.quote2'),
    author: t('testimonials.author2'),
    role: t('testimonials.role2')
  },
  {
    quote: t('testimonials.quote3'),
    author: t('testimonials.author3'),
    role: t('testimonials.role3')
  }
])

const currentTestimonial = ref(0)
const totalTestimonials = computed(() => testimonials.value.length)

const activeTestimonial = computed(() => testimonials.value[currentTestimonial.value])

const nextTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 1) % totalTestimonials.value
}

const prevTestimonial = () => {
  currentTestimonial.value =
    (currentTestimonial.value - 1 + totalTestimonials.value) % totalTestimonials.value
}

// Map course titles to course IDs - handle translations
const courseMapping = computed(() => {
  const arMap = {
    [t('course.learnArabic')]: 'c1',
    [t('course.abcLearning')]: 'c2',
    [t('course.123Learning')]: 'c3'
  }
  const enMap = {
    'Learn Arabic': 'c1',
    'Abc Learning': 'c2',
    '123 Learning': 'c3'
  }
  return i18n.locale === 'ar' ? arMap : enMap
})

const viewCourseDetails = (course) => {
  const courseId = courseMapping.value[course.title] || 'c1'
  window.open(`/course-details/${courseId}`, '_blank')
}
</script>

<style scoped>
.hero-section {
  background: url('/assets/images/Hero Section-home.png') center/cover no-repeat;
  min-height: 70vh;
  padding-top: 90px;
  padding-bottom: 120px;
}

.hero-section.hero-flipped {
  transform: scaleX(-1);
}

.hero-section.hero-flipped > * {
  transform: scaleX(-1);
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

.hero-section.hero-flipped .wave-divider svg {
  transform: scaleX(-1);
}

.hero-heading {
  /* font-family: 'Fredoka', 'Segoe UI', sans-serif; */
  font-weight: 800;
  font-size: clamp(2.2rem, 4.8vw, 3.2rem);
  line-height: 1.05;
}

.hero-sub {
  font-size: 0.95rem;
  max-width: 360px;
}

.hero-cta {
  border-radius: 12px;
  padding: 11px 24px;
  color:white;
  background-color:var(--primary);
  font-size: 0.95rem;
}

.section-title {
  /* font-family: 'Fredoka', 'Segoe UI', sans-serif; */
  font-weight: 800;
  color: #0b2a4a;
  font-size: clamp(1.9rem, 3.5vw, 2.4rem);
}

.section-sub {
  color: #5a6a77;
  max-width: 720px;
  margin: 0 auto 1.75rem auto;
  font-size: 0.95rem;
}

.empower-section {
  background: #ffffff;
  padding: 50px 0;
}



.feature-main {
  width: 280px;
  height: 280px;
  object-fit: contain;
  border-radius: 22px;
}


.feature-list {
  display: grid;
  gap: 14px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 13px;
  background: #ffffff;
  border: 2px solid #e0e7ee;
  border-radius: 70px;
  padding: 13px 15px;
  box-shadow: none;
}

.feature-icon img {
  width: 55px;
  height: 55px;
}

.feature-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0b2a4a;
}

.feature-desc {
  margin: 2px 0 0 0;
  color: #5a6a77;
  font-size: 0.9rem;
}

.top-courses-section {
  background: url('/assets/images/OurTopCourses.png') center/cover no-repeat;
  padding: 60px 70px 220px 70px;
}

.decor-bird {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 48px;
  opacity: 0.5;
}

.decor-kite {
  position: absolute;
  top: 12px;
  right: 20px;
  width: 60px;
  opacity: 0.4;
}

.course-card {
  background: #ffffff;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 11px 24px rgba(0, 0, 0, 0.05);
  border: 1px solid #d6e6f2;
  display: flex;
  flex-direction: column;
  gap: 9px;
  height: 100%;
}

.course-img {
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: 11px;
}

.course-title {
  margin: 3px 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #0b2a4a;
}

.course-tags {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.course-tag {
  background: #ffd700;
  color: #000;
  border-radius: 999px;
  padding: 3px 9px;
  font-size: 0.8rem;
  font-weight: 600;
}

.course-text {
  color: #5a6a77;
  font-size: 0.9rem;
  flex: 1;
  line-height: 1.45;
}

.course-btn {
  background: var( --primary-medium);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 9px 13px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.course-btn:hover {
  background: #06679a;
}

.trusted-section {
  background: #ffffff;
  padding: 65px 0 80px 0;
}

.trusted-sun {
  position: absolute;
  top: 10px;
  left: 20px;
  width: 40px;
  opacity: 0.8;
}

.trusted-cloud {
  position: absolute;
  top: 28px;
  right: 24px;
  width: 70px;
  opacity: 0.7;
}

.trusted-image {
  background: #fde7f1;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.trusted-card {
  background: #ffffff;
  border-radius: 17px;
  border: 1px solid #dfe7ef;
  box-shadow: 0 11px 24px rgba(0, 0, 0, 0.05);
  padding: 18px;
}

.trusted-controls {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 11px;
}

.ctrl-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #c2d3e2;
  background: #fff;
  cursor: pointer;
  font-size: 1.15rem;
}

.ctrl-index {
  color: #5a6a77;
  font-weight: 600;
}

.trusted-quote {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  margin-bottom: 11px;
  color: #0b2a4a;
  font-weight: 600;
  font-size: 0.95rem;
}

.trusted-quote img {
  width: 22px;
  height: 22px;
  opacity: 0.8;
}

.trusted-quote p {
  margin: 0;
}

.trusted-author {
  color: #0b2a4a;
  font-weight: 800;
  margin: 0;
}

.trusted-role {
  color: #5a6a77;
  font-weight: 500;
  margin-left: 8px;
}

.feature-item:nth-child(1) { margin-left: -130px; }
.feature-item:nth-child(2) { margin-left: 65px; }
.feature-item:nth-child(3) { margin-left: -130px; }
.feature-item:nth-child(4) { margin-left: 65px; }
.feature-item:nth-child(1),
.feature-item:nth-child(3) {
  width: 380px;
  max-width: 100%;
}
.feature-item:nth-child(2),
.feature-item:nth-child(4) {
  width: 380px;
  max-width: 100%;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 58vh;
    padding-top: 70px;
    padding-bottom: 70px;
  }

  .feature-main {
    width: 210px;
    height: 210px;
  }

  .feature-item,
  .feature-item:nth-child(2),
  .feature-item:nth-child(3),
  .feature-item:nth-child(4) {
    margin-left: 0;
    width: 100%;
  }

  .top-courses-section {
    padding: 60px 20px 150px 20px;
  }

  .empower-section {
    padding: 40px 0;
  }

  .trusted-section {
    padding: 50px 0 65px 0;
  }
}
</style>
