<template>
  <div class="kidz-game">
    <GamesHero
      v-if="titleKey"
      :title-key="titleKey"
      :subtitle-key="subtitleKey"
    />
    <GamesHero
      v-else
      title-key="play.title"
      :subtitle-key="subtitleKey"
    />

    <div class="kidz-shell">
      <div class="kidz-panel" :class="{ 'kidz-win': gameCompleted }">
        <div class="kidz-info">
          <div class="d-flex flex-wrap align-items-center gap-2">
            <span class="kidz-pill">
              {{ t('games.common.progress') }}: {{ matchedCount }}/{{ totalCount }}
            </span>
            <span class="kidz-pill secondary">
              {{ t('games.common.level') }}: {{ currentLevelLabel }}
            </span>
          </div>

          <div class="d-flex flex-wrap align-items-center gap-2">
            <button v-if="gameCompleted && hasNext" class="kidz-btn primary" type="button" @click="nextLevel">
              {{ t('games.common.nextLevel') }}
            </button>
            <button class="kidz-btn ghost" type="button" @click="resetGame">
              {{ t('games.common.restart') }}
            </button>
            <button class="kidz-btn ghost" type="button" @click="goBack">
              {{ t('games.common.backToLevels') }}
            </button>
          </div>
        </div>

        <div class="gm-body">
          <div class="gm-instructions">
            <div class="gm-instructions-title">{{ t('games.common.howToPlay') }}</div>
            <div class="gm-instructions-text">{{ howToText }}</div>
          </div>

          <div v-if="gameCompleted" class="gm-banner">
            {{ successTextComputed }}
          </div>

          <div class="gm-names">
            <div class="gm-names-title">{{ labelTitleComputed }}</div>
            <div class="gm-chips">
              <div
                v-for="item in draggables"
                :key="item.key"
                class="gm-chip"
                :class="{ matched: item.matched }"
                draggable="true"
                @dragstart="onDragStart($event, item)"
                v-show="!item.matched"
              >
                {{ item.label }}
              </div>
            </div>
          </div>

          <div class="gm-grid">
            <div
              v-for="t in targets"
              :key="t.key"
              class="gm-card"
              :class="{ flash: flashKey === t.key, shake: shakeKey === t.key }"
              @dragover.prevent
              @drop="onDrop($event, t)"
            >
              <div class="gm-img-wrap">
                <img v-if="t.imageUrl" :src="t.imageUrl" :alt="t.altText || ''" class="gm-img" />
                <div v-else class="gm-img-fallback">?</div>
              </div>
              <div class="gm-drop">
                <span v-if="!t.matchedLabel">?</span>
                <span v-else class="gm-matched">{{ t.matchedLabel }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.js'
import GamesHero from '@/components/games/GamesHero.vue'

const props = defineProps({
  titleKey: { type: String, default: '' },
  subtitleKey: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  howTo: { type: String, default: '' },
  howToKey: { type: String, default: '' },
  successText: { type: String, default: '' },
  labelTitle: { type: String, default: '' },
  labelTitleKey: { type: String, default: '' },
  levelsRoute: { type: String, required: true },
  levelId: { type: [String, Number], required: true },
  levels: { type: Array, required: true } // [{ id, items: [{ answer,label,imageUrl }] }]
})

const router = useRouter()
const i18n = useI18nStore()
const t = i18n.t

const draggedKey = ref('')
const gameCompleted = ref(false)
const flashKey = ref('')
const shakeKey = ref('')

const levelIndex = computed(() => {
  const id = String(props.levelId)
  return props.levels.findIndex(l => String(l.id) === id)
})
const level = computed(() => props.levels[levelIndex.value] || props.levels[0])
const currentLevelLabel = computed(() => String(level.value?.id ?? '1'))

const draggables = ref([])
const targets = ref([])

function init() {
  gameCompleted.value = false
  draggedKey.value = ''
  flashKey.value = ''
  shakeKey.value = ''

  const items = (level.value?.items || []).map((x) => ({
    key: String(x.key || x.answer),
    label: String(x.label || x.answer),
    answer: String(x.answer),
    imageUrl: x.imageUrl || '',
    matched: false,
    altText: String(x.altText || x.label || x.answer || '')
  }))

  // shuffle
  const shuffled = [...items].sort(() => Math.random() - 0.5)
  draggables.value = shuffled.map(i => ({ key: i.key, label: i.label, answer: i.answer, matched: false }))

  targets.value = items.map(i => ({
    key: i.key,
    answer: i.answer,
    imageUrl: i.imageUrl,
    matchedLabel: '',
    altText: i.altText
  }))
}

watch(level, init, { immediate: true })

function onDragStart(e, item) {
  draggedKey.value = item.key
  try { e.dataTransfer?.setData('text/plain', item.key) } catch {}
}

function onDrop(e, target) {
  const key = (e?.dataTransfer?.getData?.('text/plain') || draggedKey.value || '').trim()
  if (!key) return
  const drag = draggables.value.find(d => d.key === key)
  if (!drag || drag.matched) return

  // accept only correct match
  if (drag.answer !== target.answer) {
    shakeKey.value = target.key
    window.setTimeout(() => { if (shakeKey.value === target.key) shakeKey.value = '' }, 420)
    return
  }

  drag.matched = true
  target.matchedLabel = drag.label
  flashKey.value = target.key
  window.setTimeout(() => { if (flashKey.value === target.key) flashKey.value = '' }, 520)

  if (targets.value.every(t => !!t.matchedLabel)) {
    gameCompleted.value = true
  }
}

function resetGame() {
  init()
}

const hasNext = computed(() => levelIndex.value >= 0 && levelIndex.value < props.levels.length - 1)
function nextLevel() {
  if (!hasNext.value) return
  const next = props.levels[levelIndex.value + 1]
  router.push({ name: router.currentRoute.value.name, params: { levelId: String(next.id) } })
}

function goBack() {
  router.push(props.levelsRoute)
}

const totalCount = computed(() => targets.value.length)
const matchedCount = computed(() => targets.value.filter(t => !!t.matchedLabel).length)

const howToText = computed(() => {
  if (props.howToKey) return t(props.howToKey)
  if (props.howTo) return props.howTo
  return ''
})

const labelTitleComputed = computed(() => {
  if (props.labelTitleKey) return t(props.labelTitleKey)
  if (props.labelTitle) return props.labelTitle
  return t('games.common.matched')
})

const successTextComputed = computed(() => props.successText || t('games.win'))
</script>

<style scoped>
@import './_gameTheme.css';

.gm-body {
  padding: 16px;
  display: grid;
  gap: 14px;
}

.gm-instructions {
  background: rgba(217,245,255,0.55);
  border: 1px solid rgba(0,191,255,0.18);
  border-radius: 18px;
  padding: 12px 14px;
}
.gm-instructions-title {
  font-weight: 900;
  color: var(--primary);
  margin-bottom: 6px;
}
.gm-instructions-text {
  font-weight: 700;
  color: rgba(3,59,98,0.86);
}

.gm-banner {
  background: rgba(22,163,74,0.12);
  color: #16a34a;
  border: 1px solid rgba(22,163,74,0.25);
  padding: 12px 14px;
  border-radius: 16px;
  text-align: center;
  font-weight: 900;
}

.gm-names {
  background: rgba(255,255,255,0.82);
  border: 1px solid rgba(3,59,98,0.08);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 14px 28px rgba(3,59,98,0.08);
}
.gm-names-title {
  text-align: center;
  font-weight: 900;
  color: var(--primary);
  margin-bottom: 10px;
}

.gm-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.gm-chip {
  user-select: none;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.95);
  border: 2px solid rgba(0, 191, 255, 0.22);
  color: var(--primary);
  font-weight: 900;
  cursor: grab;
  box-shadow: 0 10px 20px rgba(3,59,98,0.08);
  transition: transform 0.16s ease;
}
.gm-chip:hover { transform: translateY(-2px); }
.gm-chip:active { transform: translateY(0); cursor: grabbing; }
.gm-chip.matched {
  opacity: 0.45;
  cursor: default;
}
.gm-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 820px) {
  .gm-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 520px) {
  .gm-grid { grid-template-columns: 1fr; }
}
.gm-card {
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(3,59,98,0.10);
  border-radius: 18px;
  padding: 12px;
  box-shadow: 0 18px 40px rgba(3,59,98,0.10);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.gm-card.flash {
  box-shadow: 0 20px 44px rgba(34,197,94,0.20);
  transform: translateY(-2px);
  border-color: rgba(34,197,94,0.35);
}
.gm-card.shake {
  animation: shake 0.35s ease-in-out;
  border-color: rgba(239,68,68,0.35);
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
.gm-img-wrap {
  width: 100%;
  height: 160px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(217,245,255,0.65);
  display: grid;
  place-items: center;
}
.gm-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.gm-img-fallback {
  font-size: 44px;
  color: #94a3b8;
  font-weight: 900;
}
.gm-drop {
  margin-top: 10px;
  background: rgba(217,245,255,0.40);
  border: 1px dashed rgba(3,59,98,0.22);
  border-radius: 14px;
  height: 54px;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: var(--primary);
}
.gm-matched {
  color: #16a34a;
}
</style>


