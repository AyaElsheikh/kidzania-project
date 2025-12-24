<template>
  <div class="kg-page">
    <GamesHero title-key="games.letters.title" subtitle-key="games.letters.subtitle" />

    <div class="kg-shell">
      <div class="kg-top">
        <div class="kg-help">
          <p>{{ t('games.letters.howTo') }}</p>
          <button class="btn btn-secondary kg-back" type="button" @click="router.push('/play')">
            {{ t('games.common.backToGames') }}
          </button>
        </div>
      </div>

      <div class="kg-grid">
        <div v-for="lvl in levels" :key="lvl.id" class="kg-card" @click="goToGame(lvl.id)">
          <div class="kg-thumb">
            <img src="/assets/games/funWithLetters.png" alt="" />
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
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const chunk = 3
  const out = []
  let id = 1
  for (let i = 0; i < alphabet.length; i += chunk) {
    const items = alphabet.slice(i, i + chunk)
    out.push({ id: id++, items, itemsText: items.join(' • ') })
  }
  return out.slice(0, 8) // keep UI compact
})

function goToGame(levelId) {
  router.push({ name: 'letters-game', params: { levelId: String(levelId) } })
}
</script>

<style scoped>
@import './_sharedGameStyles.css';
</style>


