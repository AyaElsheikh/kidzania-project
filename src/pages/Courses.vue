<template>
  <div>
    <header class="hero">
      <h1 class="hero-title"><span>Explore</span><span>Courses</span></h1>
    </header>

    <section class="controls-section">
      <div class="controls container">
        <div class="controls-left">
          <h2 class="filters-title">filters</h2>
          <div class="age-card" aria-labelledby="ages-label">
            <h3 id="ages-label" class="age-title">ages</h3>
            <ul class="age-list">
              <li v-for="range in ageRanges" :key="range.value">
                <label>
                  <input
                    type="checkbox"
                    name="age"
                    :value="range.value"
                    v-model="selectedAges"
                  />
                  <span>{{ range.label }}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="controls-right">
          <div class="pagination" role="tablist" aria-label="Course filters">
            <button
              v-for="filter in filters"
              :key="filter.value"
              class="page-btn"
              :class="{ active: filterType === filter.value }"
              :aria-pressed="filterType === filter.value"
              @click="setFilter(filter.value)"
            >
              {{ filter.label }}
            </button>
          </div>

          <div class="courses-list">
            <ExploreCourseCard v-for="course in pagedCourses" :key="course.id" :course="course" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import ExploreCourseCard from '@/components/ExploreCourseCard.vue'

const store = useCoursesStore()
onMounted(() => store.load())

const filters = [
  { label: 'all', value: 'all' },
  { label: 'free', value: 'free' },
  { label: 'paid', value: 'paid' }
]
const ageRanges = [
  { value: '0-2', label: '0 years to 2 years' },
  { value: '3-5', label: '3 years to 5 years' },
  { value: '6-8', label: '6 years to 8 years' },
  { value: '9-12', label: '9 years to 12 years' }
]

const filterType = ref('all')
const selectedAges = ref([])
const currentPage = ref(1)
const perPage = 4

const withinAgeRange = (courseAge, selected) => {
  if (!selected.length || !courseAge) return true
  const [courseStart, courseEnd] = courseAge.split('-').map(Number)
  return selected.some((range) => {
    const [start, end] = range.split('-').map(Number)
    return !(courseEnd < start || courseStart > end)
  })
}

const filteredCourses = computed(() => {
  let list = [...store.courses]
  if (filterType.value === 'free') list = list.filter((c) => (c.price ?? 0) === 0)
  if (filterType.value === 'paid') list = list.filter((c) => (c.price ?? 0) > 0)
  list = list.filter((c) => withinAgeRange(c.age, selectedAges.value))
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCourses.value.length / perPage)))
const pagedCourses = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredCourses.value.slice(start, start + perPage)
})
const setFilter = (value) => {
  filterType.value = value
  currentPage.value = 1
}
const setPage = (page) => {
  currentPage.value = page
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

watch([filterType, selectedAges], () => {
  currentPage.value = 1
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  margin: 0;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.hero {
  width: 100%;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(to left, #30d5c8 0%, #2ecc71 100%);
}

.hero-title {
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  line-height: 1;
  font-size: clamp(2.5rem, 8vw, 6rem);
}
.hero-title span {
  display: block;
}

@media (max-width: 480px) {
  .hero {
    height: 45vh;
    padding: 1rem;
  }
}

.controls-section {
  width: 100%;
  padding: 2.5rem 1rem;
  background: #ffffff;
}
.controls {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.filters-title {
  color: #000000;
  font-weight: 800;
  margin: 0;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  text-transform: none;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.page-btn {
  background: #e0e0e0;
  color: #000;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease, transform 80ms ease;
}
.page-btn:focus {
  outline: 2px solid rgba(11, 94, 168, 0.25);
  outline-offset: 2px;
}
.page-btn:active {
  transform: translateY(1px);
}
.page-btn.active {
  background: #0b5ea8;
  color: #ffffff;
}

@media (max-width: 600px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  .pagination {
    justify-content: flex-end;
  }
}

.controls-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
  max-width: 720px;
  width: 100%;
}

.controls-left {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  align-items: flex-start;
}

.age-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.04);
  padding: 1.2rem 1.4rem;
  border-radius: 10px;
  color: #000;
  width: max-content;
  max-width: 480px;
}

.age-title {
  margin: 0 0 0.35rem 0;
  padding-bottom: 0.25rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: #333333;
  border-bottom: 2px solid #666666;
}
.age-list {
  list-style: none;
  padding: 0.45rem 0 0 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.age-list li label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #222;
}
.age-list input[type='checkbox'] {
  width: 16px;
  height: 16px;
}
@media (max-width: 720px) {
  .controls-right {
    justify-content: flex-end;
  }
  .age-card {
    width: 100%;
    max-width: none;
  }
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
  width: 100%;
}

.site-pagination {
  max-width: 1100px;
  margin: 0 auto 2rem auto;
  padding: 0 1rem;
  display: flex;
  justify-content: flex-end;
}
.pagination-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.pg-arrow {
  background: transparent;
  border: none;
  color: #333;
  font-size: 1.2rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}
.pg-arrow:focus {
  outline: 2px solid rgba(11, 94, 168, 0.18);
  outline-offset: 2px;
}
.page-numbers {
  display: flex;
  gap: 0.4rem;
}
.page-num {
  background: #e0e0e0;
  color: #000;
  border: none;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.page-num.active {
  background: #0b5ea8;
  color: #fff;
}
.page-num:focus {
  outline: 2px solid rgba(11, 94, 168, 0.18);
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .site-pagination {
    justify-content: center;
  }
}
</style>
