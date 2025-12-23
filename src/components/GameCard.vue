<template>
  <div class="card-game h-100">
    <img :src="imageSrc" :alt="title" class="card-image">
    <h4 class="card-title">{{ title }}</h4>
    <p class="card-description">{{ description }}</p>
    <button class="btn-play">{{ buttonText }}</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: 'Play'
  }
});

// Simple fix for images: check if it's a full URL, otherwise assume it's in public/assets/images/
// If the user uploads the images to src/assets, we would need to import them differently in Vite (e.g. glob import).
// For now, assuming public folder or simple path is safest to avoid build errors.
const imageSrc = computed(() => {
  if (props.image.startsWith('http') || props.image.startsWith('//') || props.image.startsWith('/')) {
    return props.image;
  }
  return `/assets/images/${props.image}`;
});
</script>

<style scoped>
.card-game {
  background: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.card-game:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 15px;
}

.card-title {
  color: #00335a;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 18px;
  text-align: left;
}

.card-description {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  flex-grow: 1; /* Ensure description pushes button down if consistent height is needed */
  text-align: left;
}

.btn-play {
  background-color: #00bfff;
  border: none;
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: auto;
}

.btn-play:hover {
  background-color: #0099cc;
}
</style>
