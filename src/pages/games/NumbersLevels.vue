<template>
  <div class="kg-page">
    <GamesHero title-key="games.numbers.title" subtitle-key="games.numbers.subtitle" />

    <div class="kg-shell">
      <div class="kg-top">
        <div class="kg-help">
          <p>{{ t('games.numbers.howTo') }}</p>
          <button class="btn btn-secondary kg-back" type="button" @click="router.push('/play')">
            {{ t('games.common.backToGames') }}
          </button>
        </div>
      </div>

      <div class="kg-grid">
        <div v-for="lvl in levels" :key="lvl.id" class="kg-card" @click="goToGame(lvl.id)">
          <div class="kg-thumb">
            <img src="/assets/games/funWithNumbers.png" alt="" />
            <div class="kg-badge">{{ t('games.common.level') }} {{ lvl.id }}</div>
          </div>
          <div class="kg-body">
            <h3 class="kg-card-title">{{ t('games.common.level') }} {{ lvl.id }}</h3>
            <div class="kg-card-body">{{ lvl.itemsText }}</div>
            <button class="kg-btn" type="button">{{ t('games.common.start') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.js'
import GamesHero from '@/components/games/GamesHero.vue'

const router = useRouter()
const i18n = useI18nStore()
const t = i18n.t

const levels = computed(() => {
  const isAr = i18n.locale === 'ar'
  const list = [
    { id: 1, items: ['1', '2', '3'] },
    { id: 2, items: ['4', '5', '6'] },
    { id: 3, items: ['7', '8', '9'] },
    { id: 4, items: ['10', '11', '12'] }
  ]
  // Arabic numerals are same for kids; keep as-is
  return list.map(l => ({ ...l, itemsText: (isAr ? l.items : l.items).join(' • ') }))
})

function goToGame(levelId) {
  router.push({ name: 'numbers-game', params: { levelId: String(levelId) } })
}
</script>

<style scoped>
@import './_sharedGameStyles.css';
</style>


