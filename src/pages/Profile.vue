<template>
  <div class="profile-page">
    <header class="hero">
      <div class="hero-content">
        <h1 class="hero-title">My profile</h1>
        <p class="hero-subtitle">Keep learning and growing, explorer!</p>
      </div>
    </header>

    <section class="container py-3">
      <ProfileHeaderCard />
      
      <div class="row g-3">
        <!-- Learning Progress -->
        <div class="col-lg-8">
          <LearningProgress />
        </div>

        <!-- Account Settings -->
        <div class="col-lg-4">
          <AccountSettings />
        </div>
      </div>
      
      <ProfileIllustration />
    </section>
  </div>
</template>

<script setup>
import ProfileHeaderCard from '@/components/profile/ProfileHeaderCard.vue'
import LearningProgress from '@/components/profile/LearningProgress.vue'
import AccountSettings from '@/components/profile/AccountSettings.vue'
import ProfileIllustration from '@/components/profile/ProfileIllustration.vue'
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.profile-page {
  background-color: #ffffff;
  min-height: 100vh;
}

.hero {
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(to right, #81DFFF, #90EE90);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 40px 20px;
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  line-height: 1.2;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 8px;
}

.hero-subtitle {
  color: #ffffff;
  margin: 0;
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-weight: 400;
  opacity: 0.95;
}

@media (max-width: 480px) {
  .hero {
    min-height: 180px;
    padding: 30px 15px;
  }
  
  .hero-title {
    font-size: 1.5rem;
  }
  
  .hero-subtitle {
    font-size: 0.85rem;
  }
}
</style>
