<template>
  <div
    class="hcw"
    :class="i18n.locale === 'ar' ? 'is-rtl' : 'is-ltr'"
  >
    <!-- Floating Button -->
    <button
      class="hcw-fab"
      type="button"
      :aria-label="isOpen ? t('home.aiWidget.close') : t('home.aiWidget.open')"
      :aria-expanded="isOpen ? 'true' : 'false'"
      @click="toggle"
    >
      <span class="hcw-fab-glow" aria-hidden="true"></span>
      <span class="hcw-fab-face" aria-hidden="true">
        <span class="eye"></span>
        <span class="eye"></span>
        <span class="smile"></span>
      </span>
      <span class="hcw-fab-text">
        {{ t('home.aiWidget.button') }}
      </span>
    </button>

    <!-- Panel -->
    <div v-if="isOpen" class="hcw-panel" role="dialog" aria-modal="false">
      <div class="hcw-head">
        <div class="hcw-badge">
          <span class="sparkle" aria-hidden="true">✦</span>
          <span>{{ t('home.aiWidget.title') }}</span>
        </div>

        <button class="hcw-close" type="button" :aria-label="t('home.aiWidget.close')" @click="isOpen = false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref="scrollEl" class="hcw-chat" role="log" aria-live="polite">
        <div v-if="messages.length === 0" class="hcw-empty">
          <div class="hcw-empty-title">{{ t('home.aiWidget.emptyTitle') }}</div>
          <div class="hcw-empty-text">{{ t('home.aiWidget.emptyText') }}</div>
          <div class="hcw-suggestions">
            <button class="hcw-chip" type="button" @click="useSuggestion(t('home.aiWidget.suggest1'))">
              {{ t('home.aiWidget.suggest1') }}
            </button>
            <button class="hcw-chip" type="button" @click="useSuggestion(t('home.aiWidget.suggest2'))">
              {{ t('home.aiWidget.suggest2') }}
            </button>
            <button class="hcw-chip" type="button" @click="useSuggestion(t('home.aiWidget.suggest3'))">
              {{ t('home.aiWidget.suggest3') }}
            </button>
          </div>
        </div>

        <template v-else>
          <div
            v-for="m in messages"
            :key="m.id"
            class="hcw-row"
            :class="m.role === 'user' ? 'is-user' : 'is-ai'"
          >
            <div v-if="m.role === 'assistant'" class="hcw-avatar avatar-ai" aria-hidden="true">
              <span class="avatar-glow"></span>
              <span class="avatar-face">
                <span class="avatar-eye"></span>
                <span class="avatar-eye"></span>
                <span class="avatar-smile"></span>
              </span>
            </div>

            <div class="hcw-bubble" :class="m.role === 'user' ? 'bubble-user' : 'bubble-ai'">
              <div class="bubble-meta">
                <span class="bubble-name">{{ m.role === 'user' ? t('ai.you') : t('ai.assistant') }}</span>
              </div>
              <div class="bubble-text">{{ m.content }}</div>
            </div>

            <div v-if="m.role === 'user'" class="hcw-avatar avatar-user" aria-hidden="true">🧒</div>
          </div>
        </template>

        <div v-if="isLoading" class="hcw-row is-ai">
          <div class="hcw-avatar avatar-ai" aria-hidden="true">
            <span class="avatar-glow"></span>
            <span class="avatar-face">
              <span class="avatar-eye"></span>
              <span class="avatar-eye"></span>
              <span class="avatar-smile"></span>
            </span>
          </div>
          <div class="hcw-bubble bubble-ai bubble-loading">
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
          </div>
        </div>

        <div v-if="errorText" class="hcw-row is-ai">
          <div class="hcw-avatar avatar-ai" aria-hidden="true">
            <span class="avatar-glow"></span>
            <span class="avatar-face">
              <span class="avatar-eye"></span>
              <span class="avatar-eye"></span>
              <span class="avatar-smile"></span>
            </span>
          </div>
          <div class="hcw-bubble bubble-ai bubble-error">
            <div class="bubble-meta">
              <span class="bubble-name">{{ t('ai.assistant') }}</span>
            </div>
            <div class="bubble-text">{{ errorText }}</div>
          </div>
        </div>
      </div>

      <form class="hcw-composer" @submit.prevent="send">
        <div class="composer-row">
          <textarea
            ref="inputEl"
            v-model="draft"
            class="composer-input"
            rows="1"
            :disabled="isLoading"
            :placeholder="t('home.aiWidget.placeholder')"
            @keydown="onKeydown"
          />
          <button class="composer-send" type="submit" :disabled="isLoading || !canSend">
            <span class="send-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2L11 13" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </span>
            <span class="send-text">{{ t('home.aiWidget.send') }}</span>
          </button>
        </div>
        <div class="composer-hint">
          <span class="hint-pill">{{ t('home.aiWidget.hint') }}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'

const i18n = useI18nStore()
const t = i18n.t

const isOpen = ref(false)
const scrollEl = ref(null)
const inputEl = ref(null)

const draft = ref('')
const isLoading = ref(false)
const errorText = ref('')
const messages = ref([]) // {id, role:'user'|'assistant', content}

const canSend = computed(() => draft.value.trim().length > 0)

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => inputEl.value?.focus?.())
  }
}

function scrollToBottom() {
  const el = scrollEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function useSuggestion(text) {
  if (isLoading.value) return
  if (!isOpen.value) isOpen.value = true
  draft.value = text
  nextTick(() => inputEl.value?.focus?.())
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
.hcw {
  position: fixed;
  bottom: 18px;
  z-index: 999;
  font-family: inherit;
}
.hcw.is-ltr { right: 18px; }
.hcw.is-rtl { left: 18px; }

.hcw-fab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 999px;
  color: rgba(11, 33, 64, 0.92);
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.38), rgba(255, 215, 0, 0.28));
  box-shadow: 0 16px 40px rgba(17, 24, 39, 0.16);
  border: 1px solid rgba(11, 33, 64, 0.10);
  position: relative;
  overflow: hidden;
  max-width: min(92vw, 420px);
}
.hcw-fab:active { transform: translateY(1px); }
.hcw-fab-glow {
  position: absolute;
  inset: -18px;
  background: radial-gradient(circle at 25% 20%, rgba(255, 255, 255, 0.45), transparent 55%);
  pointer-events: none;
}
.hcw-fab-face {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(11, 33, 64, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  padding-top: 6px;
  position: relative;
  flex: 0 0 auto;
}
.hcw-fab-face .eye {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: rgba(11, 33, 64, 0.88);
  animation: blink 5s infinite;
}
.hcw-fab-face .smile {
  grid-column: 1 / -1;
  width: 14px;
  height: 7px;
  margin-top: 2px;
  border: 2px solid rgba(11, 33, 64, 0.85);
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-radius: 0 0 999px 999px;
}
.hcw-fab-text {
  font-weight: 1000;
  white-space: nowrap;
  font-size: 0.95rem;
}

.hcw-panel {
  margin-top: 10px;
  width: min(92vw, 410px);
  height: min(72vh, 520px);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(11, 33, 64, 0.10);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 26px 70px rgba(17, 24, 39, 0.18);
  backdrop-filter: blur(8px);
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.hcw-head {
  padding: 10px 10px 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(11, 33, 64, 0.08);
  background:
    radial-gradient(720px 220px at 20% 0%, rgba(0, 191, 255, 0.10), transparent 60%),
    radial-gradient(620px 220px at 90% 0%, rgba(255, 215, 0, 0.12), transparent 55%),
    rgba(255, 255, 255, 0.9);
}

.hcw-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 999px;
  font-weight: 1000;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.70);
  border: 1px solid rgba(11, 33, 64, 0.10);
  color: rgba(11, 33, 64, 0.92);
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

.hcw-close {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  border: 1px solid rgba(11, 33, 64, 0.10);
  background: rgba(255, 255, 255, 0.78);
  display: grid;
  place-items: center;
  cursor: pointer;
  color: rgba(11, 33, 64, 0.75);
}
.hcw-close svg { width: 18px; height: 18px; }

.hcw-chat {
  padding: 10px;
  overflow: auto;
  background:
    radial-gradient(900px 420px at 18% 0%, rgba(0, 191, 255, 0.06), transparent 60%),
    radial-gradient(780px 420px at 82% 0%, rgba(255, 215, 0, 0.07), transparent 55%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.78));
  position: relative;
}
.hcw-chat::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(10px 10px at 12% 18%, rgba(0, 191, 255, 0.10), transparent 65%),
    radial-gradient(12px 12px at 82% 22%, rgba(255, 215, 0, 0.12), transparent 65%),
    radial-gradient(14px 14px at 66% 68%, rgba(0, 191, 255, 0.09), transparent 65%),
    radial-gradient(9px 9px at 24% 78%, rgba(255, 215, 0, 0.09), transparent 65%);
  opacity: 0.9;
  animation: confettiDrift 9.5s ease-in-out infinite;
}

.hcw-empty {
  height: 100%;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 10px;
}
.hcw-empty-title {
  font-weight: 1000;
  color: rgba(11, 33, 64, 0.92);
  font-size: 1.05rem;
}
.hcw-empty-text {
  margin-top: 6px;
  color: rgba(11, 33, 64, 0.72);
  font-weight: 750;
}
.hcw-suggestions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.hcw-chip {
  border: 1px solid rgba(11, 33, 64, 0.10);
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  padding: 7px 9px;
  font-weight: 900;
  color: rgba(11, 33, 64, 0.85);
  transition: transform 0.12s ease, box-shadow 0.15s ease, background 0.15s ease;
  font-size: 0.9rem;
  cursor: pointer;
}
.hcw-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(17, 24, 39, 0.10);
  background: rgba(255, 255, 255, 0.92);
}

.hcw-row {
  display: flex;
  align-items: flex-end;
  margin: 7px 0;
  gap: 8px;
  position: relative;
}
.hcw-row.is-user { justify-content: flex-end; }
.hcw-row.is-ai { justify-content: flex-start; }
.hcw-row.is-user .hcw-bubble { border-bottom-right-radius: 8px; }
.hcw-row.is-ai .hcw-bubble { border-bottom-left-radius: 8px; }

.hcw-avatar {
  width: 34px;
  height: 34px;
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

.hcw-bubble {
  max-width: min(300px, 82%);
  border-radius: 18px;
  padding: 9px 11px;
  border: 2px solid rgba(11, 33, 64, 0.10);
  box-shadow: 0 12px 28px rgba(17, 24, 39, 0.09);
  animation: popIn 0.22s ease both;
  transform-origin: bottom;
  position: relative;
}
.hcw-bubble::after {
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
.hcw-row.is-ai .hcw-bubble::after {
  left: -6px;
  border-right: 0;
  border-top: 0;
}
.hcw-row.is-user .hcw-bubble::after {
  right: -6px;
  border-left: 0;
  border-top: 0;
}

.bubble-user { background: linear-gradient(135deg, rgba(0, 191, 255, 0.22), rgba(0, 191, 255, 0.08)); }
.bubble-ai { background: linear-gradient(135deg, rgba(255, 215, 0, 0.20), rgba(255, 255, 255, 0.70)); }
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
  font-size: 0.80rem;
}
.bubble-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-weight: 750;
  color: rgba(11, 33, 64, 0.92);
  line-height: 1.5;
}

.hcw-composer {
  padding: 10px;
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(11, 33, 64, 0.08);
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
  max-height: 120px;
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
  cursor: pointer;
}
.composer-send:disabled {
  opacity: 0.55;
  filter: grayscale(0.2);
  cursor: not-allowed;
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
.send-icon svg { width: 15px; height: 15px; }

.composer-hint {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
.dots { display: inline-flex; gap: 6px; }
.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(11, 33, 64, 0.55);
  animation: bounce 1.05s infinite ease-in-out;
}
.dot:nth-child(2) { animation-delay: 0.14s; }
.dot:nth-child(3) { animation-delay: 0.28s; }

@keyframes popIn {
  from { transform: translateY(8px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes confettiDrift {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}
@keyframes glowPulse {
  0%, 100% { transform: scale(1); opacity: 0.65; }
  50% { transform: scale(1.08); opacity: 0.95; }
}
@keyframes blink {
  0%, 46%, 100% { transform: scaleY(1); }
  48% { transform: scaleY(0.08); }
  50% { transform: scaleY(1); }
}
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.55; }
  40% { transform: translateY(-6px); opacity: 0.95; }
}

@media (max-width: 420px) {
  .hcw-fab-text { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hcw-chat::before,
  .avatar-glow,
  .dot,
  .hcw-bubble,
  .hcw-fab-face .eye {
    animation: none !important;
    transition: none !important;
  }
}
</style>


