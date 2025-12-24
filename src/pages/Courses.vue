<template>
  <div>
    <header class="hero position-relative overflow-hidden">
      <h1 class="hero-title"><span>{{ t('explore.title') }}</span><span>{{ t('explore.courses') }}</span></h1>
      <!-- Wave Divider -->
      <div class="wave-divider">
        <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,75 C240,0 480,150 720,75 C960,0 1200,150 1440,75 L1440,150 L0,150 Z" fill="white"/>
        </svg>
      </div>
    </header>

    <section class="controls-section">
      <div class="controls container">
        <div class="controls-left">
          <h2 class="filters-title">{{ t('explore.filters') }}</h2>
          <div class="filter-card" aria-labelledby="ages-label">
            <h3 id="ages-label" class="filter-title">{{ t('explore.ages') }}</h3>
            <ul class="filter-list">
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
          <div class="filter-card" aria-labelledby="sort-label">
            <h3 id="sort-label" class="filter-title">{{ t('explore.sortBy') }}</h3>
            <ul class="filter-list">
              <li v-for="option in sortOptions" :key="option.value">
                <label>
                  <input
                    type="checkbox"
                    name="sort"
                    :value="option.value"
                    v-model="selectedSort"
                  />
                  <span>{{ option.label }}</span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="controls-right">
          <div class="pagination" role="tablist" :aria-label="t('explore.courseFilters')">
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

          <AppPagination 
            :current-page="currentPage" 
            :total-pages="totalPages" 
            @page-change="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import ExploreCourseCard from '@/components/ExploreCourseCard.vue'
import AppPagination from '@/components/AppPagination.vue'
import { useI18nStore } from '@/stores/i18n.js'

const store = useCoursesStore()
const i18n = useI18nStore()
const t = i18n.t
onMounted(() => store.load())

const filters = computed(() => [
  { label: t('explore.all'), value: 'all' },
  { label: t('explore.free'), value: 'free' },
  { label: t('explore.paid'), value: 'paid' }
])
const ageRanges = computed(() => [
  { value: '3-5', label: t('explore.ageRange.3-5') },
  { value: '4-6', label: t('explore.ageRange.4-6') },
  { value: '5-7', label: t('explore.ageRange.5-7') },
  { value: '6-8', label: t('explore.ageRange.6-8') },
  { value: '7-9', label: t('explore.ageRange.7-9') },
  { value: '8-10', label: t('explore.ageRange.8-10') }
])

const sortOptions = computed(() => [
  { value: 'all', label: t('explore.sortAll') },
  { value: 'a-z', label: t('explore.sortAZ') },
  { value: 'z-a', label: t('explore.sortZA') },
  { value: 'price-high', label: t('explore.sortPriceHigh') },
  { value: 'price-low', label: t('explore.sortPriceLow') }
])

const filterType = ref('all')
const selectedAges = ref([])
const selectedSort = ref([])
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
  // Hide drafts from users (admin can still see drafts in admin panel)
  let list = [...store.courses].filter((c) => (c.status || 'published') === 'published')
  if (filterType.value === 'free') list = list.filter((c) => (c.price ?? 0) === 0)
  if (filterType.value === 'paid') list = list.filter((c) => (c.price ?? 0) > 0)
  list = list.filter((c) => withinAgeRange(c.age, selectedAges.value))
  
  // Apply sort filters
  if (selectedSort.value.length > 0) {
    const sortType = selectedSort.value[selectedSort.value.length - 1] // Use last selected
    if (sortType === 'a-z') {
      list = list.sort((a, b) => {
        const titleA = (i18n.locale === 'en' ? (a.title_en || a.title) : (a.title_ar || a.title) || '').toLowerCase()
        const titleB = (i18n.locale === 'en' ? (b.title_en || b.title) : (b.title_ar || b.title) || '').toLowerCase()
        return titleA.localeCompare(titleB)
      })
    } else if (sortType === 'z-a') {
      list = list.sort((a, b) => {
        const titleA = (i18n.locale === 'en' ? (a.title_en || a.title) : (a.title_ar || a.title) || '').toLowerCase()
        const titleB = (i18n.locale === 'en' ? (b.title_en || b.title) : (b.title_ar || b.title) || '').toLowerCase()
        return titleB.localeCompare(titleA)
      })
    } else if (sortType === 'price-high') {
      list = list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
    } else if (sortType === 'price-low') {
      list = list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
    }
  }
  
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
const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value -= 1
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value += 1
}

watch([filterType, selectedAges, selectedSort], () => {
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
}

.hero {
  width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('/public/assets/images/Explore\ Courses.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 90px;
  padding-bottom: 120px;
  position: relative;
  overflow: hidden;
}

.hero-title {
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  line-height: 1.05;
  font-size: clamp(2.2rem, 4.8vw, 3.2rem);
  letter-spacing: 2px;
}
.hero-title span {
  display: block;
}

@media (max-width: 768px) {
  .hero {
    min-height: 58vh;
    padding-top: 70px;
    padding-bottom: 70px;
  }
}

@media (max-width: 480px) {
  .hero {
    min-height: 50vh;
    padding-top: 60px;
    padding-bottom: 60px;
  }
}

.wave-divider {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 150px;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.wave-divider svg {
  width: 100%;
  height: 100%;
  display: block;
}

.controls-section {
  width: 100%;
  padding: 50px 1rem;
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
  display: inline-flex;
  align-items: center;
  background: #e0e0e0;
  border-radius: 999px;
  padding: 4px;
  gap: 0;
  position: relative;
}

.page-btn {
  background: transparent;
  color: #666666;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

.page-btn:focus {
  outline: 2px solid rgba(3, 59, 98, 0.25);
  outline-offset: 2px;
}

.page-btn.active {
  background: #033B62;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(3, 59, 98, 0.2);
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

.filter-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.04);
  padding: 1.2rem 1.4rem;
  border-radius: 10px;
  color: #000;
  width: max-content;
  max-width: 480px;
  margin-bottom: 1rem;
}

.filter-title {
  margin: 0 0 0.35rem 0;
  padding-bottom: 0.25rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: #033B62;
  border-bottom: 2px solid #666666;
}
.filter-list {
  list-style: none;
  padding: 0.45rem 0 0 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.filter-list li label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666666;
}
.filter-list li label:hover {
  color: #033B62;
}
.filter-list input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.filter-list input[type='checkbox']:checked + span {
  color: #033B62;
  font-weight: 600;
}
@media (max-width: 720px) {
  .controls-right {
    justify-content: flex-end;
  }
  .filter-card {
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
