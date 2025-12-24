import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Courses from '@/pages/Courses.vue'
import CourseDetail from '@/pages/CourseDetail.vue'
import CourseDetailsPage from '@/pages/CourseDetailsPage.vue'
import CoursePlayer from '@/pages/CoursePlayer.vue'
import Certificate from '@/pages/Certificate.vue'
import Profile from '@/pages/Profile.vue'
import MyCourses from '@/pages/MyCourses.vue'
import Subscribe from '@/pages/Subscribe.vue'
import NotFound from '@/pages/NotFound.vue'
import Auth from '@/pages/Auth.vue'
import LoginRequired from '@/pages/LoginRequired.vue'
import AdminLayout from '@/pages/admin/AdminLayout.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import AdminCourses from '@/pages/admin/AdminCourses.vue'
import AdminSubscriptions from '@/pages/admin/AdminSubscriptions.vue'
import AdminExams from '@/pages/admin/AdminExams.vue'
import AdminExamBuilder from '@/pages/admin/AdminExamBuilder.vue'
import AdminCourseBuilder from '@/pages/admin/AdminCourseBuilder.vue'
import AdminUsers from '@/pages/admin/AdminUsers.vue'
import { useAdminStore } from '@/stores/admin.js'
import { useAuthStore } from '@/stores/auth.js'

import Tests from '@/pages/Tests.vue'
import TestPlayer from '@/pages/TestPlayer.vue'
import PlayWithUs from '@/pages/PlayWithUs.vue'
import KidzademyAIAssistant from '@/pages/KidzademyAIAssistant.vue'

// Games
import AlphabetLevels from '@/pages/games/AlphabetLevels.vue'
import AnimalsLevels from '@/pages/games/AnimalsLevels.vue'
import NumbersLevels from '@/pages/games/NumbersLevels.vue'
import NatureLevels from '@/pages/games/NatureLevels.vue'
import ShapesLevels from '@/pages/games/ShapesLevels.vue'
import ColorsLevels from '@/pages/games/ColorsLevels.vue'
import AnimalsGame from '@/pages/games/AnimalsGame.vue'
import NumbersGame from '@/pages/games/NumbersGame.vue'
import NatureGame from '@/pages/games/NatureGame.vue'
import ShapesGame from '@/pages/games/ShapesGame.vue'
import ColorsGame from '@/pages/games/ColorsGame.vue'
import LettersGame from '@/pages/games/LettersGame.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/courses', name: 'courses', component: Courses },
  { path: '/courses/arabic', name: 'courses-arabic', component: Courses, props: { category: 'Arabic' } },
  { path: '/courses/english', name: 'courses-english', component: Courses, props: { category: 'English' } },
  { path: '/courses/math', name: 'courses-math', component: Courses, props: { category: 'Math' } },
  { path: '/course/:id', name: 'course-detail', component: CourseDetail },
  { path: '/course-details/:id', name: 'course-details-page', component: CourseDetailsPage },
  { path: '/course-player/:id', name: 'course-player', component: CoursePlayer },
  { path: '/certificate/:courseId', name: 'certificate', component: Certificate },
  { path: '/subscribe/:id', name: 'subscribe', component: Subscribe, meta: { requiresAuth: true, authReason: 'enroll' } },
  { path: '/auth', name: 'auth', component: Auth },
  { path: '/login-required', name: 'login-required', component: LoginRequired },
  { path: '/my-courses', name: 'my-courses', component: MyCourses, meta: { navAuthGate: true } },
  { path: '/profile', name: 'profile', component: Profile, meta: { navAuthGate: true } },
  { path: '/tests', name: 'tests', component: Tests, meta: { navAuthGate: true } },
  { path: '/test/:id', name: 'test-player', component: TestPlayer },
  // Games should be accessible without login
  { path: '/play', name: 'play', component: PlayWithUs },

  // Games (Levels + Play)
  { path: '/levels', name: 'levels', component: AlphabetLevels },
  { path: '/letters-game/:levelId', name: 'letters-game', component: LettersGame, props: true },

  { path: '/animals-levels', name: 'animals-levels', component: AnimalsLevels },
  { path: '/animals-game/:levelId', name: 'animals-game', component: AnimalsGame, props: true },

  { path: '/numbers-levels', name: 'numbers-levels', component: NumbersLevels },
  { path: '/numbers-game/:levelId', name: 'numbers-game', component: NumbersGame, props: true },

  { path: '/nature-levels', name: 'nature-levels', component: NatureLevels },
  { path: '/nature-game/:levelId', name: 'nature-game', component: NatureGame, props: true },

  { path: '/shapes-levels', name: 'shapes-levels', component: ShapesLevels },
  { path: '/shapes-game/:levelId', name: 'shapes-game', component: ShapesGame, props: true },

  { path: '/colors-levels', name: 'colors-levels', component: ColorsLevels },
  { path: '/colors-game/:levelId', name: 'colors-game', component: ColorsGame, props: true },

  { path: '/ai-assistant', name: 'ai-assistant', component: KidzademyAIAssistant, meta: { navAuthGate: true } },
  {
    path: '/admin', component: AdminLayout, children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'courses', name: 'admin-courses', component: AdminCourses },
      { path: 'courses/new', name: 'admin-courses-new', component: AdminCourseBuilder },
      { path: 'courses/:id', name: 'admin-courses-edit', component: AdminCourseBuilder, props: true },
      { path: 'users', name: 'admin-users', component: AdminUsers },
      { path: 'subscriptions', name: 'admin-subscriptions', component: AdminSubscriptions },
      { path: 'exams', name: 'admin-exams', component: AdminExams },
      { path: 'exams/new', name: 'admin-exams-new', component: AdminExamBuilder },
      { path: 'exams/:id', name: 'admin-exams-edit', component: AdminExamBuilder, props: true }
    ]
  },
  { path: '/:pathMatch(.*)*', name: '404', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  // Ensure auth store is hydrated for guards
  const auth = useAuthStore()
  auth.load()

  if (to.path.startsWith('/admin')) {
    const admin = useAdminStore()
    if (!admin.loggedIn) {
      return { name: 'auth', query: { redirect: to.fullPath } }
    }
  }

  // Navbar pages (except Home + Courses) show an illustration prompting login
  if (to.meta?.navAuthGate) {
    if (!auth.isAuthenticated) {
      return { name: 'login-required', query: { redirect: to.fullPath } }
    }
  }

  // Enroll/Subscribe requires login (go directly to auth, with reason)
  if (to.meta?.requiresAuth) {
    if (!auth.isAuthenticated) {
      return { name: 'auth', query: { redirect: to.fullPath, reason: to.meta?.authReason || 'auth' } }
    }
  }

  // Profile is also part of navbar actions; handled by navAuthGate above.
})

export default router
