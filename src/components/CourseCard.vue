<template>
  <div class="card flex flex-col">
    <img :src="course.thumbnail" alt="thumb" class="w-full h-40 object-cover rounded-xl" />
    <h3 class="mt-3 font-fredoka text-xl text-darkblue">{{ displayTitle }}</h3>
    <p class="text-sm text-gray-600">{{ displayDesc }}</p>
    <div class="mt-4 flex items-center justify-between">
      <span class="font-fredoka text-deepSkyBlue">${{ course.price }}</span>
      <router-link class="btn" :to="`/course/${course.id}`">{{ t('nav.signup') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'
const i18n = useI18nStore()
const t = i18n.t
const props = defineProps({ course: { type: Object, required: true } })
const displayTitle = computed(() => i18n.locale === 'en' ? (props.course.title_en || props.course.title) : (props.course.title_ar || props.course.title))
const displayDesc = computed(() => i18n.locale === 'en' ? (props.course.description_en || props.course.description) : (props.course.description_ar || props.course.description))
</script>
