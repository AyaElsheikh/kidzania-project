<template>
  <div class="card h-100">
    <img :src="course.thumbnail" alt="thumb" class="card-img-top" style="height: 160px; object-fit: cover;" />
    <div class="card-body d-flex flex-column">
      <h3 class="card-title fs-5 text-darkblue mb-2">{{ displayTitle }}</h3>
      <p class="card-text text-muted small flex-grow-1">{{ displayDesc }}</p>
      <div class="d-flex align-items-center justify-content-between mt-3">
        <span class="fw-bold text-primary">${{ course.price }}</span>
        <router-link class="btn btn-primary btn-sm" :to="`/course/${course.id}`">{{ t('nav.signup') }}</router-link>
      </div>
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
