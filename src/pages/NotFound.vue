<template>
  <section class="container mx-auto px-4 py-20 text-center">
    <h2 class="section-title">{{ t('notFound.title') }}</h2>
    <p>404</p>
    <router-link to="/" class="btn mt-4">{{ t('notFound.back') }}</router-link>
  </section>
</template>

<script setup>
import { useI18nStore } from '@/stores/i18n.js'
const i18n = useI18nStore()
const t = i18n.t
</script>
