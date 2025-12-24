<template>
  <DragMatchGame
    title-key="games.shapes.title"
    subtitle-key="games.shapes.subtitle"
    how-to-key="games.shapes.howTo"
    label-title-key="games.shapes.labels"
    levels-route="/shapes-levels"
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
      { answer: 'cube', label: i18n.locale === 'ar' ? 'مكعب' : 'Cube', altText: i18n.locale === 'ar' ? 'مكعب' : 'Cube', imageUrl: resolveAssetUrl('cube.png') },
      { answer: 'circle', label: i18n.locale === 'ar' ? 'دائرة' : 'Circle', altText: i18n.locale === 'ar' ? 'دائرة' : 'Circle', imageUrl: resolveAssetUrl('circle.png') },
      { answer: 'heart', label: i18n.locale === 'ar' ? 'قلب' : 'Heart', altText: i18n.locale === 'ar' ? 'قلب' : 'Heart', imageUrl: resolveAssetUrl('heart.png') }
    ]
  },
  {
    id: 2,
    items: [
      { answer: 'hexagon', label: i18n.locale === 'ar' ? 'سداسي' : 'Hexagon', altText: i18n.locale === 'ar' ? 'سداسي' : 'Hexagon', imageUrl: resolveAssetUrl('hexagon.png') },
      { answer: 'octagon', label: i18n.locale === 'ar' ? 'ثماني' : 'Octagon', altText: i18n.locale === 'ar' ? 'ثماني' : 'Octagon', imageUrl: resolveAssetUrl('ocatgon.png') },
      { answer: 'oval', label: i18n.locale === 'ar' ? 'بيضاوي' : 'Oval', altText: i18n.locale === 'ar' ? 'بيضاوي' : 'Oval', imageUrl: resolveAssetUrl('oval.png') }
    ]
  },
  {
    id: 3,
    items: [
      { answer: 'pentagon', label: i18n.locale === 'ar' ? 'خماسي' : 'Pentagon', altText: i18n.locale === 'ar' ? 'خماسي' : 'Pentagon', imageUrl: resolveAssetUrl('pentagon.png') },
      { answer: 'rectangle', label: i18n.locale === 'ar' ? 'مستطيل' : 'Rectangle', altText: i18n.locale === 'ar' ? 'مستطيل' : 'Rectangle', imageUrl: resolveAssetUrl('rectangle.png') },
      { answer: 'square', label: i18n.locale === 'ar' ? 'مربع' : 'Square', altText: i18n.locale === 'ar' ? 'مربع' : 'Square', imageUrl: resolveAssetUrl('square.png') }
    ]
  },
  {
    id: 4,
    items: [
      { answer: 'star', label: i18n.locale === 'ar' ? 'نجمة' : 'Star', altText: i18n.locale === 'ar' ? 'نجمة' : 'Star', imageUrl: resolveAssetUrl('star.png') },
      { answer: 'trapezoid', label: i18n.locale === 'ar' ? 'شبه منحرف' : 'Trapezoid', altText: i18n.locale === 'ar' ? 'شبه منحرف' : 'Trapezoid', imageUrl: resolveAssetUrl('trapezoid.png') },
      { answer: 'triangle', label: i18n.locale === 'ar' ? 'مثلث' : 'Triangle', altText: i18n.locale === 'ar' ? 'مثلث' : 'Triangle', imageUrl: resolveAssetUrl('Triangle.png') }
    ]
  }
]))
</script>


