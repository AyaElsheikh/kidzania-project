<template>
  <div class="play-page">
    <header class="hero position-relative overflow-hidden">
      <h1 class="hero-title"><span>{{ t('play.title') }}</span></h1>
      <!-- Wave Divider -->
      <div class="wave-divider">
        <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,75 C240,0 480,150 720,75 C960,0 1200,150 1440,75 L1440,150 L0,150 Z" fill="white"/>
        </svg>
      </div>
    </header>

    <div class="main-wrapper d-flex flex-column align-items-center justify-content-center p-5 position-relative">
      <img src="/assets/images/Bird.svg" alt="" class="bird-decoration page-bird" />
      <h2 class="mb-4 header-games fw-bold py-4">Choose your Game</h2>

      <!-- Games Content -->
      <div class="content-wrapper w-100">
        <div class="row g-4 cards-row">
          <div v-for="game in paginatedGames" :key="game.id" class="col-12 col-md-4 card-col d-flex justify-content-center">
            <div class="game-click" role="button" tabindex="0" @click="handlePlay(game)" @keydown.enter="handlePlay(game)">
              <GameCard
                :title="game.title"
                :description="game.description"
                :image="game.image"
                button-text="Play"
              />
            </div>
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
import { useRouter } from 'vue-router'
import { useI18nStore } from '@/stores/i18n.js'
import GameCard from '@/components/GameCard.vue';
import AppPagination from '@/components/AppPagination.vue';

const router = useRouter()
const i18n = useI18nStore()
const t = i18n.t

const currentPage = ref(1);
const itemsPerPage = 6; // Adjust as needed, user said "disabled as long as there are no extra cards", so if games > itemsPerPage it shows

const games = ref([
  {
    id: 1,
    title: "Discover animals",
    description: "Let's know the names of the animals.",
    image: "/assets/games/discoverAnimals.jpg",
    route: "/animals-levels"
  },
  {
    id: 2,
    title: "Fun With Numbers",
    description: "Let's know the names of the animals.",
    image: "/assets/games/funWithNumbers.png",
    route: "/numbers-levels"
  },
  {
    id: 3,
    title: "Discover the Nature",
    description: "Let's know about trees and plants.",
    image: "/assets/games/discoverThe Nature.png",
    route: "/nature-levels"
  },
  {
    id: 4,
    title: "Fun With Letters",
    description: "Let's know the names of the animals.",
    image: "/assets/games/funWithLetters.png",
    route: "/levels"
  },
  {
    id: 5,
    title: "Discover the shapes.",
    description: "Let's know the names of the animals.",
    image: "/assets/games/discoverTheShapes.png",
    route: "/shapes-levels"
  },
  {
    id: 6,
    title: "Fun With Colors",
    description: "Let's know about trees and plants.",
    image: "/assets/games/funWithColors.png",
    route: "/colors-levels"
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

const handlePlay = (game) => {
  if (game?.route) router.push(game.route)
}
</script>

<style scoped>

.play-page {
  background-color: #fff;
  min-height: 100vh;
}

.game-click {
  width: 100%;
  outline: none;
}

/* Hero Styles - matching Tests page */
.hero {
  width: 100%;
  min-height: 70vh; /* same as Tests */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-image: url('/assets/images/Play%20with%20us.png');
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

/* Bird Decorations (page content only) */
.bird-decoration {
  position: absolute;
  pointer-events: none;
  z-index: 5;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

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
</style>




