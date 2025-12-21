<template>
  <div class="d-flex flex-column min-vh-100 bg-light">
    <Header v-if="!shouldHideLayout" />
    <main class="flex-grow-1">
      <router-view />
    </main>
    <Footer v-if="!shouldHideLayout" />
    <AdminBadge v-if="!shouldHideLayout" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useI18nStore } from '@/stores/i18n.js'
const i18n = useI18nStore()
i18n.load()
import AdminBadge from '@/components/AdminBadge.vue'

const route = useRoute()
const shouldHideLayout = computed(() => {
  return route.name === 'auth' || route.path?.startsWith('/admin')
})
</script>
