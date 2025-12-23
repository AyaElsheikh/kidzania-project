<template>
  <div class="tests-page">
    <header class="hero position-relative overflow-hidden">
      <h1 class="hero-title"><span>Tests</span></h1>
      <!-- Wave Divider -->
      <div class="wave-divider">
        <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,75 C240,0 480,150 720,75 C960,0 1200,150 1440,75 L1440,150 L0,150 Z" fill="white"/>
        </svg>
      </div>
    </header>

    <div class="main-wrapper d-flex flex-column align-items-center justify-content-center p-5 position-relative">
      <img src="/assets/images/Bird.svg" alt="" class="bird-decoration page-bird" />
      <h2 class="mb-4 header-games fw-bold py-4">Your Available Tests</h2>

      <!-- Tests Content -->
      <div class="content-wrapper w-100">
        <div v-if="exams.length > 0" class="row g-4 cards-row">
          <div v-for="exam in paginatedExams" :key="exam.id" class="col-12 col-md-4 card-col d-flex justify-content-center">
            <TestCard
              :title="exam.title"
              :course-title="exam.courseTitle || getCourseTitle(exam.courseId)"
              :image="getTestImage(exam)"
              :button-text="t('tests.start')"
              @start="startTest(exam.id)"
            />
          </div>
        </div>
        <div v-else class="text-center py-5">
           <p class="text-muted fs-4">{{ t('tests.empty') }}</p>
        </div>
        
        <!-- Pagination -->
         <AppPagination 
          v-if="totalPages > 1"
          :current-page="currentPage" 
          :total-pages="totalPages" 
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Add router import
import { useExamsStore } from '@/stores/exams.js';
import { useCoursesStore } from '@/stores/courses.js';
import { useI18nStore } from '@/stores/i18n.js';
import TestCard from '@/components/TestCard.vue';
import AppPagination from '@/components/AppPagination.vue';

const router = useRouter(); // Initialize router
const examsStore = useExamsStore();
const coursesStore = useCoursesStore();
const i18n = useI18nStore();
const t = i18n.t;

const exams = ref([
  {
    id: 101,
    title: "English Level 1",
    courseTitle: "English",
    image: "/assets/games/funWithLetters.png"
  },
  {
    id: 102,
    title: "Mathematics Quiz",
    courseTitle: "Mathematics",
    image: "/assets/games/funWithNumbers.png"
  },
  {
    id: 103,
    title: "Science Explorer",
    courseTitle: "Science",
    image: "/assets/games/discoverThe Nature.png"
  },
  {
    id: 104,
    title: "Animal Kingdom",
    courseTitle: "Biology",
    image: "/assets/games/discoverAnimals.jpg"
  },
  {
    id: 105,
    title: "Shapes & Colors",
    courseTitle: "Art",
    image: "/assets/games/discoverTheShapes.png"
  },
  {
    id: 106,
    title: "Color Fun",
    courseTitle: "Art",
    image: "/assets/games/funWithColors.png"
  }
]);

const currentPage = ref(1);
const itemsPerPage = 6; 

onMounted(async () => {
  await Promise.all([examsStore.load(), coursesStore.load()]);
  
  // Combine mock data with real data if needed, or just prioritize mock for display as requested
  if (examsStore.exams && examsStore.exams.length > 0) {
      exams.value = [...exams.value, ...examsStore.exams];
  }
});

const getCourseTitle = (courseId) => {
  if (!courseId) return '';
  const course = coursesStore.courses.find(c => c.id === courseId);
  return course ? (course.title_en || course.title) : 'Unknown Course';
};

// Placeholder for now, or meaningful logic if exams have images
const getTestImage = (exam) => {
    // If exam has an image property, use it. Otherwise random or default.
    return exam.image || 'Tests.png'; 
};

const totalPages = computed(() => Math.ceil(exams.value.length / itemsPerPage));

const paginatedExams = computed(() => {
  if (!exams.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return exams.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const startTest = (examId) => {
    router.push(`/test/${examId}`);
}
</script>

<style scoped>
.tests-page {
  background-color: #fff;
  min-height: 100vh;
}

/* Header/Hero Styles - Matching Explore Page (Courses.vue) */
.hero {
  width: 100%;
  min-height: 70vh; /* Explore page height */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('/public/assets/images/Tests.png');
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

.header-games {
  color: #00335a;
  letter-spacing: 2px;
}

.content-wrapper {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 80px;
}

/* Grid Layout */
.cards-row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -12px;
  margin-right: -12px;
  row-gap: 30px;
}

.card-col {
  flex: 0 0 33.333%;
  max-width: 33.333%;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

@media (max-width: 991.98px) {
  .card-col {
    flex: 0 0 33.333%;
    max-width: 33.333%;
  }
}
@media (max-width: 767.98px) {
  .card-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .content-wrapper {
    padding: 0 20px;
  }
}
@media (max-width: 575.98px) {
  .card-col {
    flex: 0 0 100%;
    max-width: 100%; 
  }
}

/* Page Decoration (Bird only now) */
.page-bird {
  width: clamp(35px, 10vw, 75px);
  left: 2%;
  top: 600px;
  transform: scaleX(-1) rotate(-10deg);
  opacity: 0.9;
}

.position-relative {
  position: relative !important;
}
.bird-decoration {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}
</style>


