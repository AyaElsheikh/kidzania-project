<template>
  <div class="flex items-center gap-2">
    <button :class="locale==='ar' ? 'btn' : 'btn-outline'" @click="set('ar')">AR</button>
    <button :class="locale==='en' ? 'btn' : 'btn-outline'" @click="set('en')">EN</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'
const i18n = useI18nStore()
const locale = computed(() => i18n.locale)
const set = (l) => i18n.setLocale(l)
</script>
