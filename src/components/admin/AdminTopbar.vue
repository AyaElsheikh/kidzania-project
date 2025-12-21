<template>
  <nav class="topbar">
    <h6 class="mb-0">Dashboard Overview</h6>

    <div class="topbar-right">
      <router-link to="/" class="btn btn-primary btn-sm">Back to website</router-link>
      <input type="text" class="form-control search" placeholder="Search content...">
      <div class="user">
        <img src="/assets/images/adminSara.png" alt="admin-photo">
        <div>
          <h6>Sara Samy</h6>
          <small>editor</small>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  height: 70px;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
  transition: left 0.3s;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search {
  width: 250px;
  border-radius: 20px;
  background: #f8f9fa;
  border: none;
  padding: 8px 15px;
}
.search:focus {
  outline: none;
  background: #fff;
  border: 1px solid #eee;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  object-fit: cover;
}

@media (max-width: 768px) {
  .topbar {
    left: 0;
  }
}
</style>
