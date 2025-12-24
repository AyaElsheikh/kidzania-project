<template>
  <div class="course-card">
    <div class="course-card-image">
      <img :src="course.thumbnail || '/assets/Logo.png'" :alt="`${displayTitle} course`" />
    </div>
    <div class="course-card-content">
      <div class="course-card-header">
        <h3 class="course-title">{{ displayTitle }}</h3>
        <span class="course-price">{{ priceLabel }}</span>
      </div>
      <div class="course-tags" v-if="displayTags.length">
        <span v-for="tag in displayTags" :key="tag" class="tag" :class="tagColor(tag)">{{ tag }}</span>
      </div>
      <p class="course-description">
        {{ displayDesc }}
      </p>
      <div class="course-footer">
        <hr class="course-divider" />
        <button class="course-btn" @click="viewDetails">
          {{ t('explore.viewDetails') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.js'

const props = defineProps({
  course: { type: Object, required: true }
})

const i18n = useI18nStore()
const t = i18n.t
const router = useRouter()
const priceLabel = computed(() => (props.course.price ?? 0) === 0 ? t('explore.free') : `$${props.course.price}`)
const displayTitle = computed(() =>
  i18n.locale === 'en'
    ? props.course.title_en || props.course.title
    : props.course.title_ar || props.course.title
)
const displayDesc = computed(() =>
  i18n.locale === 'en'
    ? props.course.description_en || props.course.description
    : props.course.description_ar || props.course.description
)

const displayTags = computed(() => {
  const tags = props.course.tags && props.course.tags.length ? props.course.tags : []
  const derived = [
    props.course.category,
    props.course.age ? `${props.course.age} ${t('explore.years')}` : null,
    props.course.lessons?.length ? `${props.course.lessons.length} ${t('explore.lessons')}` : null
  ].filter(Boolean)
  return tags.length ? tags : derived
})

const tagColor = (tag) => {
  const key = tag.toLowerCase()
  if (key.includes('free')) return 'tag-green'
  if (key.includes('math') || key.includes('lesson')) return 'tag-blue'
  if (key.includes('arabic') || key.includes('english')) return 'tag-yellow'
  return 'tag-yellow'
}

const viewDetails = () => {
  // Navigate to the CourseDetailsPage using Vue Router
  router.push(`/course-details/${props.course.id}`)
}
</script>

<style scoped>
.course-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.04);
  border-radius: 12px;
  display: flex;
  gap: 1.2rem;
  padding: 1.4rem;
  width: 100%;
  max-width: 900px;
}

.course-card-image {
  flex-shrink: 0;
  width: 140px;
  height: 140px;
  border-radius: 8px;
  overflow: hidden;
}

.course-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.course-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.course-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0b5ea8;
  text-transform: capitalize;
}

.course-price {
  color: #0b5ea8;
  font-weight: 400;
  font-size: 0.95rem;
  white-space: nowrap;
}

.course-tags {
  display: flex;
  gap: 0.35rem;
  margin: 0.25rem 0;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #000;
}

.tag-yellow {
  background: #ffd700;
}

.tag-green {
  background: #2ecc71;
}

.tag-blue {
  background: #87ceeb;
}

.course-description {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #555;
}

.course-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.course-divider {
  border: none;
  border-top: 1px solid #999999;
  margin: 0;
}

.course-btn {
  background: #0b7fbb;
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 400;
  cursor: pointer;
  transition: background 150ms ease;
  align-self: flex-start;
  text-decoration: none;
}

.course-btn:hover {
  background: #055a8f;
}

.course-btn:active {
  transform: translateY(1px);
}

@media (max-width: 900px) {
  .course-card {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .course-card {
    flex-direction: column;
    align-items: center;
  }
  .course-card-image {
    width: 100%;
    height: 200px;
  }
  .course-card-header {
    width: 100%;
  }
}
</style>

