<template>
  <div class="language-switch-container" @click="toggleLanguage">
    <div class="language-switch" :class="{ 'switch-en': locale === 'en', 'switch-ar': locale === 'ar' }">
      <div class="switch-slider"></div>
      <div class="switch-options">
        <span class="switch-option" :class="{ active: locale === 'ar' }">AR</span>
        <span class="switch-option" :class="{ active: locale === 'en' }">EN</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18nStore } from '@/stores/i18n.js'

const i18n = useI18nStore()
const locale = computed(() => i18n.locale)

const toggleLanguage = () => {
  const newLocale = locale.value === 'ar' ? 'en' : 'ar'
  i18n.setLocale(newLocale)
}
</script>

<style scoped>
.language-switch-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.language-switch {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: clamp(0.25rem, 0.3vh, 0.35rem) clamp(0.3rem, 0.4vw, 0.5rem);
  min-width: clamp(5.5rem, 5.5rem + 2vw, 7rem);
  height: clamp(2rem, 2rem + 0.8vh, 2.5rem);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.language-switch:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.switch-slider {
  position: absolute;
  left: clamp(0.3rem, 0.3rem + 0.2vw, 0.5rem);
  top: 50%;
  transform: translateY(-50%);
  width: calc(50% - clamp(0.3rem, 0.3rem + 0.2vw, 0.5rem));
  height: calc(100% - clamp(0.5rem, 0.6vh, 0.7rem));
  background: var(--primary-medium, #00BFFF);
  border-radius: 50px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 191, 255, 0.3);
  z-index: 1;
}

.language-switch.switch-en .switch-slider {
  left: calc(50% + clamp(0.15rem, 0.15rem + 0.1vw, 0.25rem));
}

.switch-options {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.switch-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--navbar-font-size, clamp(0.75rem, 0.7rem + 0.3vw, 0.95rem));
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 3;
}

.switch-option.active {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Animation for text */
.switch-option {
  transform: scale(0.95);
  opacity: 0.8;
}

.switch-option.active {
  transform: scale(1);
  opacity: 1;
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .language-switch {
    min-width: 5rem;
    height: 2rem;
    padding: 0.25rem 0.4rem;
  }
  
  .switch-option {
    font-size: var(--navbar-font-size, 0.85rem);
  }
}

@media (max-width: 768px) {
  .language-switch {
    min-width: 4.5rem;
    height: 1.9rem;
  }
  
  .switch-option {
    font-size: 0.8rem;
  }
}

@media (max-width: 576px) {
  .language-switch {
    min-width: 4rem;
    height: 1.8rem;
    padding: 0.2rem 0.3rem;
  }
  
  .switch-option {
    font-size: 0.75rem;
  }
  
  .switch-slider {
    left: 0.25rem;
    height: calc(100% - 0.5rem);
  }
  
  .language-switch.switch-en .switch-slider {
    left: calc(50% + 0.1rem);
  }
}

/* RTL Support */
[dir="rtl"] .language-switch.switch-en .switch-slider {
  left: clamp(0.3rem, 0.3rem + 0.2vw, 0.5rem);
}

[dir="rtl"] .language-switch.switch-ar .switch-slider {
  left: calc(50% + clamp(0.15rem, 0.15rem + 0.1vw, 0.25rem));
}
</style>
