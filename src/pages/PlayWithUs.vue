<template>
  <header class="hero">
    <h1 class="hero-title"><span>Play</span><span>With Us</span></h1>
  </header>
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



<style scoped>
* {
  box-sizing: border-box;
}

.hero {
  width: 100%;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('/public/assets/images/Play\ with\ us.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.hero-title {
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  line-height: 1;
 font-size: clamp(2rem, 6vw, 4.5rem);
}
.hero-title span {
  display: block;
}

@media (max-width: 480px) {
  .hero {
    height: 45vh;
    padding: 1rem;
  }
}
</style>


