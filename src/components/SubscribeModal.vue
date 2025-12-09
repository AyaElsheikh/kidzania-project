<template>
  <div class="fixed inset-0 bg-black/40 grid place-items-center">
    <div class="card w-[90%] max-w-md">
      <h3 class="section-title">{{ t('subscribe.title') }}</h3>
      <p class="mb-4">{{ question }}</p>
      <div class="flex gap-3">
        <button class="btn" @click="confirm">{{ t('courseDetail.subscribe') }}</button>
        <button class="btn-outline" @click="$emit('close')">{{ t('notFound.back') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'
const props = defineProps({ courseId: { type: String, required: true } })
const sub = useSubscriptionStore()
const router = useRouter()
sub.load()
const i18n = useI18nStore()
const t = i18n.t
const question = computed(() => i18n.locale === 'en' ? 'Do you want to subscribe to this course?' : 'هل تريد الاشتراك في هذا الكورس؟')
const confirm = () => {
  sub.subscribe(props.courseId)
  router.push('/profile')
}
</script>
