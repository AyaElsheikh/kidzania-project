<template>
  <div>
    <header class="hero">
      <h1 class="hero-title">My Learning Journey</h1>
      <p>welcome back, champion! Keep going to unlock new achievements</p>
    </header>
    <section class="container mx-auto px-4 py-10">
      <h2 class="section-title">{{ t('profile.title') }}</h2>
      <div v-if="courses.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CourseCard v-for="c in courses" :key="c.id" :course="c" />
      </div>
      <p v-else>{{ t('profile.empty') }}</p>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import CourseCard from '@/components/CourseCard.vue'
import { useI18nStore } from '@/stores/i18n.js'
const store = useCoursesStore()
const sub = useSubscriptionStore()
onMounted(() => { store.load(); sub.load() })
const courses = computed(() => store.courses.filter(c => sub.isSubscribed(c.id)))
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
  flex-direction: column;
  text-align: center;
  background-image: url('/public/assets/images/Mycourses.png');
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
.hero p {
  color: #ffffff;
  margin-top: 1rem;      
  font-size: 1.1rem;
}



@media (max-width: 480px) {
  .hero {
    height: 45vh;
    padding: 1rem;
  }
   .hero-title {
    font-size: 1.8rem;
  }
}
</style>
