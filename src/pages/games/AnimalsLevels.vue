<template>
  <div class="kg-page">
    <GamesHero title-key="games.animals.title" subtitle-key="games.animals.subtitle" />

    <div class="kg-shell">
      <div class="kg-top">
        <div class="kg-help">
          <p>{{ t('games.animals.howTo') }}</p>
          <button class="btn btn-secondary kg-back" type="button" @click="router.push('/play')">
            {{ t('games.common.backToGames') }}
          </button>
        </div>
      </div>

      <div class="kg-grid">
        <div v-for="lvl in levels" :key="lvl.id" class="kg-card" @click="goToGame(lvl.id)">
          <div class="kg-thumb">
            <img src="/assets/games/discoverAnimals.jpg" alt="" />
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
    { id: 1, items: [{ en: 'Cow', ar: 'بقرة' }, { en: 'Sheep', ar: 'خروف' }, { en: 'Fish', ar: 'سمكة' }] },
    { id: 2, items: [{ en: 'Rabbit', ar: 'أرنب' }, { en: 'Duck', ar: 'بطة' }, { en: 'Horse', ar: 'حصان' }] },
    { id: 3, items: [{ en: 'Donkey', ar: 'حمار' }, { en: 'Bear', ar: 'دب' }, { en: 'Whale', ar: 'حوت' }] },
    { id: 4, items: [{ en: 'Elephant', ar: 'فيل' }, { en: 'Chicken', ar: 'دجاجة' }, { en: 'Giraffe', ar: 'زرافة' }] }
  ]
  return list.map(l => ({ ...l, itemsText: l.items.map(x => (isAr ? x.ar : x.en)).join(' • ') }))
})

function goToGame(levelId) {
  router.push({ name: 'animals-game', params: { levelId: String(levelId) } })
}
</script>

<style scoped>
@import './_sharedGameStyles.css';
</style>


