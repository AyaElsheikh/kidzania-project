<template>
  <!-- Hero Section -->
  <section class="hero-section position-relative overflow-hidden text-white">
    <div class="container py-5">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <h1 class="hero-heading mb-3">
            Where Learning<br />
            Feels Like<br />
            Playtime
          </h1>
          <p class="hero-sub mb-4">
            Join us on a fun learning journey where every lesson becomes an unforgettable adventure.
          </p>
          <router-link to="/courses" class="btn btn-lg  hero-cta">
            Explore Now
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Empowering Young Minds Section -->
  <section class="empower-section">
    <div class="container">
      <h2 class="section-title text-center">Empowering Young Minds</h2>
      <p class="section-sub text-center">
        A world of fun, interactive learning made just for kids
      </p>
      <div class="row align-items-center gy-4">
        <div class="col-lg-6 text-center">
          
            <div class="feature-image-bg">
              <img src="/assets/images/Home-Feature.png" alt="Kid learning" class="img-fluid feature-main" />
            </div>
           
          
        </div>
        <div class="col-lg-6">
          <div class="feature-list">
            <div
              v-for="item in features"
              :key="item.title"
              class="feature-item"
              :style="{ borderColor: item.border }"
            >
              <div class="feature-icon">
                <img :src="item.icon" :alt="item.title" />
              </div>
              <div class="feature-body">
                <h3 class="feature-title">{{ item.title }}</h3>
                <p class="feature-desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Our Top Courses Section -->
  <section class="top-courses-section overflow-hidden">

    <div class="container position-relative">
      <h2 class="section-title text-center">Our Top Courses</h2>
      <p class="section-sub text-center">
        Carefully selected lessons kids love: fun, interactive, and perfect for their learning journey.
      </p>
      <div class="row g-3">
        <div v-for="course in topCourses" :key="course.title" class="col-12 col-md-4">
          <div class="course-card h-100">
            <img :src="course.image" :alt="course.title" class="course-img" />
            <h3 class="course-title">{{ course.title }}</h3>
            <div class="course-tags">
              <span v-for="tag in course.tags" :key="tag" class="course-tag">{{ tag }}</span>
            </div>
            <p class="course-text">{{ course.desc }}</p>
            <button class="course-btn" @click="viewCourseDetails(course)">View Details</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Trusted by Parents Section -->
  <section class="trusted-section position-relative">
    <img src="/assets/images/Trusted by parents Sun.svg" alt="sun" class="trusted-sun" />
    <img src="/assets/images/Trusted by parents cloude.svg" alt="cloud" class="trusted-cloud" />
    <div class="container">
      <h2 class="section-title text-center">Trusted by Parents</h2>
      <p class="section-sub text-center">
        Real reviews from families who love learning with us.
      </p>
      <div class="row gy-4 align-items-center justify-content-center">
        <div class="col-md-5">
          <div class="trusted-image">
            <img src="/assets/images/mother-hugging-daughter.png" alt="Mother hugging daughter" class="w-100 h-100" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="trusted-card">
            <div class="trusted-controls">
              <button class="ctrl-btn" aria-label="Previous" @click="prevTestimonial">‹</button>
              <span class="ctrl-index">{{ (currentTestimonial + 1).toString().padStart(2, '0') }} / {{ totalTestimonials.toString().padStart(2, '0') }}</span>
              <button class="ctrl-btn" aria-label="Next" @click="nextTestimonial">›</button>
            </div>
            <div class="trusted-quote">
              <img src="/assets/images/Trusted by parents Quotes.svg" alt="quotes" />
              <p>"{{ activeTestimonial.quote }}"</p>
            </div>
            <p class="trusted-author">— {{ activeTestimonial.author }} <span class="trusted-role">{{ activeTestimonial.role }}</span></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const features = [
  {
    title: 'Creative Activities',
    desc: 'Coloring, drawing, and imagination tasks.',
    icon: '/assets/images/icon 1.png',
    bg: '#FDE7F1',
    border: '#81DFFF'
  },
  {
    title: 'Interactive Lessons',
    desc: 'Tap, drag, and play to understand concepts.',
    icon: '/assets/images/icon 2.png',
    bg: '#FFE5E9',
    border: '#f6b8c5'
  },
  {
    title: 'Brain-Boosting Games',
    desc: 'Puzzles and fun challenges that build skills.',
    icon: '/assets/images/icon 3.png',
    bg: '#E6F8EA',
    border: '#8ed39e'
  },
  {
    title: 'Story-Based Learning',
    desc: 'Adventures that make every lesson fun.',
    icon: '/assets/images/icon 4.png',
    bg: '#FFF1E4',
    border: '#f6c58f'
  }
]

const topCourses = [
  {
    title: 'Learn Arabic',
    image: '/assets/images/topcourses1.png',
    tags: ['Music', 'Games', 'Puzzles'],
    desc: 'Letters, sounds, and simple words made easy through stories and games.'
  },
  {
    title: 'Abc Learning',
    image: '/assets/images/topcourses2.png',
    tags: ['Spell', 'Games', 'Stories'],
    desc: 'ABC with games, songs, and stories! Learn new words and say them out loud.'
  },
  {
    title: '123 Learning',
    image: '/assets/images/topcourses3.png',
    tags: ['Count', 'Score', 'Puzzles'],
    desc: 'Count 1, 2, 3 with fun puzzles and shapes! Add, match, and solve tiny challenges.'
  }
]

const testimonials = [
  {
    quote: 'My daughter loves the Arabic lessons! She asks to play them every day — it feels like a game, not homework.',
    author: 'Sara, Egypt',
    role: 'Mother of Waleed'
  },
  {
    quote: 'The math games made my son excited to practice numbers. He now teaches his younger sister too!',
    author: 'Nour, UAE',
    role: 'Mother of Sami'
  },
  {
    quote: 'Interactive lessons kept my kids engaged and happy. I’ve never seen them this eager to learn.',
    author: 'Lina, KSA',
    role: 'Mother of Jana & Omar'
  }
]

const currentTestimonial = ref(0)
const totalTestimonials = testimonials.length

const activeTestimonial = computed(() => testimonials[currentTestimonial.value])

const nextTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 1) % totalTestimonials
}

const prevTestimonial = () => {
  currentTestimonial.value =
    (currentTestimonial.value - 1 + totalTestimonials) % totalTestimonials
}

// Map course titles to course IDs
const courseMapping = {
  'Learn Arabic': 'c1',
  'Abc Learning': 'c2', 
  '123 Learning': 'c3'
}

const viewCourseDetails = (course) => {
  const courseId = courseMapping[course.title] || 'c1'
  // Navigate to the CourseDetailsPage using Vue Router
  window.open(`/course-details/${courseId}`, '_blank')
}
</script>

<style scoped>
.hero-section {
  background: url('/assets/images/Hero Section-home.png') center/cover no-repeat;
  min-height: 75vh;
  padding-top: 110px;
  padding-bottom: 140px;
}

.hero-heading {
  /* font-family: 'Fredoka', 'Segoe UI', sans-serif; */
  font-weight: 800;
  font-size: clamp(2.4rem, 5vw, 3.5rem);
  line-height: 1.05;
}

.hero-sub {
  font-size: 1rem;
  max-width: 360px;
}

.hero-cta {
  border-radius: 12px;
  padding: 12px 26px;
  color:white;
  background-color:var(--primary);

}

.section-title {
  /* font-family: 'Fredoka', 'Segoe UI', sans-serif; */
  font-weight: 800;
  color: #0b2a4a;
}

.section-sub {
  color: #5a6a77;
  max-width: 720px;
  margin: 0 auto 2rem auto;
}

.empower-section {
  background: #ffffff;
  padding: 60px 0;
}



.feature-main {
  width: 300px;
  height: 300px;
  object-fit: contain;
  border-radius: 24px;
}


.feature-list {
  display: grid;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #ffffff;
  border: 2px solid #e0e7ee;
  border-radius: 70px;
  padding: 14px 16px;
  box-shadow: none;
}

.feature-icon img {
  width: 60px;
  height: 60px;
}

.feature-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0b2a4a;
}

.feature-desc {
  margin: 2px 0 0 0;
  color: #5a6a77;
  font-size: 0.92rem;
}

.top-courses-section {
  background: url('/assets/images/OurTopCourses.png') center/cover no-repeat;
  padding:70px 90px 280px 90px;

}

.decor-bird {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 48px;
  opacity: 0.5;
}

.decor-kite {
  position: absolute;
  top: 12px;
  right: 20px;
  width: 60px;
  opacity: 0.4;
}

.course-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.05);
  border: 1px solid #d6e6f2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.course-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.course-title {
  margin: 4px 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0b2a4a;
}

.course-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.course-tag {
  background: #ffd700;
  color: #000;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.82rem;
  font-weight: 600;
}

.course-text {
  color: #5a6a77;
  font-size: 0.92rem;
  flex: 1;
}

.course-btn {
  background: var( --primary-medium);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.course-btn:hover {
  background: #06679a;
}

.trusted-section {
  background: #ffffff;
  padding: 80px 0 100px 0;
}

.trusted-sun {
  position: absolute;
  top: 10px;
  left: 20px;
  width: 40px;
  opacity: 0.8;
}

.trusted-cloud {
  position: absolute;
  top: 28px;
  right: 24px;
  width: 70px;
  opacity: 0.7;
}

.trusted-image {
  background: #fde7f1;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.trusted-card {
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #dfe7ef;
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.trusted-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.ctrl-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #c2d3e2;
  background: #fff;
  cursor: pointer;
}

.ctrl-index {
  color: #5a6a77;
  font-weight: 600;
}

.trusted-quote {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-bottom: 12px;
  color: #0b2a4a;
  font-weight: 600;
}

.trusted-quote img {
  width: 24px;
  height: 24px;
  opacity: 0.8;
}

.trusted-quote p {
  margin: 0;
}

.trusted-author {
  color: #0b2a4a;
  font-weight: 800;
  margin: 0;
}

.trusted-role {
  color: #5a6a77;
  font-weight: 500;
  margin-left: 8px;
}

.feature-item:nth-child(1) { margin-left: -150px; }
.feature-item:nth-child(2) { margin-left: 70px; }
.feature-item:nth-child(3) { margin-left: -150px; }
.feature-item:nth-child(4) { margin-left: 70px; }
.feature-item:nth-child(1),
.feature-item:nth-child(3) {
  width: 400px;
  max-width: 100%;
}
.feature-item:nth-child(2),
.feature-item:nth-child(4) {
  width: 400px;
  max-width: 100%;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 60vh;
    padding-top: 80px;
    padding-bottom: 80px;
  }

  .feature-main {
    width: 220px;
    height: 220px;
  }

  .feature-item,
  .feature-item:nth-child(2),
  .feature-item:nth-child(3),
  .feature-item:nth-child(4) {
    margin-left: 0;
    width: 100%;
  }

  .top-courses-section {
    padding: 70px 0;
  }
}
</style>
