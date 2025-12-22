<template>
  <header class="shadow-sm">
    <nav class="navbar navbar-expand-lg navbar-dark kidzademy-navbar py-3">
      <div class="container d-flex align-items-center">
        <router-link to="/" class="navbar-brand d-flex align-items-center">
          <img src="/assets/Logo.png" alt="Kidzademy" class="navbar-logo" />
        </router-link>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-lg-center navbar-nav-list">
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link"
                :class="{ active: $route.path === '/' }"
              >
                {{ t('nav.home') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/tests"
                class="nav-link"
                :class="{ active: $route.path === '/tests' }"
              >
                {{ t('nav.tests') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/my-courses"
                class="nav-link"
                :class="{ active: $route.path === '/my-courses' }"
              >
                {{ t('nav.myCourses') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/courses"
                class="nav-link"
                :class="{ active: $route.path.startsWith('/courses') }"
              >
                {{ t('nav.explore') }}
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/play"
                class="nav-link"
                :class="{ active: $route.path === '/play' }"
              >
                {{ t('nav.playWithUs') }}
              </router-link>
            </li>
            <li class="nav-item">
              <LanguageSwitch />
            </li>
            <li class="nav-item navbar-spacing" v-if="admin.loggedIn">
              <router-link to="/admin" class="btn btn-warning text-dark fw-bold">
                {{ t('nav.admin') }}
              </router-link>
            </li>
            <li class="nav-item navbar-spacing">
              <router-link to="/auth" class="btn register-btn text-white fw-semibold">
                {{ auth.isAuthenticated ? t('nav.loginButton') : t('nav.signupButton') }}
              </router-link>
            </li>
            <li class="nav-item navbar-spacing">
              <router-link
                to="/profile"
                class="profile-icon"
                :class="{ active: $route.path === '/profile' }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="profile-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useI18nStore } from '@/stores/i18n.js'
import { useAuthStore } from '@/stores/auth.js'
import { useRoute } from 'vue-router'
import LanguageSwitch from '@/components/LanguageSwitch.vue'

const i18n = useI18nStore()
const auth = useAuthStore()
import { useAdminStore } from '@/stores/admin.js'
const admin = useAdminStore()
const route = useRoute()
const t = i18n.t
auth.load()
</script>

<style scoped>
.navbar-logo {
  height: var(--navbar-logo-size, clamp(2rem, 2rem + 1.5vw, 3rem));
  width: auto;
  margin-right: clamp(1%, 1% + 0.5vw, 2%);
  transition: height 0.3s ease;
}

.navbar-nav-list {
  gap: var(--navbar-gap, clamp(0.15rem, 0.15rem + 0.4vw, 0.5rem));
  transition: gap 0.3s ease;
}

.navbar-spacing {
  margin-left: var(--navbar-gap, clamp(0.25rem, 0.25rem + 0.4vw, 0.5rem));
  transition: margin 0.3s ease;
}

/* Smooth transitions for responsive changes */
.kidzademy-navbar * {
  transition: font-size 0.3s ease, padding 0.3s ease, margin 0.3s ease;
}

@media (max-width: 991px) {
  .navbar-nav-list {
    gap: var(--navbar-gap, 0.3rem);
  }
  
  .navbar-spacing {
    margin-left: 0;
    margin-top: 0.3rem;
  }
}

@media (max-width: 576px) {
  .navbar-logo {
    margin-right: 1%;
  }
}
</style>
