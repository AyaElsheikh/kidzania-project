<template>
  <div
    class="kvp"
    :class="{ 'kvp--idle': controlsHidden }"
    tabindex="0"
    @mousemove="poke()"
    @mouseleave="hideSoon()"
    @keydown="onKeydown"
  >
    <video
      ref="videoEl"
      class="kvp-video"
      :src="src"
      :poster="poster"
      playsinline
      preload="metadata"
      @loadedmetadata="onLoadedMeta"
      @timeupdate="onTimeUpdate"
      @progress="onProgress"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="onEnded"
      @click="togglePlay"
    />

    <div class="kvp-overlay" aria-hidden="true"></div>

    <button class="kvp-center" type="button" @click="togglePlay" :aria-label="isPlaying ? t('cp.controls.pause') : t('cp.controls.play')">
      <span v-if="!isPlaying">▶</span>
      <span v-else>❚❚</span>
    </button>

    <div class="kvp-controls" role="group" :aria-label="t('cp.controls.title')">
      <div class="kvp-progress">
        <div class="kvp-track" aria-hidden="true">
          <div class="kvp-buffer" :style="{ width: bufferedPct + '%' }"></div>
          <div class="kvp-played" :style="{ width: playedPct + '%' }"></div>
        </div>
        <input
          class="kvp-range"
          type="range"
          min="0"
          :max="duration || 0"
          step="0.1"
          :value="currentTime"
          @input="onScrub($event)"
          @change="onScrubEnd($event)"
          :aria-label="t('cp.controls.seek')"
        />
      </div>

      <div class="kvp-row">
        <div class="kvp-left">
          <button class="kvp-btn" type="button" @click="togglePlay" :aria-label="isPlaying ? t('cp.controls.pause') : t('cp.controls.play')">
            <span v-if="!isPlaying">▶</span>
            <span v-else>❚❚</span>
          </button>

          <button class="kvp-btn" type="button" @click="seekBy(-10)" :aria-label="t('cp.controls.back10')">↺10</button>
          <button class="kvp-btn" type="button" @click="seekBy(10)" :aria-label="t('cp.controls.fwd10')">↻10</button>

          <div class="kvp-time" :aria-label="t('cp.controls.time')">
            <span>{{ fmt(currentTime) }}</span>
            <span class="kvp-time-sep">/</span>
            <span>{{ fmt(duration) }}</span>
          </div>
        </div>

        <div class="kvp-right">
          <button class="kvp-btn" type="button" @click="toggleMute" :aria-label="muted ? t('cp.controls.unmute') : t('cp.controls.mute')">
            {{ muted ? '🔇' : '🔊' }}
          </button>
          <input
            class="kvp-vol"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="volume"
            @input="onVolume($event)"
            :aria-label="t('cp.controls.volume')"
          />

          <select class="kvp-rate" :value="rate" @change="onRate($event)" :aria-label="t('cp.controls.speed')">
            <option v-for="r in rates" :key="r" :value="r">{{ r }}x</option>
          </select>

          <button v-if="pipSupported" class="kvp-btn" type="button" @click="togglePiP" :aria-label="t('cp.controls.pip')">⧉</button>
          <button class="kvp-btn" type="button" @click="toggleFullscreen" :aria-label="t('cp.controls.fullscreen')">⛶</button>
        </div>
      </div>

      <div v-if="resumeHint" class="kvp-resume">
        <span class="kvp-resume-text">{{ t('cp.controls.resume') }}</span>
        <button class="kvp-resume-btn" type="button" @click="resumeNow">{{ t('cp.controls.resumeBtn') }}</button>
        <button class="kvp-resume-btn kvp-resume-btn--ghost" type="button" @click="dismissResume">{{ t('cp.controls.dismiss') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'

const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  storageKey: { type: String, default: '' }
})

const emit = defineEmits(['ended', 'time'])

const i18n = useI18nStore()
const t = i18n.t

const videoEl = ref(null)
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const bufferedPct = ref(0)
const playedPct = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))

const volume = ref(0.9)
const muted = ref(false)
const rate = ref(1)
const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]

const pipSupported = ref(false)

const controlsHidden = ref(false)
let hideTimer = null

const resumeHint = ref(false)
const resumeAt = ref(0)
const isScrubbing = ref(false)

function poke() {
  controlsHidden.value = false
  hideSoon()
}

function hideSoon() {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (!isScrubbing.value && isPlaying.value) controlsHidden.value = true
  }, 1800)
}

function fmt(sec) {
  const s = Math.max(0, Math.floor(sec || 0))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const mm = String(m).padStart(2, '0')
  const rr = String(r).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${rr}` : `${m}:${rr.padStart(2, '0')}`
}

function safeParse(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}

function persistTime() {
  if (!props.storageKey) return
  const key = `kidzania_vtime_${props.storageKey}`
  localStorage.setItem(key, JSON.stringify({ t: currentTime.value, at: Date.now() }))
}

function loadTime() {
  if (!props.storageKey) return
  const key = `kidzania_vtime_${props.storageKey}`
  const saved = safeParse(localStorage.getItem(key), null)
  if (!saved?.t) return
  // show hint only if > 15s and not basically finished
  resumeAt.value = Number(saved.t) || 0
  if (resumeAt.value > 15 && duration.value && resumeAt.value < duration.value - 10) {
    resumeHint.value = true
  }
}

function resumeNow() {
  const v = videoEl.value
  if (!v) return
  v.currentTime = resumeAt.value
  resumeHint.value = false
}

function dismissResume() {
  resumeHint.value = false
}

function onLoadedMeta() {
  const v = videoEl.value
  if (!v) return
  duration.value = v.duration || 0
  v.volume = volume.value
  v.muted = muted.value
  v.playbackRate = rate.value
  pipSupported.value = !!document.pictureInPictureEnabled && typeof v.requestPictureInPicture === 'function'
  loadTime()
  onProgress()
}

function onTimeUpdate() {
  const v = videoEl.value
  if (!v) return
  currentTime.value = v.currentTime || 0
  emit('time', currentTime.value)
  if (!isScrubbing.value) persistTime()
}

function onProgress() {
  const v = videoEl.value
  if (!v || !v.buffered || !duration.value) return
  try {
    const end = v.buffered.end(v.buffered.length - 1)
    bufferedPct.value = Math.min(100, (end / duration.value) * 100)
  } catch {
    bufferedPct.value = 0
  }
}

function togglePlay() {
  const v = videoEl.value
  if (!v) return
  if (v.paused) v.play()
  else v.pause()
  poke()
}

function seekBy(delta) {
  const v = videoEl.value
  if (!v) return
  v.currentTime = Math.min(Math.max(0, v.currentTime + delta), duration.value || v.duration || v.currentTime + delta)
  poke()
}

function onScrub(e) {
  const v = videoEl.value
  if (!v) return
  isScrubbing.value = true
  controlsHidden.value = false
  const next = Number(e?.target?.value || 0)
  currentTime.value = next
  v.currentTime = next
}

function onScrubEnd(e) {
  isScrubbing.value = false
  onScrub(e)
  persistTime()
  hideSoon()
}

function onVolume(e) {
  const v = videoEl.value
  const next = Number(e?.target?.value ?? 0.9)
  volume.value = next
  if (v) v.volume = next
  if (next > 0 && muted.value) {
    muted.value = false
    if (v) v.muted = false
  }
  poke()
}

function toggleMute() {
  const v = videoEl.value
  muted.value = !muted.value
  if (v) v.muted = muted.value
  poke()
}

function onRate(e) {
  const v = videoEl.value
  const next = Number(e?.target?.value ?? 1)
  rate.value = next
  if (v) v.playbackRate = next
  poke()
}

async function togglePiP() {
  const v = videoEl.value
  if (!v) return
  try {
    // eslint-disable-next-line no-undef
    if (document.pictureInPictureElement) {
      // eslint-disable-next-line no-undef
      await document.exitPictureInPicture()
    } else {
      await v.requestPictureInPicture()
    }
  } catch { /* ignore */ }
  poke()
}

async function toggleFullscreen() {
  const el = videoEl.value?.parentElement
  if (!el) return
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await el.requestFullscreen()
  } catch { /* ignore */ }
  poke()
}

function onEnded() {
  resumeHint.value = false
  controlsHidden.value = false
  emit('ended')
}

function onKeydown(e) {
  if (!e) return
  const k = e.key?.toLowerCase()
  if (k === ' ' || k === 'k') { e.preventDefault(); togglePlay(); return }
  if (k === 'arrowleft') { e.preventDefault(); seekBy(-5); return }
  if (k === 'arrowright') { e.preventDefault(); seekBy(5); return }
  if (k === 'm') { e.preventDefault(); toggleMute(); return }
  if (k === 'f') { e.preventDefault(); toggleFullscreen(); return }
}

watch(() => props.src, () => {
  // reset state when source changes
  duration.value = 0
  currentTime.value = 0
  bufferedPct.value = 0
  resumeHint.value = false
  resumeAt.value = 0
  controlsHidden.value = false
})

onMounted(() => {
  hideSoon()
})

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<style scoped>
.kvp {
  position: relative;
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: #0b1220;
  outline: none;
}

.kvp-video {
  width: 100%;
  display: block;
  border-radius: 14px;
  background: #0b1220;
}

.kvp-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55));
  opacity: 0.25;
  pointer-events: none;
}

.kvp-center {
  position: absolute;
  inset: auto 50% 50% auto;
  transform: translate(50%, 50%);
  width: 64px;
  height: 64px;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-weight: 900;
  font-size: 22px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, opacity 0.2s ease;
}

.kvp--idle .kvp-center {
  opacity: 0;
}

.kvp-center:hover {
  background: rgba(255, 255, 255, 0.26);
  transform: translate(50%, 50%) scale(1.03);
}

.kvp-controls {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.kvp--idle .kvp-controls {
  opacity: 0;
  transform: translateY(6px);
}

.kvp-progress {
  position: relative;
}

.kvp-track {
  position: absolute;
  inset: 50% 0 auto 0;
  transform: translateY(-50%);
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.kvp-buffer {
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
}

.kvp-played {
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  background: rgba(0, 191, 255, 0.9);
}

.kvp-range {
  width: 100%;
  height: 22px;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}

.kvp-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #fff;
  border: 2px solid rgba(0, 191, 255, 0.9);
}

.kvp-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  background: rgba(3, 59, 98, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
}

.kvp-left,
.kvp-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.kvp-btn {
  border: 0;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 900;
  cursor: pointer;
}

.kvp-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.kvp-time {
  color: rgba(255, 255, 255, 0.92);
  font-weight: 900;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.kvp-time-sep {
  opacity: 0.6;
}

.kvp-vol {
  width: 90px;
  accent-color: rgba(0, 191, 255, 0.95);
}

.kvp-rate {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 7px 10px;
  font-weight: 900;
  cursor: pointer;
}

.kvp-resume {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.85);
  color: rgba(3, 59, 98, 0.9);
  border: 1px solid rgba(3, 59, 98, 0.12);
}

.kvp-resume-text {
  font-weight: 900;
}

.kvp-resume-btn {
  border: 0;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 900;
  cursor: pointer;
  background: var(--primary-medium, #00BFFF);
  color: #fff;
}

.kvp-resume-btn--ghost {
  background: rgba(3, 59, 98, 0.08);
  color: rgba(3, 59, 98, 0.9);
}

@media (max-width: 576px) {
  .kvp-vol { display: none; }
}
</style>


