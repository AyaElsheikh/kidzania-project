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
      <svg v-if="!isPlaying" class="kvp-center-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <svg v-else class="kvp-center-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
      </svg>
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
          <button class="kvp-btn kvp-btn-play" type="button" @click="togglePlay" :aria-label="isPlaying ? t('cp.controls.pause') : t('cp.controls.play')">
            <svg v-if="!isPlaying" class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          </button>

          <button class="kvp-btn kvp-btn-seek" type="button" @click="seekBy(-10)" :aria-label="t('cp.controls.back10')">
            <svg class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            <span class="kvp-btn-text">10</span>
          </button>
          <button class="kvp-btn kvp-btn-seek" type="button" @click="seekBy(10)" :aria-label="t('cp.controls.fwd10')">
            <span class="kvp-btn-text">10</span>
            <svg class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
            </svg>
          </button>

          <div class="kvp-time" :aria-label="t('cp.controls.time')">
            <span>{{ fmt(currentTime) }}</span>
            <span class="kvp-time-sep">/</span>
            <span>{{ fmt(duration) }}</span>
          </div>
        </div>

        <div class="kvp-right">
          <div class="kvp-volume-group">
            <button class="kvp-btn kvp-btn-volume" type="button" @click="toggleMute" :aria-label="muted ? t('cp.controls.unmute') : t('cp.controls.mute')">
              <svg v-if="muted || volume === 0" class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
              <svg v-else-if="volume < 0.5" class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
              </svg>
              <svg v-else class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
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
          </div>

          <select class="kvp-rate" :value="rate" @change="onRate($event)" :aria-label="t('cp.controls.speed')">
            <option v-for="r in rates" :key="r" :value="r">{{ r }}x</option>
          </select>

          <button v-if="pipSupported" class="kvp-btn" type="button" @click="togglePiP" :aria-label="t('cp.controls.pip')">
            <svg class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7h-8v6h8V7zm0-2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h8zM9 12v7c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2zm2 0h6v7h-6v-7zM5 16H3c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
          <button class="kvp-btn" type="button" @click="toggleFullscreen" :aria-label="t('cp.controls.fullscreen')">
            <svg class="kvp-btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
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
  width: 80px;
  height: 80px;
  border-radius: 999px;
  border: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, opacity 0.3s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.kvp-center-icon {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.kvp--idle .kvp-center {
  opacity: 0;
  transform: translate(50%, 50%) scale(0.9);
}

.kvp-center:hover {
  background: rgba(0, 0, 0, 0.85);
  transform: translate(50%, 50%) scale(1.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
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
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.kvp-buffer {
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transition: width 0.2s ease;
}

.kvp-played {
  position: absolute;
  inset: 0 auto 0 0;
  height: 100%;
  background: linear-gradient(90deg, #00BFFF 0%, #0099CC 100%);
  box-shadow: 0 0 8px rgba(0, 191, 255, 0.5);
  transition: width 0.1s ease;
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
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #fff;
  border: 3px solid #00BFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.kvp-range::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 3px 12px rgba(0, 191, 255, 0.6), 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.kvp-range::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #fff;
  border: 3px solid #00BFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.kvp-range::-moz-range-thumb:hover {
  transform: scale(1.2);
}

.kvp-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
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
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  min-width: 40px;
  height: 40px;
}

.kvp-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.kvp-btn:active {
  transform: translateY(0);
}

.kvp-btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.kvp-btn-play {
  background: rgba(0, 191, 255, 0.2);
}

.kvp-btn-play:hover {
  background: rgba(0, 191, 255, 0.35);
}

.kvp-btn-seek {
  padding: 10px 14px;
}

.kvp-btn-text {
  font-size: 0.85rem;
  font-weight: 800;
}

.kvp-btn-volume {
  min-width: 44px;
}

.kvp-time {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  font-variant-numeric: tabular-nums;
}

.kvp-time-sep {
  opacity: 0.5;
  margin: 0 2px;
}

.kvp-volume-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.kvp-vol {
  width: 100px;
  height: 6px;
  accent-color: #00BFFF;
  cursor: pointer;
  transition: accent-color 0.2s ease;
}

.kvp-vol:hover {
  accent-color: #00D9FF;
}

.kvp-rate {
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 10px 14px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 70px;
  height: 40px;
}

.kvp-rate:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.kvp-rate option {
  background: #1a1a1a;
  color: #fff;
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


