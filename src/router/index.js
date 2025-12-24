import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Courses from '@/pages/Courses.vue'
import CourseDetail from '@/pages/CourseDetail.vue'
import CourseDetailsPage from '@/pages/CourseDetailsPage.vue'
import CoursePlayer from '@/pages/CoursePlayer.vue'
import Profile from '@/pages/Profile.vue'
import MyCourses from '@/pages/MyCourses.vue'
import Subscribe from '@/pages/Subscribe.vue'
import NotFound from '@/pages/NotFound.vue'
import Auth from '@/pages/Auth.vue'
import AdminLayout from '@/pages/admin/AdminLayout.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import AdminCourses from '@/pages/admin/AdminCourses.vue'
import AdminSubscriptions from '@/pages/admin/AdminSubscriptions.vue'
import AdminExams from '@/pages/admin/AdminExams.vue'
import AdminExamBuilder from '@/pages/admin/AdminExamBuilder.vue'
import { useAdminStore } from '@/stores/admin.js'
import { useAuthStore } from '@/stores/auth.js'

import Tests from '@/pages/Tests.vue'
import TestPlayer from '@/pages/TestPlayer.vue'
import PlayWithUs from '@/pages/PlayWithUs.vue'
import KidzademyAIAssistant from '@/pages/KidzademyAIAssistant.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/courses', name: 'courses', component: Courses },
  { path: '/courses/arabic', name: 'courses-arabic', component: Courses, props: { category: 'Arabic' } },
  { path: '/courses/english', name: 'courses-english', component: Courses, props: { category: 'English' } },
  { path: '/courses/math', name: 'courses-math', component: Courses, props: { category: 'Math' } },
  { path: '/course/:id', name: 'course-detail', component: CourseDetail },
  { path: '/course-details/:id', name: 'course-details-page', component: CourseDetailsPage },
  { path: '/course-player/:id', name: 'course-player', component: CoursePlayer },
  { path: '/subscribe/:id', name: 'subscribe', component: Subscribe },
  { path: '/auth', name: 'auth', component: Auth },
  { path: '/my-courses', name: 'my-courses', component: MyCourses },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/tests', name: 'tests', component: Tests },
  { path: '/test/:id', name: 'test-player', component: TestPlayer },
  { path: '/play', name: 'play', component: PlayWithUs },
  { path: '/ai-assistant', name: 'ai-assistant', component: KidzademyAIAssistant },
  {
    path: '/admin', component: AdminLayout, children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'courses', name: 'admin-courses', component: AdminCourses },
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
  if (to.path.startsWith('/admin')) {
    const admin = useAdminStore()
    if (!admin.loggedIn) {
      return { name: 'auth' }
    }
  }

  if (to.path === '/profile') {
    const auth = useAuthStore()
    auth.load()
    if (!auth.isAuthenticated) {
      return { name: 'auth', query: { redirect: to.fullPath } }
    }
  }
})

export default router
