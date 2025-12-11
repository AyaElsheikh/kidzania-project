<template>
  <div class="d-flex align-items-center gap-2">
    <button
      class="btn"
      :style="locale==='ar' ? 'background-color: #00BFFF; color: white; border-color: #00BFFF;' : 'background-color: transparent; color: #00BFFF; border-color: #00BFFF;'"
      @click="set('ar')"
    >
      AR
    </button>
    <button
      class="btn"
      :style="locale==='en' ? 'background-color: #00BFFF; color: white; border-color: #00BFFF;' : 'background-color: transparent; color: #00BFFF; border-color: #00BFFF;'"
      @click="set('en')"
    >
      EN
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'
const i18n = useI18nStore()
const locale = computed(() => i18n.locale)
const set = (l) => i18n.setLocale(l)
</script>
