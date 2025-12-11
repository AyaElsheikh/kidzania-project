<template>
  <footer class="text-white pt-5 mt-auto footstyle" >
    <div class="container pb-4 ">
      <div class="row gy-4  foot-content">
        <div class="col-lg-4">
          <router-link to="/" class="d-flex align-items-center gap-2 mb-3 text-white text-decoration-none">
            <img src="/assets/Logo.png" alt="Kidzademy" style="height: 40px;" />
            <span class="fw-bold fs-5">Kidzademy</span>
          </router-link>
          <p class="small text-white-50 mb-3">{{ t('footer.tagline') }}</p>
          <div class="d-flex gap-2">
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">f</a>
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        <div class="col-lg-4">
          <h5 class="fw-bold mb-3">{{ t('footer.pages') }}</h5>
          <div class="row row-cols-2 g-2">
            <div class="col">
              <ul class="list-unstyled small">
                <li class="mb-2"><router-link to="/" class="text-white-50 text-decoration-none">{{ t('nav.home') }}</router-link></li>
                <li class="mb-2"><router-link to="/about" class="text-white-50 text-decoration-none">{{ t('footer.aboutUs') }}</router-link></li>
                <li class="mb-2"><router-link to="/tests" class="text-white-50 text-decoration-none">{{ t('nav.tests') }}</router-link></li>
                <li class="mb-2"><router-link to="/courses" class="text-white-50 text-decoration-none">{{ t('nav.explore') }}</router-link></li>
              </ul>
            </div>
            <div class="col">
              <ul class="list-unstyled small">
                <li class="mb-2"><router-link to="/courses" class="text-white-50 text-decoration-none">{{ t('nav.courses') }}</router-link></li>
                <li class="mb-2"><router-link to="/feedbacks" class="text-white-50 text-decoration-none">{{ t('footer.feedbacks') }}</router-link></li>
                <li class="mb-2"><router-link to="/play" class="text-white-50 text-decoration-none">{{ t('nav.playWithUs') }}</router-link></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <h5 class="fw-bold mb-3">{{ t('footer.contactInfo') }}</h5>
          <ul class="list-unstyled small">
            <li class="d-flex align-items-center mb-3">
              <div class="text-dark rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 36px; height: 36px; background-color: #81DFFF;">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <span>{{ t('footer.phone') }}</span>
            </li>
            <li class="d-flex align-items-center mb-3">
              <div class="text-dark rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 36px; height: 36px; background-color: #90EE90;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span>{{ t('footer.email') }}</span>
            </li>
            <li class="d-flex align-items-center mb-3">
              <div class="text-dark rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 36px; height: 36px; background-color: #FFA07A;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span>{{ t('footer.address') }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-top border-light mt-4 pt-3 text-center text-white-50">
        <p class="small mb-0">{{ t('footer.copyright') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18nStore } from '@/stores/i18n.js'

const i18n = useI18nStore()
const t = i18n.t
</script>

<style scoped>
.footstyle {
  background: url('/assets/images/foot.png') top center / contain no-repeat;
 background-size: 100% auto;

}
.foot-content{
  padding-top:120px;
}
</style>
