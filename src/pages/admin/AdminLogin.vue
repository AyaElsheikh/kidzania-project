<template>
  <section class="container mx-auto px-4 py-16">
    <div class="card max-w-md mx-auto">
      <h2 class="section-title">Admin Access</h2>
      <div v-if="hasAdmin">
        <form class="flex flex-col gap-3" @submit.prevent="onLogin">
          <input v-model="username" placeholder="Username" class="p-3 rounded-xl border" />
          <input v-model="password" type="password" placeholder="Password" class="p-3 rounded-xl border" />
          <button class="btn" type="submit">Login</button>
        </form>
      </div>
      <div v-else>
        <form class="flex flex-col gap-3" @submit.prevent="onSetup">
          <input v-model="name" placeholder="Admin Name" class="p-3 rounded-xl border" />
          <input v-model="username" placeholder="Username" class="p-3 rounded-xl border" />
          <input v-model="password" type="password" placeholder="Password" class="p-3 rounded-xl border" />
          <button class="btn" type="submit">Create Admin</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const admin = useAdminStore()
admin.load()
const name = ref('')
const username = ref('')
const password = ref('')
const hasAdmin = computed(() => !!admin.admin)
const onSetup = () => { admin.setup({ name: name.value, username: username.value, password: password.value }); admin.loggedIn = true; router.push('/admin') }
const onLogin = () => { if (admin.login({ username: username.value, password: password.value })) router.push('/admin') }
</script>
