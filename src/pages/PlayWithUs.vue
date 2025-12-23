<template>
  <div class="play-page">
    <header class="hero">
      <img src="/assets/images/Kite.svg" alt="" class="kite-decoration header-kite" />
      <div class="hero-content">
        <h1 class="hero-title"> <span>Play</span> <span>With Us</span></h1>
      </div>
      <img src="/assets/images/Bird.svg" alt="" class="bird-decoration header-bird" />
    </header>

    <div class="main-wrapper d-flex flex-column align-items-center justify-content-center p-5 position-relative">
      <img src="/assets/images/Bird.svg" alt="" class="bird-decoration page-bird" />
      <h2 class="mb-4 header-games fw-bold py-4">Choose your Game</h2>

      <!-- Games Content -->
      <div class="content-wrapper w-100">
        <div class="row g-4 cards-row">
          <div v-for="game in paginatedGames" :key="game.id" class="col-12 col-md-4 card-col d-flex justify-content-center">
            <GameCard
              :title="game.title"
              :description="game.description"
              :image="game.image"
              button-text="Play"
            />
          </div>
        </div>
        
        <!-- Pagination -->
        <AppPagination 
          :current-page="currentPage" 
          :total-pages="totalPages" 
          @page-change="handlePageChange"
        />
      </div>
      
     
   </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import GameCard from '@/components/GameCard.vue';
import AppPagination from '@/components/AppPagination.vue';

const currentPage = ref(1);
const itemsPerPage = 6; // Adjust as needed, user said "disabled as long as there are no extra cards", so if games > itemsPerPage it shows

const games = ref([
  {
    id: 1,
    title: "Discover animals",
    description: "Let's know the names of the animals.",
    image: "/assets/games/discoverAnimals.jpg"
  },
  {
    id: 2,
    title: "Fun With Numbers",
    description: "Let's know the names of the animals.",
    image: "/assets/games/funWithNumbers.png"
  },
  {
    id: 3,
    title: "Discover the Nature",
    description: "Let's know about trees and plants.",
    image: "/assets/games/discoverThe Nature.png"
  },
  {
    id: 4,
    title: "Fun With Letters",
    description: "Let's know the names of the animals.",
    image: "/assets/games/funWithLetters.png"
  },
  {
    id: 5,
    title: "Discover the shapes.",
    description: "Let's know the names of the animals.",
    image: "/assets/games/discoverTheShapes.png"
  },
  {
    id: 6,
    title: "Fun With Colors",
    description: "Let's know about trees and plants.",
    image: "/assets/games/funWithColors.png"
  }
]);

const totalPages = computed(() => Math.ceil(games.value.length / itemsPerPage));

const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return games.value.slice(start, end);
});

const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>

.play-page {
  background-color: #fff;
  min-height: 100vh;
}

/* Header/Hero Styles copied from Profile.vue */
.hero {
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(to right, #81DFFF, #90EE90);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 40px 20px;
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  line-height: 1.2;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.hero-title span {
  display: block;
}
@media (max-width: 480px) {
  .hero {
    min-height: 180px;
    padding: 30px 15px;
  }
  
  .hero-title {
    font-size: 1.5rem;
  }
}

.header-games{
  color: #00335a;
  letter-spacing: 2px;
}

.content-wrapper {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 80px;
}
/* Enforce 3 cards per row */
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
    max-width: 50%;
  }
}

ul {
  list-style-type: none; /* إزالة النقاط */
  padding: 0; /* إزالة المسافة البادئة جهة اليسار */
  margin: 0; /* إزالة الهوامش الخارجية */
}

/* Bird Decorations */
.bird-decoration {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.header-bird {
  width: clamp(80px, 15vw, 150px);
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  animation: floatBird 3s ease-in-out infinite;
}

.page-bird {
  width: clamp(35px, 10vw, 75px);
  left: 2%;
  top: 600px;
  transform: scaleX(-1) rotate(-10deg);
  opacity: 0.9;
}

/* Kite Decorations */
.kite-decoration {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
}

.header-kite {
  width: clamp(60px, 12vw, 100px);
  left: 5%;
  top: 15%;
  transform: rotate(5deg);
}

@keyframes floatBird {
  0%, 100% {
    transform: translateY(-50%) rotate(0deg);
  }
  50% {
    transform: translateY(-55%) rotate(5deg);
  }
}

.position-relative {
  position: relative !important;
}
</style>




