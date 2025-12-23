<template>
  <div class="kp-modal-backdrop" role="dialog" aria-modal="true" :aria-label="t('profile.logoutModal.title')">
    <div class="kp-modal card shadow-lg">
      <div class="kp-modal-header">
        <div class="d-flex align-items-center gap-2">
          <div class="kp-icon" aria-hidden="true">🚪</div>
          <div>
            <h5 class="mb-0">{{ t('profile.logoutModal.title') }}</h5>
            <div class="text-muted small">{{ t('profile.logoutModal.subtitle') }}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-light" type="button" @click="$emit('close')" :aria-label="t('profile.logoutModal.close')">✕</button>
      </div>

      <div class="kp-modal-body">
        <p class="mb-0">{{ t('profile.logoutModal.text') }}</p>
      </div>

      <div class="kp-modal-footer">
        <button class="btn btn-light" type="button" @click="$emit('close')">{{ t('profile.logoutModal.cancel') }}</button>
        <button class="btn btn-danger" type="button" @click="$emit('confirm')">{{ t('profile.logoutModal.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18nStore } from '@/stores/i18n.js'
defineEmits(['close', 'confirm'])
const i18n = useI18nStore()
const t = i18n.t
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


