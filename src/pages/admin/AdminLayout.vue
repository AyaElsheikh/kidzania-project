<template>
  <div class="admin-wrapper">
    <AdminSidebar />
    <div class="main">
      <AdminTopbar />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import AdminTopbar from '@/components/admin/AdminTopbar.vue'
</script>

<style scoped>
.main {
  margin-left: 240px;
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: margin-left 0.3s;
}

.content {
  padding: 110px 40px 40px;
}

@media (max-width: 768px) {
  .main {
    margin-left: 0;
  }
}
</style>
