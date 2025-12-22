<template>
  <div class="card-custom h-100">
    <h6 class="mb-2">Account Settings</h6>

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
  padding: 18px 20px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.settings-list li {
  padding: 10px 8px;
  border-radius: 10px;
  margin-bottom: 6px;
  background-color: #f7fbff;
  cursor: pointer;
  transition: 0.3s;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.settings-list li:hover {
  background-color: #e9f6ff;
  transform: translateX(5px);
}
</style>
