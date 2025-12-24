<template>
  <div class="fixed inset-0 bg-black/40 grid place-items-center">
    <div class="card w-[90%] max-w-md">
      <h3 class="section-title">تسجيل الدخول</h3>
      <form class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <input v-model="name" placeholder="الاسم" class="p-3 rounded-xl border" />
        <input v-model="email" placeholder="الايميل" class="p-3 rounded-xl border" />
        <button class="btn" type="submit">دخول</button>
        <button class="btn-outline" type="button" @click="$emit('close')">إغلاق</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
const emit = defineEmits(['close'])
const name = ref('')
const email = ref('')
const auth = useAuthStore()
const router = useRouter()
auth.load()
const onSubmit = () => {
  // Use demo-friendly flow: create account if missing, then consider the user logged in.
  // Password is handled inside the store (defaulted for new users).
  auth.loginOrRegister({
    name: name.value || 'Guest',
    email: email.value || 'guest@example.com',
    password: '12345678',
    phone: ''
  })
  emit('close')
  router.push('/')
}
</script>
