<template>
  <DragMatchGame
    title-key="games.animals.title"
    subtitle-key="games.animals.subtitle"
    how-to-key="games.animals.howTo"
    label-title-key="games.animals.labels"
    levels-route="/animals-levels"
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
      { answer: 'cow', label: i18n.locale === 'ar' ? 'بقرة' : 'Cow', altText: i18n.locale === 'ar' ? 'بقرة' : 'Cow', imageUrl: resolveAssetUrl('cow.png') },
      { answer: 'sheep', label: i18n.locale === 'ar' ? 'خروف' : 'Sheep', altText: i18n.locale === 'ar' ? 'خروف' : 'Sheep', imageUrl: resolveAssetUrl('sheep.png') },
      { answer: 'fish', label: i18n.locale === 'ar' ? 'سمكة' : 'Fish', altText: i18n.locale === 'ar' ? 'سمكة' : 'Fish', imageUrl: resolveAssetUrl('fish.png') }
    ]
  },
  {
    id: 2,
    items: [
      { answer: 'rabbit', label: i18n.locale === 'ar' ? 'أرنب' : 'Rabbit', altText: i18n.locale === 'ar' ? 'أرنب' : 'Rabbit', imageUrl: resolveAssetUrl('Rappit.png') },
      { answer: 'duck', label: i18n.locale === 'ar' ? 'بطة' : 'Duck', altText: i18n.locale === 'ar' ? 'بطة' : 'Duck', imageUrl: resolveAssetUrl('Duck.png') },
      { answer: 'horse', label: i18n.locale === 'ar' ? 'حصان' : 'Horse', altText: i18n.locale === 'ar' ? 'حصان' : 'Horse', imageUrl: resolveAssetUrl('horse.png') }
    ]
  },
  {
    id: 3,
    items: [
      { answer: 'donkey', label: i18n.locale === 'ar' ? 'حمار' : 'Donkey', altText: i18n.locale === 'ar' ? 'حمار' : 'Donkey', imageUrl: resolveAssetUrl('donkey.png') },
      { answer: 'bear', label: i18n.locale === 'ar' ? 'دب' : 'Bear', altText: i18n.locale === 'ar' ? 'دب' : 'Bear', imageUrl: resolveAssetUrl('bear.png') },
      { answer: 'whale', label: i18n.locale === 'ar' ? 'حوت' : 'Whale', altText: i18n.locale === 'ar' ? 'حوت' : 'Whale', imageUrl: resolveAssetUrl('whale.png') }
    ]
  },
  {
    id: 4,
    items: [
      { answer: 'elephant', label: i18n.locale === 'ar' ? 'فيل' : 'Elephant', altText: i18n.locale === 'ar' ? 'فيل' : 'Elephant', imageUrl: resolveAssetUrl('elephant.png') },
      { answer: 'chicken', label: i18n.locale === 'ar' ? 'دجاجة' : 'Chicken', altText: i18n.locale === 'ar' ? 'دجاجة' : 'Chicken', imageUrl: resolveAssetUrl('chicken.png') },
      { answer: 'giraffe', label: i18n.locale === 'ar' ? 'زرافة' : 'Giraffe', altText: i18n.locale === 'ar' ? 'زرافة' : 'Giraffe', imageUrl: resolveAssetUrl('giraffe.png') }
    ]
  }
]))
</script>


