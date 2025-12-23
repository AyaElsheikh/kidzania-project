<template>
  <section class="ai-page">
    <div class="ai-hero">
      <div class="ai-hero-decor" aria-hidden="true">
        <img class="decor decor-kite" src="/assets/images/Kite.svg" alt="" />
        <img class="decor decor-bird" src="/assets/images/Bird.svg" alt="" />

        <span class="decor-star s1">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7L12 2z" fill="currentColor"/>
          </svg>
        </span>
        <span class="decor-star s2">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7L12 2z" fill="currentColor"/>
          </svg>
        </span>
        <span class="decor-star s3">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7L12 2z" fill="currentColor"/>
          </svg>
        </span>
        <span class="decor-star s4">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7L12 2z" fill="currentColor"/>
          </svg>
        </span>

        <span class="decor-orb o1"></span>
        <span class="decor-orb o2"></span>
        <span class="decor-orb o3"></span>
      </div>
      <div class="container py-3 py-md-4">
        <div class="ai-hero-card">
          <div class="ai-hero-badge">
            <span class="sparkle" aria-hidden="true">✦</span>
            <span>{{ t('ai.badge') }}</span>
          </div>

          <div class="ai-hero-head">
            <div class="ai-mascot" aria-hidden="true">
              <div class="mascot-face">
                <div class="eye eye-left"></div>
                <div class="eye eye-right"></div>
                <div class="smile"></div>
              </div>
              <div class="mascot-ring"></div>
            </div>

            <div>
              <h1 class="ai-title">{{ t('ai.title') }}</h1>
              <p class="ai-subtitle mb-0">{{ t('ai.subtitle') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="ai-clouds" aria-hidden="true"></div>
    </div>

    <div class="container pb-3">
      <div class="ai-shell">
        <div ref="scrollEl" class="ai-chat" role="log" aria-live="polite">
          <div v-if="messages.length === 0" class="ai-empty">
            <div class="ai-empty-card">
              <div class="ai-empty-icon" aria-hidden="true">🧠</div>
              <div class="ai-empty-title">{{ t('ai.emptyTitle') }}</div>
              <div class="ai-empty-text">{{ t('ai.emptyText') }}</div>
              <div class="ai-suggestions">
                <button class="ai-chip" type="button" @click="useSuggestion(t('ai.suggest1'))">
                  {{ t('ai.suggest1') }}
                </button>
                <button class="ai-chip" type="button" @click="useSuggestion(t('ai.suggest2'))">
                  {{ t('ai.suggest2') }}
                </button>
                <button class="ai-chip" type="button" @click="useSuggestion(t('ai.suggest3'))">
                  {{ t('ai.suggest3') }}
                </button>
              </div>
            </div>
          </div>

          <template v-else>
            <div v-for="m in messages" :key="m.id" class="ai-row" :class="m.role === 'user' ? 'is-user' : 'is-ai'">
              <div v-if="m.role === 'assistant'" class="ai-avatar avatar-ai" aria-hidden="true">
                <span class="avatar-glow"></span>
                <span class="avatar-face">
                  <span class="avatar-eye"></span>
                  <span class="avatar-eye"></span>
                  <span class="avatar-smile"></span>
                </span>
              </div>
              <div class="ai-bubble" :class="m.role === 'user' ? 'bubble-user' : 'bubble-ai'">
                <div class="bubble-meta">
                  <span class="bubble-name">{{ m.role === 'user' ? t('ai.you') : t('ai.assistant') }}</span>
                </div>
                <div class="bubble-text">{{ m.content }}</div>
              </div>
              <div v-if="m.role === 'user'" class="ai-avatar avatar-user" aria-hidden="true">🧒</div>
            </div>
          </template>

          <div v-if="isLoading" class="ai-row is-ai">
            <div class="ai-avatar avatar-ai" aria-hidden="true">
              <span class="avatar-glow"></span>
              <span class="avatar-face">
                <span class="avatar-eye"></span>
                <span class="avatar-eye"></span>
                <span class="avatar-smile"></span>
              </span>
            </div>
            <div class="ai-bubble bubble-ai bubble-loading">
              <div class="bubble-meta">
                <span class="bubble-name">{{ t('ai.assistant') }}</span>
              </div>
              <div class="typing">
                <span class="typing-badge">{{ t('ai.thinking') }}</span>
                <span class="dots" aria-hidden="true">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </span>
              </div>
              <div class="kid-bubbles" aria-hidden="true">
                <span class="kid-bubble b1"></span>
                <span class="kid-bubble b2"></span>
                <span class="kid-bubble b3"></span>
              </div>
            </div>
          </div>

          <div v-if="errorText" class="ai-row is-ai">
            <div class="ai-avatar avatar-ai" aria-hidden="true">
              <span class="avatar-glow"></span>
              <span class="avatar-face">
                <span class="avatar-eye"></span>
                <span class="avatar-eye"></span>
                <span class="avatar-smile"></span>
              </span>
            </div>
            <div class="ai-bubble bubble-ai bubble-error">
              <div class="bubble-meta">
                <span class="bubble-name">{{ t('ai.assistant') }}</span>
              </div>
              <div class="bubble-text">{{ errorText }}</div>
            </div>
          </div>
        </div>

        <form class="ai-composer" @submit.prevent="send">
          <div class="composer-card">
            <label class="composer-label" for="aiInput">{{ t('ai.inputLabel') }}</label>
            <div class="composer-row">
              <textarea
                id="aiInput"
                v-model="draft"
                class="composer-input"
                :placeholder="t('ai.inputPlaceholder')"
                rows="1"
                :disabled="isLoading"
                @keydown="onKeydown"
              />
              <button class="composer-send" type="submit" :disabled="isLoading || !canSend">
                <span class="send-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L11 13" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </span>
                <span class="send-text">{{ t('ai.send') }}</span>
              </button>
            </div>

            <div class="composer-hint">
              <span class="hint-pill">{{ t('ai.hint') }}</span>
              <span class="hint-pill hint-soft">{{ t('ai.hint2') }}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'

const i18n = useI18nStore()
const t = i18n.t

const scrollEl = ref(null)
const draft = ref('')
const isLoading = ref(false)
const errorText = ref('')
const messages = ref([]) // {id, role:'user'|'assistant', content}

const canSend = computed(() => draft.value.trim().length > 0)

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function scrollToBottom() {
  const el = scrollEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function useSuggestion(text) {
  if (isLoading.value) return
  draft.value = text
  nextTick(() => {
    const input = document.getElementById('aiInput')
    input?.focus?.()
  })
}

function onKeydown(e) {
  // Enter to send, Shift+Enter for a new line
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

async function send() {
  if (isLoading.value || !canSend.value) return

  errorText.value = ''
  const userText = draft.value.trim()
  draft.value = ''

  messages.value.push({ id: uid(), role: 'user', content: userText })
  await nextTick()
  scrollToBottom()

  isLoading.value = true
  try {
    const payload = {
      locale: i18n.locale,
      messages: messages.value.map((m) => ({ role: m.role, content: m.content }))
    }

    const res = await fetch('/api/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      let msg = text
      try {
        const parsed = JSON.parse(text)
        msg = parsed?.error || text
      } catch {
        // ignore
      }
      throw new Error(msg || `Request failed (${res.status})`)
    }

    const data = await res.json()
    const answer = (data?.answer || '').toString().trim()
    if (!answer) throw new Error('Empty answer')

    messages.value.push({ id: uid(), role: 'assistant', content: answer })
    await nextTick()
    scrollToBottom()
  } catch (err) {
    const raw = (err?.message || '').toString()
    errorText.value = raw && raw.length < 180
      ? raw
      : (i18n.locale === 'ar'
        ? 'حدث خطأ بسيط. جرّب مرة أخرى بعد قليل.'
        : 'Something went wrong. Please try again in a moment.')
    // eslint-disable-next-line no-console
    console.error(err)
  } finally {
    isLoading.value = false
    await nextTick()
    scrollToBottom()
  }
}
</script>

<style scoped>
.ai-page {
  background: radial-gradient(1200px 520px at 20% 0%, rgba(0, 191, 255, 0.16), transparent 60%),
    radial-gradient(900px 520px at 80% 10%, rgba(255, 215, 0, 0.18), transparent 55%),
    linear-gradient(180deg, #f8fbff, #ffffff);
}

.ai-hero {
  position: relative;
  overflow: hidden;
}

.ai-hero-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.decor {
  position: absolute;
  filter: drop-shadow(0 18px 30px rgba(17, 24, 39, 0.10));
  opacity: 0.95;
}
.decor-kite {
  width: clamp(82px, 11vw, 135px);
  right: clamp(-10px, 4vw, 36px);
  top: clamp(10px, 2vw, 18px);
  transform-origin: 20% 40%;
  animation: kiteFloat 5.4s ease-in-out infinite;
}
.decor-bird {
  width: clamp(58px, 7.5vw, 98px);
  left: clamp(-10px, 3vw, 18px);
  top: clamp(36px, 5vw, 68px);
  transform-origin: 50% 50%;
  animation: birdFloat 4.8s ease-in-out infinite;
}

.decor-star {
  position: absolute;
  width: 16px;
  height: 16px;
  color: rgba(0, 191, 255, 0.65);
  filter: drop-shadow(0 10px 18px rgba(17, 24, 39, 0.10));
  animation: twinkle 2.6s ease-in-out infinite;
}
.decor-star svg { width: 100%; height: 100%; }
.decor-star.s1 { right: 18%; top: 18%; animation-delay: 0.2s; }
.decor-star.s2 { right: 40%; top: 10%; color: rgba(255, 215, 0, 0.75); animation-delay: 0.9s; transform: rotate(18deg); }
.decor-star.s3 { left: 28%; top: 14%; animation-delay: 1.3s; transform: rotate(-10deg); }
.decor-star.s4 { left: 12%; top: 28%; color: rgba(255, 215, 0, 0.65); animation-delay: 0.6s; }

.decor-orb {
  position: absolute;
  border-radius: 999px;
  border: 1px solid rgba(11, 33, 64, 0.08);
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.10);
  backdrop-filter: blur(2px);
  animation: orbFloat 6.2s ease-in-out infinite;
}
.decor-orb.o1 {
  width: 30px; height: 30px;
  left: 14%;
  bottom: 22%;
  background: rgba(255, 255, 255, 0.55);
  animation-delay: 0.2s;
}
.decor-orb.o2 {
  width: 16px; height: 16px;
  right: 22%;
  bottom: 26%;
  background: rgba(0, 191, 255, 0.18);
  animation-delay: 1.1s;
}
.decor-orb.o3 {
  width: 22px; height: 22px;
  right: 8%;
  bottom: 36%;
  background: rgba(255, 215, 0, 0.18);
  animation-delay: 0.7s;
}

@keyframes kiteFloat {
  0%, 100% { transform: translateY(0) rotate(2deg); }
  50% { transform: translateY(10px) rotate(-3deg); }
}
@keyframes birdFloat {
  0%, 100% { transform: translateY(0) translateX(0) rotate(-1deg); }
  50% { transform: translateY(-10px) translateX(6px) rotate(2deg); }
}
@keyframes twinkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.65; }
  50% { transform: scale(1.12) rotate(8deg); opacity: 0.95; }
}
@keyframes orbFloat {
  0%, 100% { transform: translateY(0); opacity: 0.75; }
  50% { transform: translateY(-10px); opacity: 0.95; }
}

.ai-clouds {
  height: 86px;
  position: relative;
  background-image: url('/assets/clouds-kidzademy.svg');
  background-repeat: repeat-x;
  background-size: 620px 86px;
  opacity: 1;
  filter: saturate(1.1) contrast(1.06) brightness(1.03) drop-shadow(0 10px 16px rgba(17, 24, 39, 0.10));
  animation: cloudsMove 28s linear infinite;
  /* soft fade into the content below */
  -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,1) 70%, rgba(0,0,0,0));
  mask-image: linear-gradient(180deg, rgba(0,0,0,1), rgba(0,0,0,1) 70%, rgba(0,0,0,0));
}
@keyframes cloudsMove { to { background-position-x: 620px; } }

.ai-clouds::before,
.ai-clouds::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('/assets/clouds-kidzademy.svg');
  background-repeat: repeat-x;
  pointer-events: none;
}

/* Far layer (bigger + slower) */
.ai-clouds::before {
  opacity: 0.42;
  filter: blur(0.7px) saturate(1.08) contrast(1.05);
  background-size: 760px 86px;
  animation: cloudsMoveFar 46s linear infinite;
  transform: translateY(8px);
}

/* Near layer (smaller + faster) */
.ai-clouds::after {
  opacity: 0.70;
  filter: blur(0.15px) saturate(1.12) contrast(1.06);
  background-size: 480px 86px;
  animation: cloudsMoveNear 18s linear infinite;
  transform: translateY(-4px);
}

@keyframes cloudsMoveFar { to { background-position-x: 760px; } }
@keyframes cloudsMoveNear { to { background-position-x: 480px; } }

.ai-hero-card {
  border-radius: 22px;
  padding: clamp(14px, 1.6vw, 18px);
  color: #0b2140;
  background:
    radial-gradient(1200px 320px at 30% 0%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.72)),
    linear-gradient(135deg, rgba(0, 191, 255, 0.18), rgba(255, 215, 0, 0.12));
  border: 1px solid rgba(11, 33, 64, 0.08);
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.10);
}

.ai-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.86rem;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(11, 33, 64, 0.10);
}

.sparkle {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.35), rgba(255, 215, 0, 0.35));
  border: 1px solid rgba(11, 33, 64, 0.10);
}

.ai-hero-head {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 12px;
  align-items: center;
}

.ai-title {
  font-weight: 1000;
  letter-spacing: -0.02em;
  margin: 0;
  font-size: clamp(1.25rem, 1.1rem + 1.2vw, 1.85rem);
}

.ai-subtitle {
  margin-top: 8px;
  color: rgba(11, 33, 64, 0.75);
  font-weight: 700;
  font-size: clamp(0.88rem, 0.82rem + 0.25vw, 1.0rem);
}

/* Mascot */
.ai-mascot {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.20), rgba(255, 215, 0, 0.18));
  border: 1px solid rgba(11, 33, 64, 0.10);
  display: grid;
  place-items: center;
  box-shadow: 0 18px 30px rgba(17, 24, 39, 0.10);
}

.mascot-face {
  width: 44px;
  height: 44px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(11, 33, 64, 0.08);
  display: grid;
  place-items: center;
  position: relative;
}

.eye {
  position: absolute;
  top: 14px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #0b2140;
  box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.12);
  animation: blink 5s infinite;
}
.eye-left { left: 13px; }
.eye-right { right: 13px; }

.smile {
  position: absolute;
  bottom: 12px;
  width: 18px;
  height: 9px;
  border: 3px solid #0b2140;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-radius: 0 0 999px 999px;
  opacity: 0.85;
}

.mascot-ring {
  position: absolute;
  inset: -9px;
  border-radius: 28px;
  border: 2px dashed rgba(0, 191, 255, 0.38);
  animation: spin 14s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes blink {
  0%, 46%, 100% { transform: scaleY(1); }
  48% { transform: scaleY(0.08); }
  50% { transform: scaleY(1); }
}

/* Shell */
.ai-shell {
  margin-top: -22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(11, 33, 64, 0.08);
  box-shadow: 0 22px 60px rgba(17, 24, 39, 0.10);
  overflow: hidden;
}

.ai-chat {
  height: clamp(360px, 56vh, 620px);
  padding: 12px;
  overflow: auto;
  position: relative;
  background:
    radial-gradient(1200px 520px at 20% 0%, rgba(0, 191, 255, 0.06), transparent 60%),
    radial-gradient(900px 520px at 80% 0%, rgba(255, 215, 0, 0.07), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.78));
}

.ai-chat::before,
.ai-chat::after {
  content: "";
  position: absolute;
  pointer-events: none;
  inset: 0;
}
.ai-chat::before {
  background:
    radial-gradient(10px 10px at 12% 18%, rgba(0, 191, 255, 0.12), transparent 65%),
    radial-gradient(12px 12px at 82% 22%, rgba(255, 215, 0, 0.14), transparent 65%),
    radial-gradient(14px 14px at 66% 68%, rgba(0, 191, 255, 0.10), transparent 65%),
    radial-gradient(9px 9px at 24% 78%, rgba(255, 215, 0, 0.10), transparent 65%);
  opacity: 0.85;
  animation: confettiDrift 9.5s ease-in-out infinite;
}
.ai-chat::after {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.35), transparent 30%, transparent 70%, rgba(255, 255, 255, 0.25));
  opacity: 0.5;
}
@keyframes confettiDrift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}

.ai-row {
  display: flex;
  align-items: flex-end;
  margin: 7px 0;
  gap: 8px;
}
.ai-row.is-user { justify-content: flex-end; }
.ai-row.is-ai { justify-content: flex-start; }

.ai-row.is-user .ai-bubble { border-bottom-right-radius: 8px; }
.ai-row.is-ai .ai-bubble { border-bottom-left-radius: 8px; }

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border: 1px solid rgba(11, 33, 64, 0.10);
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.08);
  background: rgba(255, 255, 255, 0.80);
}
.avatar-user {
  font-size: 18px;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.16), rgba(255, 255, 255, 0.82));
}
.avatar-ai {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.22), rgba(255, 255, 255, 0.80));
}
.avatar-glow {
  position: absolute;
  inset: -18px;
  background: radial-gradient(circle at 30% 30%, rgba(0, 191, 255, 0.25), transparent 60%);
  animation: glowPulse 3.4s ease-in-out infinite;
}
.avatar-face {
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.80);
  border: 1px solid rgba(11, 33, 64, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  padding-top: 4px;
}
.avatar-eye {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(11, 33, 64, 0.88);
  animation: blink 5s infinite;
}
.avatar-smile {
  grid-column: 1 / -1;
  width: 12px;
  height: 6px;
  margin-top: 2px;
  border: 2px solid rgba(11, 33, 64, 0.85);
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-radius: 0 0 999px 999px;
  opacity: 0.85;
}
@keyframes glowPulse {
  0%, 100% { transform: scale(1); opacity: 0.65; }
  50% { transform: scale(1.08); opacity: 0.95; }
}

.ai-bubble {
  max-width: min(520px, 90%);
  border-radius: 18px;
  padding: 9px 11px;
  border: 2px solid rgba(11, 33, 64, 0.10);
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.09);
  animation: popIn 0.22s ease both;
  transform-origin: bottom;
  position: relative;
}
@keyframes popIn {
  from { transform: translateY(8px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

.ai-bubble::after {
  content: "";
  position: absolute;
  bottom: 7px;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(11, 33, 64, 0.10);
  background: inherit;
  transform: rotate(45deg);
  border-radius: 4px;
}
.ai-row.is-ai .ai-bubble::after {
  left: -6px;
  border-right: 0;
  border-top: 0;
}
.ai-row.is-user .ai-bubble::after {
  right: -6px;
  border-left: 0;
  border-top: 0;
}

.ai-bubble::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(220px 120px at 20% 10%, rgba(255, 255, 255, 0.55), transparent 60%);
  opacity: 0.85;
  pointer-events: none;
}

.bubble-user {
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.22), rgba(0, 191, 255, 0.08));
}
.bubble-ai {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.20), rgba(255, 255, 255, 0.70));
}
.bubble-error {
  border-color: rgba(255, 0, 0, 0.25);
  background: linear-gradient(135deg, rgba(255, 0, 0, 0.10), rgba(255, 255, 255, 0.75));
}

.bubble-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.bubble-name {
  font-weight: 1000;
  color: rgba(11, 33, 64, 0.82);
  font-size: 0.82rem;
}
.bubble-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-weight: 750;
  color: rgba(11, 33, 64, 0.92);
  line-height: 1.5;
}

/* Empty state */
.ai-empty {
  height: 100%;
  display: grid;
  place-items: center;
  padding: 14px;
}
.ai-empty-card {
  width: min(760px, 100%);
  border-radius: 18px;
  padding: 16px;
  border: 1px solid rgba(11, 33, 64, 0.08);
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 14px 36px rgba(17, 24, 39, 0.08);
}
.ai-empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.22), rgba(255, 215, 0, 0.18));
  border: 1px solid rgba(11, 33, 64, 0.08);
  font-size: 24px;
}
.ai-empty-title {
  margin-top: 12px;
  font-weight: 1000;
  font-size: 1.02rem;
  color: rgba(11, 33, 64, 0.92);
}
.ai-empty-text {
  margin-top: 6px;
  color: rgba(11, 33, 64, 0.75);
  font-weight: 750;
}
.ai-suggestions {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ai-chip {
  border: 1px solid rgba(11, 33, 64, 0.10);
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  padding: 7px 9px;
  font-weight: 900;
  color: rgba(11, 33, 64, 0.85);
  transition: transform 0.12s ease, box-shadow 0.15s ease, background 0.15s ease;
  font-size: 0.9rem;
}
.ai-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(17, 24, 39, 0.10);
  background: rgba(255, 255, 255, 0.92);
}

/* Composer */
.ai-composer {
  padding: 10px;
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(11, 33, 64, 0.08);
}
.composer-card {
  border-radius: 18px;
  padding: 10px;
  border: 1px solid rgba(11, 33, 64, 0.08);
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.08), rgba(255, 215, 0, 0.06));
}
.composer-label {
  font-weight: 1000;
  color: rgba(11, 33, 64, 0.82);
  margin-bottom: 6px;
}
.composer-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: end;
}
.composer-input {
  resize: none;
  width: 100%;
  min-height: 38px;
  max-height: 140px;
  border-radius: 14px;
  padding: 10px 10px;
  border: 1px solid rgba(11, 33, 64, 0.12);
  background: rgba(255, 255, 255, 0.86);
  font-weight: 750;
  color: rgba(11, 33, 64, 0.92);
  outline: none;
  font-size: 0.95rem;
}
.composer-input:focus {
  box-shadow: 0 0 0 4px rgba(0, 191, 255, 0.18);
  border-color: rgba(0, 191, 255, 0.35);
}

.composer-send {
  height: 38px;
  border-radius: 14px;
  padding: 0 12px;
  border: 1px solid rgba(11, 33, 64, 0.12);
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.45), rgba(255, 215, 0, 0.35));
  color: rgba(11, 33, 64, 0.92);
  font-weight: 1000;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.12s ease, filter 0.15s ease;
  font-size: 0.95rem;
}
.composer-send:disabled {
  opacity: 0.55;
  filter: grayscale(0.2);
  cursor: not-allowed;
}
.composer-send:not(:disabled):hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}
.composer-send:not(:disabled):hover .send-icon {
  animation: wiggle 0.55s ease-in-out;
}
@keyframes wiggle {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
  100% { transform: rotate(0deg); }
}
.send-icon {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.50);
  border: 1px solid rgba(11, 33, 64, 0.10);
}
.send-icon svg {
  width: 15px;
  height: 15px;
}

.composer-hint {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.hint-pill {
  border-radius: 999px;
  padding: 7px 9px;
  border: 1px solid rgba(11, 33, 64, 0.10);
  background: rgba(255, 255, 255, 0.70);
  font-weight: 850;
  color: rgba(11, 33, 64, 0.78);
  font-size: 0.85rem;
}
.hint-soft {
  opacity: 0.9;
}

/* Loading */
.typing {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 900;
}
.typing-badge {
  padding: 7px 9px;
  border-radius: 999px;
  border: 1px solid rgba(11, 33, 64, 0.10);
  background: rgba(255, 255, 255, 0.70);
  color: rgba(11, 33, 64, 0.78);
}
.dots {
  display: inline-flex;
  gap: 6px;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(11, 33, 64, 0.55);
  animation: bounce 1.05s infinite ease-in-out;
}
.dot:nth-child(2) { animation-delay: 0.14s; }
.dot:nth-child(3) { animation-delay: 0.28s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.55; }
  40% { transform: translateY(-6px); opacity: 0.95; }
}

.kid-bubbles {
  margin-top: 10px;
  height: 22px;
  position: relative;
}
.kid-bubble {
  position: absolute;
  bottom: 0;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: rgba(0, 191, 255, 0.20);
  border: 1px solid rgba(11, 33, 64, 0.08);
  animation: floaty 1.6s infinite ease-in-out;
}
.kid-bubble.b1 { left: 10px; animation-delay: 0s; }
.kid-bubble.b2 { left: 32px; width: 10px; height: 10px; animation-delay: 0.22s; background: rgba(255, 215, 0, 0.20); }
.kid-bubble.b3 { left: 50px; width: 12px; height: 12px; animation-delay: 0.38s; }

@keyframes floaty {
  0%, 100% { transform: translateY(0); opacity: 0.65; }
  50% { transform: translateY(-10px); opacity: 0.95; }
}

@media (prefers-reduced-motion: reduce) {
  .decor,
  .decor-star,
  .decor-orb,
  .ai-clouds,
  .ai-clouds::before,
  .ai-clouds::after,
  .ai-bubble,
  .dot,
  .kid-bubble,
  .avatar-glow,
  .composer-send:not(:disabled):hover .send-icon,
  .ai-chat::before {
    animation: none !important;
    transition: none !important;
  }
}
</style>


