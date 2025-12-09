<template>
  <div>
    <h2 class="section-title">Subscriptions</h2>
    <div class="card">
      <table class="w-full text-left">
        <thead>
          <tr class="text-darkblue">
            <th class="p-2">User</th>
            <th class="p-2">Email</th>
            <th class="p-2">Courses</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t">
            <td class="p-2">{{ u.name }}</td>
            <td class="p-2">{{ u.email }}</td>
            <td class="p-2">{{ userCourses(u.id).map(c => c.title_en || c.title).join(', ') || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useCoursesStore } from '@/stores/courses.js'
const auth = useAuthStore()
const subs = useSubscriptionStore()
const courses = useCoursesStore()
onMounted(() => { auth.load(); subs.load(); courses.load() })
const users = auth.users
const userCourses = (userId) => {
  const ids = subs.byUser[userId] || []
  return courses.courses.filter(c => ids.includes(c.id))
}
</script>
