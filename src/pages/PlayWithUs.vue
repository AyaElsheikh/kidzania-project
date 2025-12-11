<template>
  <section class="container py-5">
    <h2 class="section-title text-center">{{ t('play.title') }}</h2>
    <p class="text-center text-muted mb-4">{{ t('play.subtitle') }}</p>
    <div class="row g-3">
      <div class="col-12 col-md-4">
        <div class="card text-center p-3 card-soft h-100">
          <div class="rounded-circle bg-pink d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 64px; height: 64px; font-size: 32px;">🎮</div>
          <h3 class="fs-5 text-darkblue mb-2">{{ t('play.games') }}</h3>
          <p class="text-muted small mb-0">{{ t('play.gamesDesc') }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card text-center p-3 card-soft h-100">
          <div class="rounded-circle bg-lightGreen d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 64px; height: 64px; font-size: 32px;">🎯</div>
          <h3 class="fs-5 text-darkblue mb-2">{{ t('play.activities') }}</h3>
          <p class="text-muted small mb-0">{{ t('play.activitiesDesc') }}</p>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card text-center p-3 card-soft h-100">
          <div class="rounded-circle bg-warning d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 64px; height: 64px; font-size: 32px;">🏆</div>
          <h3 class="fs-5 text-darkblue mb-2">{{ t('play.challenges') }}</h3>
          <p class="text-muted small mb-0">{{ t('play.challengesDesc') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18nStore } from '@/stores/i18n.js'
const i18n = useI18nStore()
const t = i18n.t
</script>

