<template>
  <section class="lr-page" :dir="i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="lr-card">
      <div class="lr-left">
        <div class="lr-brand">
          <img src="/assets/Logo.png" alt="Kidzademy" class="lr-logo" />
        </div>

        <h1 class="lr-title">
          {{ i18n.locale === 'ar' ? 'لازم تسجّل دخول الأول' : 'Please log in first' }}
        </h1>
        <p class="lr-sub">
          {{
            i18n.locale === 'ar'
              ? 'عشان تقدر تستخدم الصفحة دي، من فضلك اعمل تسجيل دخول.'
              : 'To access this page, please log in.'
          }}
        </p>

        <div class="lr-actions">
          <router-link class="lr-btn lr-btn-primary" :to="loginLink">
            {{ i18n.locale === 'ar' ? 'تسجيل الدخول' : 'Log in' }}
          </router-link>
          <router-link class="lr-btn lr-btn-ghost" to="/courses">
            {{ i18n.locale === 'ar' ? 'استكشف الكورسات' : 'Explore courses' }}
          </router-link>
        </div>
      </div>

      <aside class="lr-right" aria-hidden="true"></aside>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.js'

const i18n = useI18nStore()
const route = useRoute()

const loginLink = computed(() => {
  const redirect = String(route.query.redirect || '/')
  return { name: 'auth', query: { redirect, reason: 'nav' } }
})
</script>

<style scoped>
.lr-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 28px 18px;
}

.lr-card {
  width: 100%;
  max-width: 980px;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(3, 59, 98, 0.08);
}

.lr-left {
  padding: clamp(26px, 5vw, 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.lr-brand {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
}

.lr-logo {
  height: 42px;
  width: auto;
}

.lr-title {
  margin: 0 0 10px;
  color: var(--primary, #033B62);
  font-weight: 900;
  font-size: clamp(1.8rem, 1.2rem + 1.6vw, 2.5rem);
  letter-spacing: 0.02em;
}

.lr-sub {
  margin: 0 0 18px;
  color: rgba(3, 59, 98, 0.75);
  font-weight: 700;
  line-height: 1.6;
  font-size: 1rem;
  max-width: 480px;
}

.lr-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.lr-btn {
  border-radius: 999px;
  padding: 12px 16px;
  text-decoration: none;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  white-space: nowrap;
}

.lr-btn-primary {
  background: var(--primary-medium, #00BFFF);
  color: #fff;
  box-shadow: 0 12px 26px rgba(0, 191, 255, 0.25);
}

.lr-btn-primary:hover {
  background: #00a8e6;
}

.lr-btn-ghost {
  background: rgba(3, 59, 98, 0.06);
  color: rgba(3, 59, 98, 0.9);
  border: 1px solid rgba(3, 59, 98, 0.12);
}

.lr-right {
  background: url('/assets/register.png') center/cover no-repeat;
  border-inline-start: 1px solid rgba(3, 59, 98, 0.08);
  min-height: 520px;
}

@media (max-width: 991px) {
  .lr-card {
    grid-template-columns: 1fr;
  }
  .lr-right {
    min-height: min(40vh, 340px);
    border-inline-start: none;
    border-top: 1px solid rgba(3, 59, 98, 0.08);
  }
}
</style>


