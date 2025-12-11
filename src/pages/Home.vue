<template>
  <!-- Hero Section -->
  <section class="hero-section  position-relative overflow-hidden  text-white">
    <div class="container py-5">
      <div class="row align-items-center g-4">
        <div class="col-md-6">
          <h1 class="fw-bold display-5 mb-3">{{ t('home.title') }}</h1>
          <p class="fs-5 mb-4 opacity-90">{{ t('home.desc') }}</p>
          <router-link to="/courses" class="btn btn-dark btn-lg pill">
            {{ t('home.learnMore') }}
          </router-link>
        </div>
        
      </div>
    </div>
   
  </section>

  <!-- Empowering Young Minds Section -->
  <section class="bg-white py-5">
    <div class="container">
      <h2 class="section-title text-center">{{ t('home.empowering') }}</h2>
      <p class="text-center text-muted mb-4 mx-auto" style="max-width: 680px;">{{ t('home.empowering.subtitle') }}</p>
      <div class="row g-4 align-items-center">
        <div class="col-md-4 d-grid gap-3">
          <div class="card card-soft p-3">
            <div class="d-flex align-items-start gap-3">
              <div class="rounded-circle bg-pink d-flex align-items-center justify-content-center flex-shrink-0" style="width:56px;height:56px;">
                <img src="/assets/images/icon 1.png" alt="icon" class="img-fluid" style="width:32px;height:32px;" />
              </div>
              <div>
                <h3 class="fs-5 text-darkblue mb-1">{{ t('feature.lessons') }}</h3>
                <p class="text-muted small mb-0">{{ t('feature.lessonsDesc') }}</p>
              </div>
            </div>
          </div>
          <div class="card card-soft p-3">
            <div class="d-flex align-items-start gap-3">
              <div class="rounded-circle bg-paleCyan d-flex align-items-center justify-content-center flex-shrink-0" style="width:56px;height:56px;">
                <img src="/assets/images/icon 2.png" alt="icon" class="img-fluid" style="width:32px;height:32px;" />
              </div>
              <div>
                <h3 class="fs-5 text-darkblue mb-1">{{ t('feature.story') }}</h3>
                <p class="text-muted small mb-0">{{ t('feature.storyDesc') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4 text-center">
          <div class="position-relative d-inline-block">
            <div class="bg-pink border border-light p-3 rounded-4" style="width: 240px; height: 240px;">
              <img src="/assets/images/Home-Feature.png" alt="learning" class="img-fluid h-100 w-100 object-fit-cover rounded-3" />
            </div>
            <div class="position-absolute top-0 end-0 rounded-circle bg-paleCyan d-flex align-items-center justify-content-center" style="width:48px;height:48px;">
              <img src="/assets/images/Bird.svg" alt="bird" class="opacity-75" style="width:24px;height:24px;" />
            </div>
          </div>
        </div>
        <div class="col-md-4 d-grid gap-3">
          <div class="card card-soft p-3">
            <div class="d-flex align-items-start gap-3">
              <div class="rounded-circle bg-lightGreen d-flex align-items-center justify-content-center flex-shrink-0" style="width:56px;height:56px;">
                <img src="/assets/images/icon 3.png" alt="icon" class="img-fluid" style="width:32px;height:32px;" />
              </div>
              <div>
                <h3 class="fs-5 text-darkblue mb-1">{{ t('feature.games') }}</h3>
                <p class="text-muted small mb-0">{{ t('feature.gamesDesc') }}</p>
              </div>
            </div>
          </div>
          <div class="card card-soft p-3">
            <div class="d-flex align-items-start gap-3">
              <div class="rounded-circle bg-lightSalmon d-flex align-items-center justify-content-center flex-shrink-0" style="width:56px;height:56px;">
                <img src="/assets/images/icon 4.png" alt="icon" class="img-fluid" style="width:32px;height:32px;" />
              </div>
              <div>
                <h3 class="fs-5 text-darkblue mb-1">{{ t('feature.creative') }}</h3>
                <p class="text-muted small mb-0">{{ t('feature.creativeDesc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Highly Recommended Courses Section -->
  <section class="py-5 position-relative overflow-hidden" style="background: linear-gradient(180deg, #E7F6FF 0%, #cfeefe 100%)">
    <img src="./assets/images/Bird.svg" alt="bird" class="position-absolute top-0 start-0 m-4" style="width: 48px; opacity: 0.4;" />
    <img src="./assets/images/Kite.svg" alt="kite" class="position-absolute top-0 end-0 m-5" style="width: 56px; opacity: 0.4;" />
    <div class="container position-relative">
      <h2 class="section-title text-center">{{ t('recommended.title') }}</h2>
      <p class="text-center text-muted mb-4 mx-auto" style="max-width: 760px;">{{ t('recommended.subtitle') }}</p>
      <div class="row g-3">
        <div v-for="c in sample" :key="c.id" class="col-12 col-md-4">
          <div class="card h-100 border-0 card-soft p-3">
            <img :src="thumbFor(c.id)" class="rounded-3 mb-3 w-100" style="height: 200px; object-fit: cover;" />
            <h3 class="fs-5 text-darkblue mb-2">{{ locale==='en' ? (c.title_en || c.title) : (c.title_ar || c.title) }}</h3>
            <p class="text-muted small mb-3">{{ locale==='en' ? (c.description_en || c.description) : (c.description_ar || c.description) }}</p>
            <div class="d-flex gap-3 text-muted small mb-3">
              <span>{{ t('course.ageLabel') }} {{ c.age || '4-8' }}</span>
              <span>{{ t('course.seatsLabel') }} {{ c.seats || 10 }}</span>
            </div>
            <router-link 
              class="btn w-100"
              :class="{
                'btn-outline-danger': c.id === 'c1',
                'btn-primary': c.id === 'c2',
                'btn-warning text-dark': c.id !== 'c1' && c.id !== 'c2'
              }"
              :to="`/course/${c.id}`"
            >
              {{ t('nav.signup') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Trusted by Parents Section -->
  <section class="bg-white py-5 position-relative">
    <img src="/assets/images/Trusted by parents Sun.svg" alt="sun" class="position-absolute" style="top: -8px; left: 24px; width: 32px; opacity: 0.7;" />
    <img src="/assets/images/Trusted by parents cloude.svg" alt="cloud" class="position-absolute" style="top: 32px; right: 24px; width: 64px; opacity: 0.6;" />
    <div class="container">
      <h2 class="section-title text-center">{{ t('testimonials.title') }}</h2>
      <p class="text-center text-muted mb-4 mx-auto" style="max-width: 640px;">{{ t('testimonials.subtitle') }}</p>
      <div class="row g-4 align-items-center justify-content-center">
        <div class="col-md-5">
          <div class="bg-pink rounded-4 overflow-hidden" style="height: 260px;">
            <img src="/assets/images/Home-Feature.png" alt="family" class="w-100 h-100" style="object-fit: cover;" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="card card-soft border-0 p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <button class="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width:36px;height:36px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span class="text-muted small">01 / 03</span>
              <button class="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width:36px;height:36px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div class="d-flex align-items-start gap-3 mb-3">
              <img src="/assets/images/Trusted by parents Quotes.svg" alt="quotes" style="width:24px;height:24px; opacity:0.7;" />
              <p class="text-muted fs-6 fst-italic mb-0">"{{ t('testimonials.quote') }}"</p>
            </div>
            <p class="text-darkblue fw-bold mb-0">- {{ t('testimonials.author') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import { useI18nStore } from '@/stores/i18n.js'

const store = useCoursesStore()
const sample = ref([])
const i18n = useI18nStore()
const t = i18n.t
const locale = i18n.locale

const thumbFor = (id) => {
  if (id === 'c1') return '/assets/images/icon 1.png'
  if (id === 'c2') return '/assets/images/icon 2.png'
  return '/assets/images/icon 3.png'
}

onMounted(() => {
  store.load()
  sample.value = store.courses.slice(0, 3)
})
</script>

<style scoped>
.hero-section {
  background: url('/assets/images/Hero Section-home.png') center/cover no-repeat;
  min-height: 70vh;
  padding-top: 100px;
  padding-bottom: 120px;
  position: relative;
}

</style>
