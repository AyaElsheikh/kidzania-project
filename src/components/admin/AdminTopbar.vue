<template>
  <nav class="topbar">
    <div class="d-flex align-items-center">
      <h6 class="mb-0 page-title">Dashboard Overview</h6>
    </div>

    <div class="topbar-right">
      <button class="back-to-website-btn" @click="$router.push('/')">
        <i class="bi bi-globe btn-icon"></i>
        <span>Back to website</span>
      </button>
      
      <div class="search-container">
        <i class="bi bi-search search-icon"></i>
        <input type="text" class="form-control search-input" placeholder="Search content...">
      </div>

      <div class="user-profile">
        <img src="/assets/images/adminSara.png" alt="Profile" 
             onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=Sara+Samy&background=0D8ABC&color=fff'" />
        <div class="user-info">
          <h6>Sara Samy</h6>
          <span>Editor</span>
        </div>
      </div>
    </div>
  </nav>
</template>



<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 240px; /* Matched sidebar width */
  right: 0;
  height: 80px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 900;
  transition: left 0.3s ease;
  --primary-blue: #00BFFF;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #111418;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.back-to-website-btn {
    background-color: var(--primary-blue);
    color: white;
    border: none;
    padding: 12px 20px 12px 15px;
    border-radius: 16px; /* Increased roundness */
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
    min-width: 160px;
}

.back-to-website-btn:hover {
    background-color: #0099CC;
}

.btn-icon {
    font-size: 18px;
}

/* Fallback icon style if image fails */
.back-to-website-btn i {
    font-size: 16px;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  font-size: 14px;
}

.search-input {
  width: 250px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid #E5E7EB;
  padding-left: 40px;
  font-size: 14px;
  background-color: #F9FAFB;
}

.search-input:focus {
  background-color: white;
  border-color: #00BFFF;
  box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h6 {
  font-size: 14px;
  font-weight: 600;
  color: #111418;
  margin: 0;
}

.user-info span {
  font-size: 12px;
  color: #617289;
  display: block;
}

@media (max-width: 768px) {
  .topbar {
    left: 0;
    padding: 0 20px;
  }
  
  .back-to-website-btn, .search-container {
    display: none;
  }
}
</style>
