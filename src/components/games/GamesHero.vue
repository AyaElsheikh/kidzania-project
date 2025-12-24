<template>
  <header class="gh-hero">
    <img src="/assets/images/Kite.svg" alt="" class="gh-deco gh-kite" />
    <div class="gh-content">
      <div class="gh-badge">{{ badge }}</div>
      <h1 class="gh-title">{{ title }}</h1>
      <p v-if="subtitle" class="gh-subtitle">{{ subtitle }}</p>
    </div>
    <img src="/assets/images/Bird.svg" alt="" class="gh-deco gh-bird" />
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'

const props = defineProps({
  titleKey: { type: String, required: true },
  subtitleKey: { type: String, default: '' },
  badgeKey: { type: String, default: 'play.title' }
})

const i18n = useI18nStore()
const t = i18n.t

const title = computed(() => t(props.titleKey))
const subtitle = computed(() => (props.subtitleKey ? t(props.subtitleKey) : ''))
const badge = computed(() => (props.badgeKey ? t(props.badgeKey) : ''))
</script>

<style scoped>
.gh-hero {
  width: 100%;
  min-height: 260px;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  padding: 42px 18px;
  background:
    radial-gradient(900px 360px at 15% 20%, rgba(255,192,203,0.55), transparent 55%),
    radial-gradient(720px 320px at 85% 35%, rgba(129,223,255,0.65), transparent 55%),
    linear-gradient(90deg, var(--primary-light), var(--secondary-green));
}

.gh-content {
  text-align: center;
  max-width: 860px;
  z-index: 2;
}

.gh-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 900;
  color: var(--primary);
  background: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.65);
  box-shadow: 0 14px 34px rgba(3,59,98,0.12);
  margin-bottom: 12px;
  backdrop-filter: blur(10px);
}

.gh-title {
  margin: 0;
  font-weight: 900;
  color: var(--primary);
  letter-spacing: 0.2px;
  font-size: clamp(1.9rem, 3.8vw, 2.9rem);
  text-shadow: 0 12px 28px rgba(3,59,98,0.14);
}

.gh-subtitle {
  margin: 10px 0 0 0;
  color: rgba(3,59,98,0.9);
  font-weight: 600;
  font-size: clamp(1rem, 1.2vw, 1.15rem);
}

.gh-deco {
  position: absolute;
  opacity: 0.95;
  filter: drop-shadow(0 16px 26px rgba(0,0,0,0.12));
  z-index: 1;
  animation: floaty 4.5s ease-in-out infinite;
  pointer-events: none;
}
.gh-kite {
  width: min(190px, 28vw);
  left: -14px;
  top: 22px;
}
.gh-bird {
  width: min(170px, 26vw);
  right: -12px;
  bottom: -6px;
  animation-duration: 5.5s;
}

@keyframes floaty {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}
</style>


