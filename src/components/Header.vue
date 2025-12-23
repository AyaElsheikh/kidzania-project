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
          <div class="nav-layout">
            <!-- Tabs (centered) -->
            <ul class="navbar-nav nav-tabs-list">
              <li class="nav-item">
                <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
                  {{ t('nav.home') }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/tests" class="nav-link" :class="{ active: $route.path === '/tests' }">
                  {{ t('nav.tests') }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/my-courses" class="nav-link" :class="{ active: $route.path === '/my-courses' }">
                  {{ t('nav.myCourses') }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/courses" class="nav-link" :class="{ active: $route.path.startsWith('/courses') }">
                  {{ t('nav.explore') }}
                </router-link>
              </li>
              <li class="nav-item">
                <router-link to="/play" class="nav-link" :class="{ active: $route.path === '/play' }">
                  {{ t('nav.playWithUs') }}
                </router-link>
              </li>
            </ul>

            <!-- Actions (edge aligned) -->
            <ul class="navbar-nav nav-actions-list">
              <li class="nav-item">
                <LanguageSwitch />
              </li>

              <li class="nav-item navbar-spacing" v-if="admin.loggedIn">
                <router-link to="/admin" class="admin-btn" :class="{ active: $route.path.startsWith('/admin') }">
                  <span class="admin-btn-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                  <span class="admin-btn-text">{{ t('nav.admin') }}</span>
                </router-link>
              </li>

              <li class="nav-item navbar-spacing" v-if="!auth.isAuthenticated">
                <router-link to="/auth" class="btn register-btn text-white fw-semibold">
                  {{ t('nav.loginButton') }}
                </router-link>
              </li>
              <li class="nav-item navbar-spacing" v-else>
                <router-link to="/profile" class="profile-icon" :class="{ active: $route.path === '/profile' }">
                  <svg xmlns="http://www.w3.org/2000/svg" class="profile-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </router-link>
              </li>
            </ul>
          </div>
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
  margin-inline-end: clamp(14px, 1.4vw, 26px);
  transition: height 0.3s ease;
}

.navbar-spacing {
  margin-inline-start: var(--navbar-gap, clamp(0.25rem, 0.25rem + 0.4vw, 0.5rem));
  transition: margin 0.3s ease;
}

/* Layout: tabs centered, actions aligned to edges */
.nav-layout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: clamp(0.4rem, 0.4rem + 0.6vw, 0.9rem);
}

.nav-tabs-list {
  flex: 1 1 auto;
  justify-content: center;
  gap: clamp(0.2rem, 0.2rem + 0.6vw, 0.85rem);
}

.nav-actions-list {
  flex: 0 0 auto;
  justify-content: flex-end;
  align-items: center;
  gap: clamp(0.25rem, 0.25rem + 0.6vw, 0.75rem);
}

/* Admin button (more professional) */
.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 999px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 900;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.28), rgba(0, 191, 255, 0.18));
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.14);
  transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
  white-space: nowrap;
}

.admin-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.18);
}

.admin-btn-icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.admin-btn-icon svg {
  width: 18px;
  height: 18px;
}

.admin-btn.active {
  outline: 2px solid rgba(144, 238, 144, 0.55);
  outline-offset: 2px;
}

/* Smooth transitions for responsive changes */
.kidzademy-navbar * {
  transition: font-size 0.3s ease, padding 0.3s ease, margin 0.3s ease;
}

@media (max-width: 991px) {
  .nav-layout {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .nav-tabs-list,
  .nav-actions-list {
    justify-content: flex-start;
    flex-wrap: wrap;
    row-gap: 0.25rem;
    column-gap: 0.5rem;
  }
  
  .navbar-spacing {
    margin-inline-start: 0;
    margin-top: 0.3rem;
  }
}

@media (max-width: 576px) {
  .navbar-logo {
    margin-inline-end: 10px;
  }
}
</style>
