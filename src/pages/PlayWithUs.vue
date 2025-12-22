<template>
  <div>
    <div class="main-wrapper d-flex flex-column align-items-center justify-content-center p-5">
      <h2 class="mb-4 text-primary fw-bold">Choose your Game</h2>

      <div class="toggle-switch-container mb-4">
        <ul class="nav nav-pills p-5" id="pills-tab" role="tablist">
          <li class="nav-item p-4" role="presentation">
            <button
              :class="['nav-link', 'rounded-pill', 'px-6', 'py-4', { active: activeTab === 'quizzes' }]"
              @click="activeTab = 'quizzes'"
              type="button"
              role="tab"
            >Quizzes</button>
          </li>
          <li class="nav-item p-4" role="presentation">
            <button
              :class="['nav-link', 'rounded-pill', 'px-6', 'py-4', { active: activeTab === 'games' }]"
              @click="activeTab = 'games'"
              type="button"
              role="tab"
            >Games</button>
          </li>
        </ul>
      </div>

      <!-- Games Content -->
      <div v-if="activeTab === 'games'" class="content-wrapper w-100">
        <div class="row g-4 cards-row">
          <div v-for="game in games" :key="game.id" class="col-12 col-md-4 card-col d-flex justify-content-center">
            <GameCard
              :title="game.title"
              :description="game.description"
              :image="game.image"
              button-text="Play"
            />
          </div>
        </div>
      </div>
      
      <!-- Quizzes Content -->
      <div v-if="activeTab === 'quizzes'" class="content-wrapper w-100">
        <div class="row g-4 px-3 cards-row">
          <div
            v-for="quiz in quizzes"
            :key="quiz.id"
            class="card-col d-flex justify-content-center"
          >
            <GameCard
              :title="quiz.title"
              :description="quiz.description"
              :image="quiz.image"
              button-text="Start Quiz"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GameCard from '@/components/GameCard.vue';

const activeTab = ref("quizzes");

const games = ref([
  {
    id: 1,
    title: "Discover animals",
    description: "Let's know the names of the animals.",
    image: "explore_Animals.png"
  },
  {
    id: 2,
    title: "Fun With Numbers",
    description: "Let's know the names of the animals.",
    image: "explore_numbers.png"
  },
  {
    id: 3,
    title: "Discover the Nature",
    description: "Let's know about trees and plants.",
    image: "explore_nature.jpg"
  },
  {
    id: 4,
    title: "Fun With Letters",
    description: "Let's know the names of the animals.",
    image: "explore_letters.jpg"
  },
  {
    id: 5,
    title: "Discover the shapes.",
    description: "Let's know the names of the animals.",
    image: "explore_Shapes.jpg"
  },
  {
    id: 6,
    title: "Fun With Colors",
    description: "Let's know about trees and plants.",
    image: "Explore_colors.png"
  }
]);

const quizzes = ref([
  {
    id: 1,
    title: "Animal Quiz",
    description: "Test your knowledge about animals.",
    image: "explore_Animals.png"
  },
  {
    id: 2,
    title: "Math Quiz",
    description: "Challenge yourself with numbers.",
    image: "explore_numbers.png"
  },
  {
    id: 3,
    title: "Nature Quiz",
    description: "Test your knowledge about nature.",
    image: "explore_nature.jpg"
  },
  {
    id: 4,
    title: "Letter Quiz",
    description: "Test your knowledge about letters.",
    image: "explore_letters.jpg"
  }
]);
</script>

<style scoped>
/* خلفية الصفحة كاملة مثل الصورة */
.main-wrapper {
  background-color: #d1ecff;
  min-height: 100vh;
}

/* حاوية الزر البيضاء/الرمادية الفاتحة */
.toggle-switch-container {
  background-color: #f8f9fa;
  border-radius: 100px;
  display: inline-block;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding: 8px;
}

.toggle-switch-container ul {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}

/* تنسيق الزر النشط (Active) */
.nav-pills .nav-link.active {
  background-color: #00335a !important; /* لون كحلي مثل الصورة */
  color: white !important;
}

/* تنسيق الأزرار العادية */
.nav-pills .nav-link {
  color: #888;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  border-radius: 50px !important;
  padding: 12px 35px !important;
}

.nav-pills .nav-link:hover {
  color: #00335a;
}

.content-wrapper {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}
/* Enforce 4 cards per row (full width) */
.cards-row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -12px;
  margin-right: -12px;
  row-gap: 30px;
}
.card-col {
  flex: 0 0 25%;
  max-width: 25%;
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
}
@media (max-width: 575.98px) {
  .card-col {
    flex: 0 0 100%; /* Better for mobile to be full width or 50% depending on preference. User said 50% for 575px but 100% is usually safer for very small screens. I'll stick to user logic which was 50 for max-width 575. */
    max-width: 50%;
  }
}

ul {
  list-style-type: none; /* إزالة النقاط */
  padding: 0; /* إزالة المسافة البادئة جهة اليسار */
  margin: 0; /* إزالة الهوامش الخارجية */
}
</style>



