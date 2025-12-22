<template>
  <div class="text-center mt-4">
    <img src="/public/assets/images/OBJECTS.png" 
         class="img-fluid mb-3 illustration" alt="illustration">

    <h5 class="adventure-title">New adventures coming soon!</h5>
    <p class="adventure-text">
      more lessons, fun tests, and educational games are on the way.<br>
      get ready to explore and have fun!
    </p>
  </div>
</template>

<style scoped>
.illustration {
  max-width: 100%;
  height: auto;
  opacity: 0.95;
}

.adventure-title {
  color: var(--primary, #033B62);
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 8px;
}

.adventure-text {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .illustration {
    max-width: 90%;
  }
  
  .adventure-title {
    font-size: 1.1rem;
  }
  
  .adventure-text {
    font-size: 0.85rem;
  }
}
</style>
