<template>
  <div class="profile-card d-flex justify-content-between align-items-center mb-3">
    <div class="d-flex align-items-center gap-3">
      <img :src="avatarSrc" class="profile-img" alt="profile">
      <div>
        <h4 class="mb-1">{{ displayName }}</h4>
        <span class="badge bg-success-subtle text-success">{{ t('profile.levelBadge') }}</span>
        <p class="mb-0 text-muted small">{{ displayEmail }}</p>
        <p v-if="displayPhone" class="mb-0 text-muted small">{{ displayPhone }}</p>
        <div v-if="displayAge || displayGrade" class="mt-1 d-flex flex-wrap gap-2">
          <span v-if="displayAge" class="badge bg-primary-subtle text-primary">{{ ageLabel }}</span>
          <span v-if="displayGrade" class="badge bg-secondary-subtle text-secondary">{{ gradeLabel }}</span>
        </div>
      </div>
    </div>
    <button class="btn btn-primary rounded-pill px-4" type="button" @click="$emit('edit')">
      {{ t('profile.editProfile') }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useI18nStore } from '@/stores/i18n.js'

defineEmits(['edit'])

const auth = useAuthStore()
auth.load()

const i18n = useI18nStore()
const t = i18n.t

const displayName = computed(() => auth.user?.name || t('profile.guestName'))
const displayEmail = computed(() => auth.user?.email || t('profile.guestEmail'))
const displayPhone = computed(() => auth.user?.phone || '')
const displayAge = computed(() => auth.user?.age || '')
const displayGrade = computed(() => auth.user?.grade || '')
const ageLabel = computed(() => (i18n.locale === 'ar' ? `العمر: ${displayAge.value}` : `Age: ${displayAge.value}`))
const gradeLabel = computed(() => (i18n.locale === 'ar' ? `الصف: ${displayGrade.value}` : `Grade: ${displayGrade.value}`))
const avatarSrc = computed(() => auth.user?.avatar || '/assets/images/child.png')
</script>

<style scoped>
.profile-card {
  background: #fff;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.profile-img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: 3px solid var(--secondary-green, #5fd38d);
  object-fit: cover;
}

@media (max-width: 576px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
