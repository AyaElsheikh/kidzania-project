<template>
  <section class="container mx-auto px-4 py-16">
    <div class="card max-w-md mx-auto">
      <h2 class="section-title">{{ exists ? t('nav.login') : t('auth.signup') }}</h2>
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <input v-model="name" :placeholder="t('auth.name')" class="p-3 rounded-xl border" />
        <input v-model="email" :placeholder="t('auth.email')" class="p-3 rounded-xl border" />
        <button class="btn" type="submit">{{ exists ? t('nav.login') : t('auth.signup') }}</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.js'
import { computed } from 'vue'
const name = ref('')
const email = ref('')
const auth = useAuthStore()
const router = useRouter()
auth.load()
const i18n = useI18nStore()
const t = i18n.t
const exists = computed(() => !!auth.users.find(u => u.email === email.value))
const onSubmit = () => {
  auth.loginOrRegister({ name: name.value || 'Guest', email: email.value || 'guest@example.com' })
  router.push('/profile')
}
</script>
