<template>
  <section class="container mx-auto px-4 py-10">
    <h2 class="section-title text-center">{{ t('play.title') }}</h2>
    <p class="text-center text-gray-600 mb-8">{{ t('play.subtitle') }}</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card text-center">
        <div class="w-16 h-16 bg-pink rounded-full grid place-items-center text-darkblue font-fredoka text-3xl mx-auto mb-4">🎮</div>
        <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ t('play.games') }}</h3>
        <p class="text-gray-600">{{ t('play.gamesDesc') }}</p>
      </div>
      <div class="card text-center">
        <div class="w-16 h-16 bg-lightGreen rounded-full grid place-items-center text-darkblue font-fredoka text-3xl mx-auto mb-4">🎯</div>
        <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ t('play.activities') }}</h3>
        <p class="text-gray-600">{{ t('play.activitiesDesc') }}</p>
      </div>
      <div class="card text-center">
        <div class="w-16 h-16 bg-gold rounded-full grid place-items-center text-darkblue font-fredoka text-3xl mx-auto mb-4">🏆</div>
        <h3 class="font-fredoka text-xl text-darkblue mb-2">{{ t('play.challenges') }}</h3>
        <p class="text-gray-600">{{ t('play.challengesDesc') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18nStore } from '@/stores/i18n.js'
const i18n = useI18nStore()
const t = i18n.t
</script>

