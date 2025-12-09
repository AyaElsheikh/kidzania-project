<template>
  <div class="min-h-screen flex flex-col bg-water">
    <Header />
    <main class="flex-1">
      <router-view />
    </main>
    <Footer />
    <AdminBadge />
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useI18nStore } from '@/stores/i18n.js'
const i18n = useI18nStore()
i18n.load()
import AdminBadge from '@/components/AdminBadge.vue'
</script>
