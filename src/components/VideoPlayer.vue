<template>
  <div class="card">
    <div v-if="!allowed" class="grid place-items-center h-48 bg-water rounded-xl">
      <p class="text-darkblue font-fredoka">{{ t('player.locked') }}</p>
    </div>
    <video v-else class="w-full rounded-xl" controls :src="videoUrl"></video>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useI18nStore } from '@/stores/i18n.js'
const props = defineProps({ courseId: { type: String, required: true }, videoUrl: { type: String, required: true } })
const sub = useSubscriptionStore()
sub.load()
const allowed = computed(() => sub.isSubscribed(props.courseId))
const i18n = useI18nStore()
const t = i18n.t
</script>
