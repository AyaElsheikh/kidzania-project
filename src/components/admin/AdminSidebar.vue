<template>
  <aside class="sidebar">
    <div class="brand">
      <img src="/assets/blueLogo.png" alt="Kidzademy" class="me-2 ourlogo" />
      
    </div>

    <ul class="nav flex-column">
      <router-link to="/admin" custom v-slot="{ href, navigate, isExactActive }">
        <li class="nav-item" :class="{ active: isExactActive }" @click="navigate">
          <i class="bi bi-grid"></i> Dashboard
        </li>
      </router-link>
      <router-link to="/admin/courses" custom v-slot="{ href, navigate, isActive }">
        <li class="nav-item" :class="{ active: isActive }" @click="navigate">
          <i class="bi bi-book"></i> Courses
        </li>
      </router-link>
      <router-link to="/admin/exams" custom v-slot="{ href, navigate, isActive }">
        <li class="nav-item" :class="{ active: isActive }" @click="navigate">
          <i class="bi bi-file-earmark-text"></i> Tests
        </li>
      </router-link>
      <router-link to="/admin/users" custom v-slot="{ href, navigate, isActive }">
        <li class="nav-item" :class="{ active: isActive }" @click="navigate">
          <i class="bi bi-people"></i> Users
        </li>
      </router-link>
    </ul>

    <div class="logout" @click="handleLogout">
      <i class="bi bi-box-arrow-right"></i> Logout
    </div>
  </aside>
</template>

<script setup>
import { useAdminStore } from '@/stores/admin.js'
import { useRouter } from 'vue-router'

const admin = useAdminStore()
const router = useRouter()

const handleLogout = () => {
  admin.logout()
  router.push('/auth')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 20px;
  z-index: 1000;
  transition: transform 0.3s;
}
.ourlogo{

 width: 90%;
 height: 65px;
}

.brand {
  margin-bottom: 30px;
}

.brand h4 {
  color: #00aaff;
  margin-bottom: 0;
  font-weight: 700;
}
.brand span {
  font-size: 13px;
  color: #777;
}

.nav-item {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  color: #555;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}
.nav-item i {
  margin-right: 10px;
  font-size: 1.1rem;
}
.active,
.nav-item:hover {
  background: #e6f7ff;
  color: #00aaff;
}

.logout {
  position: absolute;
  bottom: 20px;
  width: calc(100% - 40px);
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  color: #dc3545;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}
.logout:hover {
  background: #fff5f5;
}
.logout i {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
}
</style>
