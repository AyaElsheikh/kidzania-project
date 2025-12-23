<template>
  <div class="kp-modal-backdrop" role="dialog" aria-modal="true" :aria-label="t('profile.passwordModal.title')">
    <div class="kp-modal card shadow-lg">
      <div class="kp-modal-header">
        <div class="d-flex align-items-center gap-2">
          <div class="kp-icon" aria-hidden="true">🔒</div>
          <div>
            <h5 class="mb-0">{{ t('profile.passwordModal.title') }}</h5>
            <div class="text-muted small">{{ t('profile.passwordModal.subtitle') }}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-light" type="button" @click="$emit('close')" :aria-label="t('profile.passwordModal.close')">✕</button>
      </div>

      <div class="kp-modal-body">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label fw-semibold">{{ t('profile.passwordModal.current') }}</label>
            <input v-model="form.current" class="form-control" type="password" autocomplete="current-password" />
            <div v-if="errors.current" class="text-danger small mt-1">{{ errors.current }}</div>
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold">{{ t('profile.passwordModal.new') }}</label>
            <input v-model="form.next" class="form-control" type="password" autocomplete="new-password" />
            <div v-if="errors.next" class="text-danger small mt-1">{{ errors.next }}</div>
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold">{{ t('profile.passwordModal.confirm') }}</label>
            <input v-model="form.confirm" class="form-control" type="password" autocomplete="new-password" />
            <div v-if="errors.confirm" class="text-danger small mt-1">{{ errors.confirm }}</div>
          </div>

          <div v-if="errors.general" class="col-12">
            <div class="alert alert-danger py-2 mb-0">{{ errors.general }}</div>
          </div>
        </div>
      </div>

      <div class="kp-modal-footer">
        <button class="btn btn-light" type="button" @click="$emit('close')">{{ t('profile.passwordModal.cancel') }}</button>
        <button class="btn btn-primary" type="button" :disabled="saving" @click="save">
          {{ saving ? t('profile.passwordModal.saving') : t('profile.passwordModal.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useI18nStore } from '@/stores/i18n.js'

const emit = defineEmits(['close', 'saved'])

const auth = useAuthStore()
auth.load()

const i18n = useI18nStore()
const t = i18n.t

const saving = ref(false)
const form = reactive({ current: '', next: '', confirm: '' })
const errors = reactive({ current: '', next: '', confirm: '', general: '' })

function resetErrors() {
  errors.current = ''
  errors.next = ''
  errors.confirm = ''
  errors.general = ''
}

function validate() {
  resetErrors()
  if (!form.current) errors.current = t('profile.errors.currentPasswordRequired')
  if (!form.next || form.next.length < 8) errors.next = t('profile.errors.passwordMin')
  if (form.confirm !== form.next) errors.confirm = t('profile.errors.passwordMismatch')
  return !errors.current && !errors.next && !errors.confirm
}

async function save() {
  if (!validate()) return
  saving.value = true
  try {
    auth.changePassword({ currentPassword: form.current, newPassword: form.next })
    saving.value = false
    resetErrors()
    form.current = ''
    form.next = ''
    form.confirm = ''
    emit('saved')
    emit('close')
  } catch (err) {
    saving.value = false
    if (err?.message === 'bad-pass') errors.general = t('profile.errors.badPassword')
    else if (err?.message === 'no-user') errors.general = t('profile.errors.notLoggedIn')
    else errors.general = t('profile.errors.general')
  }
}
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
  width: min(640px, 100%);
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


