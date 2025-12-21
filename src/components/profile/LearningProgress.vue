<template>
  <div class="card-custom h-100">
    <h5 class="mb-4">Your learning progress</h5>

    <div class="d-flex justify-content-around text-center mb-3">
      <div>
        <h3 class="text-primary-custom">8</h3>
        <p class="mb-0 text-muted">Courses</p>
      </div>
      <div>
        <h3 class="text-primary-custom">5</h3>
        <p class="mb-0 text-muted">Completed</p>
      </div>
    </div>

    <p class="text-center small">65% Completed</p>
    <div class="progress mb-4">
      <div class="progress-bar" style="width:65%"></div>
    </div>

    <div class="text-center">
      <button class="btn btn-success-custom rounded-pill px-5">Continue learning</button>
    </div>
  </div>
</template>

<style scoped>
.card-custom {
  background: #fff;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.text-primary-custom {
  color: var(--primary, #033B62);
  font-weight: bold;
}

.progress {
  height: 10px;
  border-radius: 10px;
  background-color: #e9ecef;
}

.progress-bar {
  background-color: var(--primary-medium, #00b4ff);
  border-radius: 10px;
}

.btn-success-custom {
  background-color: var(--secondary-green, #90EE90);
  border: none;
  color: #fff;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-success-custom:hover {
  filter: brightness(0.95);
}
</style>
