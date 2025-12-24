<template>
  <DragMatchGame
    title-key="games.numbers.title"
    subtitle-key="games.numbers.subtitle"
    how-to-key="games.numbers.howTo"
    label-title-key="games.numbers.labels"
    levels-route="/numbers-levels"
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
      { answer: '1', label: '1', altText: i18n.locale === 'ar' ? 'الرقم ١' : 'Number 1', imageUrl: resolveAssetUrl('one.png') },
      { answer: '2', label: '2', altText: i18n.locale === 'ar' ? 'الرقم ٢' : 'Number 2', imageUrl: resolveAssetUrl('two.png') },
      { answer: '3', label: '3', altText: i18n.locale === 'ar' ? 'الرقم ٣' : 'Number 3', imageUrl: resolveAssetUrl('three.png') }
    ]
  },
  {
    id: 2,
    items: [
      { answer: '4', label: '4', altText: i18n.locale === 'ar' ? 'الرقم ٤' : 'Number 4', imageUrl: resolveAssetUrl('four.png') },
      { answer: '5', label: '5', altText: i18n.locale === 'ar' ? 'الرقم ٥' : 'Number 5', imageUrl: resolveAssetUrl('five.png') },
      { answer: '6', label: '6', altText: i18n.locale === 'ar' ? 'الرقم ٦' : 'Number 6', imageUrl: resolveAssetUrl('six.png') }
    ]
  },
  {
    id: 3,
    items: [
      { answer: '7', label: '7', altText: i18n.locale === 'ar' ? 'الرقم ٧' : 'Number 7', imageUrl: resolveAssetUrl('seven .png') },
      { answer: '8', label: '8', altText: i18n.locale === 'ar' ? 'الرقم ٨' : 'Number 8', imageUrl: resolveAssetUrl('eight.png') },
      { answer: '9', label: '9', altText: i18n.locale === 'ar' ? 'الرقم ٩' : 'Number 9', imageUrl: resolveAssetUrl('nine.png') }
    ]
  },
  {
    id: 4,
    items: [
      { answer: '10', label: '10', altText: i18n.locale === 'ar' ? 'الرقم ١٠' : 'Number 10', imageUrl: resolveAssetUrl('ten.png') },
      { answer: '11', label: '11', altText: i18n.locale === 'ar' ? 'الرقم ١١' : 'Number 11', imageUrl: resolveAssetUrl('eleven.png') },
      { answer: '12', label: '12', altText: i18n.locale === 'ar' ? 'الرقم ١٢' : 'Number 12', imageUrl: resolveAssetUrl('twelve.png') }
    ]
  }
]))
</script>


