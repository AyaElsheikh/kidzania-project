<template>
  <div class="card-custom h-100">
    <h6 class="mb-3">Account Settings</h6>

    <ul class="list-unstyled settings-list">
      <li>Language</li>
      <li>Change Password</li>
      <li>Kevin@email.com</li>
      <li class="text-danger">Logout</li>
    </ul>
  </div>
</template>

<style scoped>
.card-custom {
  background: #fff;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.settings-list li {
  padding: 12px 10px;
  border-radius: 12px;
  margin-bottom: 8px;
  background-color: #f7fbff;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 500;
  color: #333;
}

.settings-list li:hover {
  background-color: #e9f6ff;
  transform: translateX(5px);
}
</style>
