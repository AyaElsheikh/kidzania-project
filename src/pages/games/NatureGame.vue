<template>
  <DragMatchGame
    title-key="games.nature.title"
    subtitle-key="games.nature.subtitle"
    how-to-key="games.nature.howTo"
    label-title-key="games.nature.labels"
    levels-route="/nature-levels"
    :level-id="route.params.levelId"
    :levels="levels"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.js'
import DragMatchGame from './DragMatchGame.vue'
import { resolveAssetUrl } from '@/utils/resolveAssetUrl.js'

const route = useRoute()
const i18n = useI18nStore()

const levels = computed(() => ([
  {
    id: 1,
    items: [
      { answer: 'sun', label: i18n.locale === 'ar' ? 'شمس' : 'Sun', altText: i18n.locale === 'ar' ? 'شمس' : 'Sun', imageUrl: resolveAssetUrl('nature/sun.png') },
      { answer: 'moon', label: i18n.locale === 'ar' ? 'قمر' : 'Moon', altText: i18n.locale === 'ar' ? 'قمر' : 'Moon', imageUrl: resolveAssetUrl('nature/moon.png') },
      { answer: 'stars', label: i18n.locale === 'ar' ? 'نجوم' : 'Stars', altText: i18n.locale === 'ar' ? 'نجوم' : 'Stars', imageUrl: resolveAssetUrl('nature/stars.png') }
    ]
  },
  {
    id: 2,
    items: [
      { answer: 'trees', label: i18n.locale === 'ar' ? 'أشجار' : 'Trees', altText: i18n.locale === 'ar' ? 'أشجار' : 'Trees', imageUrl: resolveAssetUrl('nature/trees.png') },
      { answer: 'flowers', label: i18n.locale === 'ar' ? 'زهور' : 'Flowers', altText: i18n.locale === 'ar' ? 'زهور' : 'Flowers', imageUrl: resolveAssetUrl('nature/flowers.png') },
      { answer: 'rain', label: i18n.locale === 'ar' ? 'مطر' : 'Rain', altText: i18n.locale === 'ar' ? 'مطر' : 'Rain', imageUrl: resolveAssetUrl('nature/rain.png') }
    ]
  },
  {
    id: 3,
    items: [
      { answer: 'rainbow', label: i18n.locale === 'ar' ? 'قوس قزح' : 'Rainbow', altText: i18n.locale === 'ar' ? 'قوس قزح' : 'Rainbow', imageUrl: resolveAssetUrl('nature/rainbow.png') },
      { answer: 'mountains', label: i18n.locale === 'ar' ? 'جبال' : 'Mountains', altText: i18n.locale === 'ar' ? 'جبال' : 'Mountains', imageUrl: resolveAssetUrl('nature/mountains.png') },
      { answer: 'rivers', label: i18n.locale === 'ar' ? 'أنهار' : 'Rivers', altText: i18n.locale === 'ar' ? 'أنهار' : 'Rivers', imageUrl: resolveAssetUrl('nature/rivers.png') }
    ]
  },
  {
    id: 4,
    items: [
      { answer: 'clouds', label: i18n.locale === 'ar' ? 'سحب' : 'Clouds', altText: i18n.locale === 'ar' ? 'سحب' : 'Clouds', imageUrl: resolveAssetUrl('nature/clouds.png') },
      { answer: 'animals', label: i18n.locale === 'ar' ? 'حيوانات' : 'Animals', altText: i18n.locale === 'ar' ? 'حيوانات' : 'Animals', imageUrl: resolveAssetUrl('nature/animals.png') },
      { answer: 'rocks', label: i18n.locale === 'ar' ? 'صخور' : 'Rocks', altText: i18n.locale === 'ar' ? 'صخور' : 'Rocks', imageUrl: resolveAssetUrl('nature/rocks.png') }
    ]
  }
]))
</script>


