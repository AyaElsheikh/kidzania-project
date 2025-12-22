<template>
  <div class="profile-card d-flex justify-content-between align-items-center mb-3">
    <div class="d-flex align-items-center gap-3">
      <img src="/public/assets/images/child.png" class="profile-img" alt="profile">
      <div>
        <h4 class="mb-1">Kevin</h4>
        <span class="badge bg-success-subtle text-success">Level 2 (Grades 1-2)</span>
        <p class="mb-0 text-muted small">Kevin@email.com</p>
      </div>
    </div>
    <button class="btn btn-primary rounded-pill px-4">Edit Profile</button>
  </div>
</template>

<style scoped>
.profile-card {
  background: #fff;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.profile-img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: 3px solid var(--secondary-green, #5fd38d);
}

@media (max-width: 576px) {
  .profile-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}
</style>
