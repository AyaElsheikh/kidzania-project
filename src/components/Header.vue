<template>
  <header class="bg-darkblue shadow-card">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center">
        <img src="/assets/Logo.png" alt="Kidzademy" class="h-12 w-auto object-contain" />
      </router-link>
      <nav class="hidden md:flex items-center gap-6 font-rubik">
        <router-link 
          to="/" 
          class="text-white hover:text-green transition"
          :class="{ 'text-green underline': $route.path === '/' }"
        >
          {{ t('nav.home') }}
        </router-link>
        <router-link 
          to="/tests" 
          class="text-white hover:text-green transition"
          :class="{ 'text-green underline': $route.path === '/tests' }"
        >
          {{ t('nav.tests') }}
        </router-link>
        <router-link 
          to="/profile" 
          class="text-white hover:text-green transition"
          :class="{ 'text-green underline': $route.path === '/profile' }"
        >
          {{ t('nav.myCourses') }}
        </router-link>
        <router-link 
          to="/courses" 
          class="text-white hover:text-green transition"
          :class="{ 'text-green underline': $route.path.startsWith('/courses') }"
        >
          {{ t('nav.explore') }}
        </router-link>
        <router-link 
          to="/play" 
          class="text-white hover:text-green transition"
          :class="{ 'text-green underline': $route.path === '/play' }"
        >
          {{ t('nav.playWithUs') }}
        </router-link>
      </nav>
      <div class="flex items-center gap-3">
        <router-link to="/auth" class="px-4 py-2 rounded-lg font-fredoka text-white bg-paleCyan hover:bg-deepSkyBlue transition">
          {{ t('nav.register') }}
        </router-link>
        <div class="w-10 h-10 bg-lightGreen rounded-full grid place-items-center text-darkblue">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useI18nStore } from '@/stores/i18n.js'
import { useRoute } from 'vue-router'

const i18n = useI18nStore()
const route = useRoute()
const t = i18n.t
</script>
