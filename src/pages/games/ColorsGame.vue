<template>
  <div class="kidz-game">
    <GamesHero title-key="games.colors.title" subtitle-key="games.colors.subtitle" />

    <div class="kidz-shell">
      <div class="kidz-panel" :class="{ 'kidz-win': done }">
        <div class="kidz-info">
          <div class="d-flex flex-wrap align-items-center gap-2">
            <span class="kidz-pill">{{ t('games.common.level') }}: {{ levelId }}</span>
            <span class="kidz-pill secondary">{{ t('games.common.progress') }}: {{ matchedIds.size }}/{{ swatches.length }}</span>
            <span class="kidz-pill secondary">{{ t('games.common.tip') }}: {{ t('games.colors.howTo') }}</span>
          </div>
          <div class="d-flex flex-wrap align-items-center gap-2">
            <button class="kidz-btn ghost" type="button" @click="reset">{{ t('games.common.restart') }}</button>
            <button class="kidz-btn ghost" type="button" @click="router.push('/colors-levels')">{{ t('games.common.backToLevels') }}</button>
          </div>
        </div>

        <div class="cg-body">
          <div v-if="done" class="cg-banner">{{ t('games.win') }}</div>
          <div v-if="showPickFirst" class="cg-hint">{{ t('games.colors.pickFirst') }}</div>

          <div class="cg-names">
            <div class="cg-names-grid">
              <button
                v-for="n in names"
                :key="n.id"
                type="button"
                class="cg-name"
                :class="{ active: selectedId === n.id, matched: matchedIds.has(n.id) }"
                :disabled="matchedIds.has(n.id)"
                @click="selectedId = n.id"
              >
                {{ n.label }}
              </button>
            </div>
          </div>

          <div class="cg-swatches">
            <div
              v-for="s in swatches"
              :key="s.id"
              class="cg-swatch"
              :class="{ matched: matchedIds.has(s.id) }"
              :style="{ background: s.value }"
              role="button"
              tabindex="0"
              @click="pickSwatch(s.id)"
              @keydown.enter="pickSwatch(s.id)"
            >
              <span v-if="matchedIds.has(s.id)" class="cg-check">✓</span>
            </div>
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

const levelId = computed(() => String(route.params.levelId || '1'))

const LEVELS = {
  '1': [
    { id: 'red', en: 'Red', ar: 'أحمر', value: '#ef4444' },
    { id: 'blue', en: 'Blue', ar: 'أزرق', value: '#3b82f6' },
    { id: 'green', en: 'Green', ar: 'أخضر', value: '#22c55e' },
    { id: 'yellow', en: 'Yellow', ar: 'أصفر', value: '#facc15' }
  ],
  '2': [
    { id: 'orange', en: 'Orange', ar: 'برتقالي', value: '#f97316' },
    { id: 'purple', en: 'Purple', ar: 'بنفسجي', value: '#a855f7' },
    { id: 'pink', en: 'Pink', ar: 'وردي', value: '#ec4899' },
    { id: 'brown', en: 'Brown', ar: 'بني', value: '#a16207' }
  ],
  '3': [
    { id: 'black', en: 'Black', ar: 'أسود', value: '#0f172a' },
    { id: 'white', en: 'White', ar: 'أبيض', value: '#ffffff' },
    { id: 'gray', en: 'Gray', ar: 'رمادي', value: '#94a3b8' },
    { id: 'cyan', en: 'Cyan', ar: 'سماوي', value: '#06b6d4' }
  ],
  '4': [
    { id: 'lime', en: 'Lime', ar: 'ليموني', value: '#84cc16' },
    { id: 'navy', en: 'Navy', ar: 'كحلي', value: '#1e3a8a' },
    { id: 'teal', en: 'Teal', ar: 'تركواز', value: '#14b8a6' },
    { id: 'gold', en: 'Gold', ar: 'ذهبي', value: '#f59e0b' }
  ]
}

const swatches = ref([])
const names = ref([])
const selectedId = ref('')
const matchedIds = ref(new Set())
const showPickFirst = ref(false)

function init() {
  const set = LEVELS[levelId.value] || LEVELS['1']
  const isAr = i18n.locale === 'ar'
  swatches.value = [...set].map(s => ({ id: s.id, value: s.value, label: isAr ? s.ar : s.en })).sort(() => Math.random() - 0.5)
  names.value = [...set].map(s => ({ id: s.id, label: isAr ? s.ar : s.en })).sort(() => Math.random() - 0.5)
  selectedId.value = ''
  matchedIds.value = new Set()
  showPickFirst.value = false
}

watch([levelId, () => i18n.locale], init, { immediate: true })

const done = computed(() => matchedIds.value.size === swatches.value.length && swatches.value.length > 0)

function pickSwatch(id) {
  if (!selectedId.value) {
    showPickFirst.value = true
    window.setTimeout(() => { showPickFirst.value = false }, 900)
    return
  }
  if (selectedId.value !== id) return
  matchedIds.value = new Set([...matchedIds.value, id])
  selectedId.value = ''
}

function reset() {
  init()
}
</script>

<style scoped>
@import './_gameTheme.css';

.cg-body {
  padding: 16px;
  display: grid;
  gap: 14px;
}
.cg-banner {
  background: rgba(22,163,74,0.12);
  color: #16a34a;
  border: 1px solid rgba(22,163,74,0.25);
  padding: 12px 14px;
  border-radius: 16px;
  text-align: center;
  font-weight: 900;
}
.cg-hint {
  background: rgba(255,192,203,0.24);
  border: 1px solid rgba(255,160,122,0.25);
  color: rgba(3,59,98,0.9);
  padding: 10px 12px;
  border-radius: 16px;
  font-weight: 900;
  text-align: center;
}
.cg-names { background: rgba(255,255,255,0.82); border: 1px solid rgba(3,59,98,0.08); border-radius: 18px; padding: 12px; box-shadow: 0 14px 28px rgba(3,59,98,0.08); }
.cg-names-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.cg-name {
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 900;
  border: 2px solid rgba(0, 191, 255, 0.22);
  background: rgba(255,255,255,0.95);
  color: var(--primary);
  box-shadow: 0 10px 20px rgba(3,59,98,0.08);
}
.cg-name.active { border-color: var(--primary-medium); box-shadow: 0 0 0 4px rgba(0,191,255,0.15); }
.cg-name.matched { opacity: 0.55; }
.cg-swatches {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
@media (max-width: 720px) { .cg-swatches { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.cg-swatch {
  border-radius: 18px;
  height: 120px;
  cursor: pointer;
  border: 3px solid rgba(3,59,98,0.10);
  display: grid;
  place-items: center;
  box-shadow: 0 18px 40px rgba(3,59,98,0.10);
  transition: transform 0.18s ease;
}
.cg-swatch:hover { transform: translateY(-3px); }
.cg-swatch.matched { border-color: rgba(22,163,74,0.6); transform: translateY(-1px); }
.cg-check {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: rgba(255,255,255,0.85);
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 900;
  color: #16a34a;
}
</style>


