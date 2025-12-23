<template>
  <div class="card-test h-100">
    <img :src="imageSrc" :alt="title" class="card-image">
    <h4 class="card-title">{{ title }}</h4>
    <p class="card-course-info">{{ courseTitle }}</p>
    <button class="btn-start" @click="$emit('start')">{{ buttonText }}</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  courseTitle: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'test-default.png' // You might want a default image for tests if unlike games they don't have one
  },
  buttonText: {
    type: String,
    default: 'Start Test'
  }
});

defineEmits(['start']);

const imageSrc = computed(() => {
  if (!props.image) return '/assets/images/header-logo.svg'; // Fallback
  if (props.image.startsWith('http') || props.image.startsWith('//') || props.image.startsWith('/')) {
    return props.image;
  }
  // Assuming tests might have images in assets/tests/ or just use general images
  // For now mirroring GameCard logic but maybe pointing to a generic test image if not provided
  return `/assets/images/${props.image}`;
});
</script>

<style scoped>
/* Copied from GameCard.vue and adapted slightly if needed, but keeping style identical as requested */
.card-test {
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

.card-test:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 15px;
  background-color: #f0f0f0; /* Placeholder placeholder */
}

.card-title {
  color: #00335a;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 18px;
  text-align: left;
}

.card-course-info {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  flex-grow: 1;
  text-align: left;
}

.btn-start {
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

.btn-start:hover {
  background-color: #0099cc;
}
</style>
