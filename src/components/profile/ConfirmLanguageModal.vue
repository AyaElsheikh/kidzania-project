<template>
  <div class="kp-modal-backdrop" role="dialog" aria-modal="true" :aria-label="t('profile.langModal.title')">
    <div class="kp-modal card shadow-lg">
      <div class="kp-modal-header">
        <div class="d-flex align-items-center gap-2">
          <div class="kp-icon" aria-hidden="true">🌐</div>
          <div>
            <h5 class="mb-0">{{ t('profile.langModal.title') }}</h5>
            <div class="text-muted small">{{ t('profile.langModal.subtitle') }}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-light" type="button" @click="$emit('close')" :aria-label="t('profile.langModal.close')">✕</button>
      </div>

      <div class="kp-modal-body">
        <p class="mb-2">{{ t('profile.langModal.text') }}</p>
        <div class="d-flex flex-wrap gap-2">
          <span class="badge rounded-pill bg-primary-subtle text-primary">
            {{ t('profile.langModal.current') }}: {{ currentLabel }}
          </span>
          <span class="badge rounded-pill bg-success-subtle text-success">
            {{ t('profile.langModal.next') }}: {{ nextLabel }}
          </span>
        </div>
      </div>

      <div class="kp-modal-footer">
        <button class="btn btn-light" type="button" @click="$emit('close')">{{ t('profile.langModal.cancel') }}</button>
        <button class="btn btn-primary" type="button" @click="$emit('confirm')">{{ t('profile.langModal.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'

defineEmits(['close', 'confirm'])

const i18n = useI18nStore()
const t = i18n.t

const currentLabel = computed(() => (i18n.locale === 'ar' ? 'العربية' : 'English'))
const nextLabel = computed(() => (i18n.locale === 'ar' ? 'English' : 'العربية'))
</script>

<style scoped>
.kp-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 2000;
}

.kp-modal {
  width: min(560px, 100%);
  border-radius: 18px;
  border: 1px solid rgba(3, 59, 98, 0.12);
  overflow: hidden;
}

.kp-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(90deg, rgba(0, 191, 255, 0.10), rgba(144, 238, 144, 0.10));
}

.kp-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.75);
  display: grid;
  place-items: center;
}

.kp-modal-body {
  padding: 16px;
  background: #fff;
}

.kp-modal-footer {
  padding: 14px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: #fff;
  border-top: 1px solid rgba(3, 59, 98, 0.08);
}
</style>


