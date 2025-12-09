<template>
  <!-- Hero Section -->
  <section class="relative overflow-hidden bg-deepSkyBlue min-h-[600px] flex items-center">
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-10 right-10 text-6xl">☀️</div>
      <div class="absolute top-20 left-20 text-4xl">🎈</div>
      <div class="absolute bottom-20 left-10 text-3xl">✏️</div>
      <div class="absolute top-40 right-1/4 text-4xl">🪁</div>
    </div>
    <div class="relative container mx-auto px-4 py-16 grid md:grid-cols-2 items-center gap-8">
      <div class="text-white">
        <h1 class="font-fredoka text-4xl md:text-6xl mb-4">{{ t('home.title') }}</h1>
        <p class="text-lg md:text-xl mb-6 opacity-90">{{ t('home.desc') }}</p>
        <router-link to="/courses" class="inline-block px-6 py-3 bg-darkblue text-white rounded-lg font-fredoka hover:bg-opacity-90 transition">
          {{ t('home.learnMore') }}
        </router-link>
      </div>
      <div class="grid place-items-center relative">
        <div class="relative w-full max-w-md">
          <div class="absolute -bottom-10 -left-10 w-72 h-72 bg-white rounded-full opacity-30 blur-3xl"></div>
          <div class="relative z-10">
            <img src="/assets/hero.svg" alt="kids" class="w-full drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Empowering Young Minds Section -->
  <section class="bg-white py-16">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">{{ t('home.empowering') }}</h2>
      <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{{ t('home.empowering.subtitle') }}</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div class="grid gap-6">
          <div class="card">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 bg-pink rounded-full grid place-items-center text-darkblue font-fredoka text-2xl flex-shrink-0">
                🧪
              </div>
              <div>
                <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ t('feature.lessons') }}</h3>
                <p class="text-gray-600 text-sm">{{ t('feature.lessonsDesc') }}</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 bg-paleCyan rounded-full grid place-items-center text-darkblue font-fredoka text-2xl flex-shrink-0">
                ✂️
              </div>
              <div>
                <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ t('feature.story') }}</h3>
                <p class="text-gray-600 text-sm">{{ t('feature.storyDesc') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="grid place-items-center">
          <div class="relative">
            <div class="w-64 h-64 bg-pink rounded-2xl border-4 border-pink p-4">
              <img src="/assets/center.svg" alt="learning" class="w-full h-full object-cover rounded-xl" />
            </div>
            <div class="absolute -top-4 -right-4 w-12 h-12 bg-paleCyan rounded-full grid place-items-center text-2xl">
              ☁️
            </div>
          </div>
        </div>
        <div class="grid gap-6">
          <div class="card">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 bg-lightGreen rounded-full grid place-items-center text-darkblue font-fredoka text-2xl flex-shrink-0">
                🍎
              </div>
              <div>
                <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ t('feature.games') }}</h3>
                <p class="text-gray-600 text-sm">{{ t('feature.gamesDesc') }}</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 bg-lightSalmon rounded-full grid place-items-center text-darkblue font-fredoka text-2xl flex-shrink-0">
                📢
              </div>
              <div>
                <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ t('feature.creative') }}</h3>
                <p class="text-gray-600 text-sm">{{ t('feature.creativeDesc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Highly Recommended Courses Section -->
  <section class="py-16 relative overflow-hidden" style="background: linear-gradient(180deg, #E7F6FF 0%, #cfeefe 100%)">
    <div class="absolute top-10 left-10 text-4xl opacity-30">🐦</div>
    <div class="absolute top-20 right-20 text-4xl opacity-30">🪁</div>
    <div class="container mx-auto px-4 relative z-10">
      <h2 class="section-title text-center">{{ t('recommended.title') }}</h2>
      <p class="text-center text-gray-600 mb-12 max-w-3xl mx-auto">{{ t('recommended.subtitle') }}</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="c in sample" :key="c.id" class="card border-2 border-dashed border-gray-300">
          <img :src="c.thumbnail" class="w-full h-48 object-cover rounded-xl mb-4" />
          <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ locale==='en' ? (c.title_en || c.title) : (c.title_ar || c.title) }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ locale==='en' ? (c.description_en || c.description) : (c.description_ar || c.description) }}</p>
          <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>{{ t('course.ageLabel') }} {{ c.age || '4-8' }}</span>
            <span>{{ t('course.seatsLabel') }} {{ c.seats || 10 }}</span>
          </div>
          <router-link 
            class="block w-full text-center px-4 py-2 rounded-lg font-fredoka transition"
            :class="c.id === 'c1' ? 'bg-pink text-darkblue hover:bg-pink/80' : c.id === 'c2' ? 'bg-deepSkyBlue text-white hover:bg-deepSkyBlue/80' : 'bg-lightSalmon text-darkblue hover:bg-lightSalmon/80'"
            :to="`/course/${c.id}`"
          >
            {{ t('nav.signup') }}
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Trusted by Parents Section -->
  <section class="bg-white py-16">
    <div class="container mx-auto px-4">
      <h2 class="section-title text-center">{{ t('testimonials.title') }}</h2>
      <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{{ t('testimonials.subtitle') }}</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
        <div class="relative bg-pink rounded-2xl h-80 flex items-center justify-center">
          <div class="text-center text-darkblue">
            <div class="text-6xl mb-4">👨‍👩‍👧</div>
            <p class="font-fredoka text-xl">Parent & Child</p>
          </div>
        </div>
        <div class="card border-2 border-dashed border-gray-300 relative">
          <div class="flex items-center gap-2 mb-4">
            <button class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-darkblue transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span class="text-sm text-gray-600 font-rubik">01 / 03</span>
            <button class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-darkblue transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p class="text-gray-700 text-lg mb-6 italic">"{{ t('testimonials.quote') }}"</p>
          <p class="text-darkblue font-fredoka">- {{ t('testimonials.author') }}</p>
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

onMounted(() => {
  store.load()
  sample.value = store.courses.slice(0, 3)
})
</script>
