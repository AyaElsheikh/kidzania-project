<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr]">
    <aside class="bg-white shadow-card p-4">
      <h3 class="font-fredoka text-darkblue text-2xl mb-4">Admin</h3>
      <nav class="flex flex-col gap-3">
        <router-link to="/admin" class="btn-outline">Dashboard</router-link>
        <router-link to="/admin/courses" class="btn-outline">Courses</router-link>
        <router-link to="/admin/subscriptions" class="btn-outline">Subscriptions</router-link>
        <router-link to="/admin/exams" class="btn-outline">Exams</router-link>
        <router-link to="/" class="btn-outline">Website</router-link>
      </nav>
    </aside>
    <main class="p-6 bg-water">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin.js'
const admin = useAdminStore()
</script>
