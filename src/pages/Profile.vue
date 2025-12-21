<template>
  <div class="profile-page">
    <header class="hero">
      <h1 class="hero-title"><span>My Profile</span></h1>
    </header>

    <section class="container py-5">
      <ProfileHeaderCard />
      
      <div class="row g-4">
        <!-- Learning Progress -->
        <div class="col-lg-8">
          <LearningProgress />
        </div>

        <!-- Account Settings -->
        <div class="col-lg-4">
          <AccountSettings />
        </div>
      </div>
      
      <img src="/public/assets/images/OBJECTS.png" alt="Profile" class="profile-image">
    </section>
  </div>
</template>

<script setup>
import ProfileHeaderCard from '@/components/profile/ProfileHeaderCard.vue'
import LearningProgress from '@/components/profile/LearningProgress.vue'
import AccountSettings from '@/components/profile/AccountSettings.vue'
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
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
   background: linear-gradient(to right, #81DFFF, #90EE90);
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

.profile-image {
  display: block;
  margin: 2.5rem auto 0;
  max-width: 100%;
  height: auto;
}

@media (max-width: 480px) {
  .hero {
    height: 45vh;
    padding: 1rem;
  }
}
</style>
