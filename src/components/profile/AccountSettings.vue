<template>
  <div class="card-custom h-100">
    <h6 class="mb-2">{{ t('profile.accountSettings.title') }}</h6>

    <ul class="list-unstyled settings-list">
      <li role="button" tabindex="0" @click="confirmLanguage" @keydown.enter.prevent="confirmLanguage">
        {{ t('profile.accountSettings.language') }}
        <span class="pill">{{ localeLabel }}</span>
      </li>
      <li role="button" tabindex="0" @click="$emit('change-password')" @keydown.enter.prevent="$emit('change-password')">
        {{ t('profile.accountSettings.changePassword') }}
      </li>
      <li class="email-item">{{ displayEmail }}</li>
      <li class="text-danger logout-item" role="button" tabindex="0" @click="confirmLogout" @keydown.enter.prevent="confirmLogout">
        {{ t('profile.accountSettings.logout') }}
      </li>
    </ul>
  </div>

  <ConfirmLogoutModal v-if="showLogout" @close="showLogout = false" @confirm="logout" />
  <ConfirmLanguageModal v-if="showLanguage" @close="showLanguage = false" @confirm="applyLanguage" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useI18nStore } from '@/stores/i18n.js'
import ConfirmLogoutModal from '@/components/profile/ConfirmLogoutModal.vue'
import ConfirmLanguageModal from '@/components/profile/ConfirmLanguageModal.vue'

defineEmits(['change-password'])

const router = useRouter()
const auth = useAuthStore()
auth.load()

const i18n = useI18nStore()
const t = i18n.t

const displayEmail = computed(() => auth.user?.email || t('profile.guestEmail'))
const localeLabel = computed(() => (i18n.locale === 'ar' ? 'العربية' : 'English'))

const showLogout = ref(false)
const showLanguage = ref(false)

const confirmLogout = () => { showLogout.value = true }
const confirmLanguage = () => { showLanguage.value = true }

const applyLanguage = () => {
  i18n.setLocale(i18n.locale === 'ar' ? 'en' : 'ar')
  showLanguage.value = false
}

const logout = () => {
  auth.logout()
  showLogout.value = false
  router.push('/')
}
</script>

<style scoped>
.card-custom {
  background: #fff;
  padding: 18px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.settings-list li {
  padding: 10px 8px;
  border-radius: 10px;
  margin-bottom: 6px;
  background-color: #f7fbff;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.settings-list li:hover {
  background-color: #e9f6ff;
  transform: translateX(5px);
}

.pill {
  background: rgba(0, 191, 255, 0.10);
  color: var(--primary, #033B62);
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  border: 1px solid rgba(0, 191, 255, 0.20);
}

.email-item {
  cursor: default;
  background-color: #ffffff;
  border: 1px dashed rgba(3, 59, 98, 0.18);
}

.logout-item {
  user-select: none;
}
</style>
