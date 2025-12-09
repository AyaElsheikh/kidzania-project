<template>
  <router-link v-if="loggedIn" to="/admin" class="fixed bottom-6 right-6 z-50">
    <div class="bg-darkblue text-white rounded-full px-4 py-3 shadow-card flex items-center gap-2">
      <span class="w-6 h-6 bg-gold rounded-full grid place-items-center text-darkblue font-fredoka">A</span>
      <span class="font-fredoka">Admin</span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useAdminStore } from '@/stores/admin.js'
const admin = useAdminStore()
const loggedIn = computed(() => admin.loggedIn)
</script>
