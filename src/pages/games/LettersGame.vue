<template>
  <div class="kidz-game">
    <GamesHero title-key="games.letters.title" subtitle-key="games.letters.subtitle" />

    <div class="kidz-shell">
      <div class="kidz-panel" :class="{ 'kidz-win': done }">
        <div class="kidz-info">
          <div class="d-flex flex-wrap align-items-center gap-2">
            <span class="kidz-pill">{{ t('games.common.level') }}: {{ levelId }}</span>
            <span class="kidz-pill secondary">{{ t('games.common.progress') }}: {{ matchedPairs }}/{{ totalPairs }}</span>
            <span class="kidz-pill secondary">{{ t('games.common.tip') }}: {{ t('games.letters.howTo') }}</span>
          </div>
          <div class="d-flex flex-wrap align-items-center gap-2">
            <button class="kidz-btn ghost" type="button" @click="reset">{{ t('games.common.restart') }}</button>
            <button class="kidz-btn ghost" type="button" @click="router.push('/levels')">{{ t('games.common.backToLevels') }}</button>
          </div>
        </div>

        <div class="lg-body">
          <div v-if="done" class="lg-banner">{{ t('games.win') }}</div>

          <div class="lg-grid">
            <button
              v-for="c in cards"
              :key="c.id"
              type="button"
              class="lg-card"
              :class="{ flipped: c.flipped || c.matched }"
              :disabled="c.matched"
              @click="flip(c)"
            >
              <div class="lg-card-inner">
                <div class="lg-front"></div>
                <div class="lg-back">{{ c.letter }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.js'
import GamesHero from '@/components/games/GamesHero.vue'

const route = useRoute()
const router = useRouter()
const i18n = useI18nStore()
const t = i18n.t

const levelId = computed(() => Number(route.params.levelId || 1))

const cards = ref([])
const opened = ref([]) // ids of currently flipped (max 2)
const lock = ref(false)
const moves = ref(0)

function buildLetters() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const start = (levelId.value - 1) * 3
  const letters = alphabet.slice(start, start + 3)
  return letters.length ? letters : ['A', 'B', 'C']
}

function init() {
  lock.value = false
  opened.value = []
  moves.value = 0
  const letters = buildLetters()
  const deck = [...letters, ...letters]
    .sort(() => Math.random() - 0.5)
    .map((letter, idx) => ({ id: `${levelId.value}-${idx}`, letter, flipped: false, matched: false }))
  cards.value = deck
}

watch(levelId, init, { immediate: true })

const done = computed(() => cards.value.length > 0 && cards.value.every(c => c.matched))

function flip(card) {
  if (lock.value) return
  if (card.flipped || card.matched) return
  if (opened.value.length >= 2) return

  card.flipped = true
  opened.value.push(card.id)
  moves.value += 1

  if (opened.value.length === 2) {
    const [aId, bId] = opened.value
    const a = cards.value.find(c => c.id === aId)
    const b = cards.value.find(c => c.id === bId)
    if (!a || !b) {
      opened.value = []
      return
    }

    if (a.letter === b.letter) {
      a.matched = true
      b.matched = true
      opened.value = []
    } else {
      lock.value = true
      window.setTimeout(() => {
        a.flipped = false
        b.flipped = false
        opened.value = []
        lock.value = false
      }, 650)
    }
  }
}

function reset() {
  init()
}

const totalPairs = computed(() => Math.floor(cards.value.length / 2))
const matchedPairs = computed(() => Math.floor(cards.value.filter(c => c.matched).length / 2))
</script>

<style scoped>
@import './_gameTheme.css';

.lg-body {
  padding: 16px;
  display: grid;
  gap: 14px;
}
.lg-banner {
  background: rgba(22,163,74,0.12);
  color: #16a34a;
  border: 1px solid rgba(22,163,74,0.25);
  padding: 12px 14px;
  border-radius: 16px;
  text-align: center;
  font-weight: 900;
}
.lg-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
@media (max-width: 720px) { .lg-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 520px) { .lg-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.lg-card {
  border: none;
  background: transparent;
  padding: 0;
}
.lg-card-inner {
  height: 110px;
  border-radius: 18px;
  border: 1px solid rgba(3,59,98,0.10);
  box-shadow: 0 18px 40px rgba(3,59,98,0.10);
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.35s ease;
}
.lg-card.flipped .lg-card-inner { transform: rotateY(180deg); }
.lg-front, .lg-back {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 2rem;
  backface-visibility: hidden;
}
.lg-front {
  background:
    radial-gradient(260px 120px at 20% 20%, rgba(255,192,203,0.55), transparent 60%),
    radial-gradient(260px 120px at 85% 40%, rgba(129,223,255,0.65), transparent 60%),
    linear-gradient(135deg, var(--primary-medium), #00a6e6);
  color: #fff;
}
.lg-back {
  background: rgba(255,255,255,0.92);
  color: var(--primary);
  transform: rotateY(180deg);
}
</style>


