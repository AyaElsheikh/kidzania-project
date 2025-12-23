<template>
  <div class="kp-modal-backdrop" role="dialog" aria-modal="true" :aria-label="t('profile.editModal.title')">
    <div class="kp-modal card shadow-lg">
      <div class="kp-modal-header">
        <div class="d-flex align-items-center gap-2">
          <div class="kp-icon" aria-hidden="true">✏️</div>
          <div>
            <h5 class="mb-0">{{ t('profile.editModal.title') }}</h5>
            <div class="text-muted small">{{ t('profile.editModal.subtitle') }}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-light" type="button" @click="$emit('close')" :aria-label="t('profile.editModal.close')">✕</button>
      </div>

      <div class="kp-modal-body">
        <div class="kp-avatar-row">
          <div class="kp-avatar">
            <img :src="previewAvatar" alt="avatar" />
          </div>
          <div class="kp-avatar-actions">
            <label class="btn btn-outline-primary btn-sm mb-2">
              {{ t('profile.editModal.changePhoto') }}
              <input class="d-none" type="file" accept="image/*" @change="onPick" />
            </label>
            <button class="btn btn-outline-secondary btn-sm" type="button" @click="removeAvatar" :disabled="!form.avatar">
              {{ t('profile.editModal.removePhoto') }}
            </button>
            <div class="text-muted small mt-1">{{ t('profile.editModal.photoHint') }}</div>
            <div v-if="errors.avatar" class="text-danger small mt-1">{{ errors.avatar }}</div>
          </div>
        </div>

        <div class="row g-3 mt-1">
          <div class="col-12">
            <label class="form-label fw-semibold">{{ t('profile.editModal.name') }}</label>
            <input v-model.trim="form.name" class="form-control" type="text" :placeholder="t('auth.enterName')" />
            <div v-if="errors.name" class="text-danger small mt-1">{{ errors.name }}</div>
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold">{{ t('profile.editModal.email') }}</label>
            <input v-model.trim="form.email" class="form-control" type="email" :placeholder="t('auth.enterEmail')" />
            <div v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</div>
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold">{{ t('profile.editModal.phone') }}</label>
            <input v-model.trim="form.phone" class="form-control" type="tel" :placeholder="t('auth.enterPhone')" />
            <div v-if="errors.phone" class="text-danger small mt-1">{{ errors.phone }}</div>
          </div>
        </div>
      </div>

      <div class="kp-modal-footer">
        <button class="btn btn-light" type="button" @click="$emit('close')">{{ t('profile.editModal.cancel') }}</button>
        <button class="btn btn-primary" type="button" :disabled="saving" @click="save">
          {{ saving ? t('profile.editModal.saving') : t('profile.editModal.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useI18nStore } from '@/stores/i18n.js'

const emit = defineEmits(['close', 'saved'])

const auth = useAuthStore()
auth.load()

const i18n = useI18nStore()
const t = i18n.t

const saving = ref(false)
const errors = reactive({ name: '', email: '', phone: '', avatar: '' })
const form = reactive({ name: '', email: '', phone: '', avatar: '' })

watchEffect(() => {
  form.name = auth.user?.name || ''
  form.email = auth.user?.email || ''
  form.phone = auth.user?.phone || ''
  form.avatar = auth.user?.avatar || ''
})

const previewAvatar = computed(() => form.avatar || '/assets/images/child.png')

function resetErrors() {
  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.avatar = ''
}

function validate() {
  resetErrors()
  if (!form.name?.trim()) errors.name = t('profile.errors.nameRequired')

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(form.email || '')) errors.email = t('profile.errors.emailInvalid')

  if (form.phone && !/^[0-9+\-() ]{6,20}$/.test(form.phone)) errors.phone = t('profile.errors.phoneInvalid')

  return !errors.name && !errors.email && !errors.phone && !errors.avatar
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('read-failed'))
    reader.readAsDataURL(file)
  })
}

async function onPick(e) {
  const file = e?.target?.files?.[0]
  if (!file) return
  if (!String(file.type || '').startsWith('image/')) return
  if (file.size > 700 * 1024) {
    errors.avatar = t('profile.errors.photoTooLarge')
    return
  }
  try {
    form.avatar = await fileToDataUrl(file)
  } catch {
    errors.avatar = t('profile.errors.photoReadFailed')
  }
}

function removeAvatar() {
  form.avatar = ''
}

async function save() {
  if (!validate()) return
  saving.value = true
  try {
    auth.updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      avatar: form.avatar
    })
    saving.value = false
    resetErrors()
    emit('saved')
    emit('close')
  } catch (err) {
    saving.value = false
    if (err?.message === 'email-exists') errors.email = t('profile.errors.emailExists')
    else errors.email = t('profile.errors.general')
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
  width: min(720px, 100%);
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

.kp-avatar-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.kp-avatar {
  width: 78px;
  height: 78px;
  border-radius: 999px;
  overflow: hidden;
  border: 3px solid rgba(144, 238, 144, 0.85);
  flex: 0 0 auto;
  background: #f3f4f6;
}

.kp-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.kp-avatar-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

@media (max-width: 576px) {
  .kp-avatar-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>


