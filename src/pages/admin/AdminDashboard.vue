<template>
  <div>
    <h2 class="section-title">Dashboard</h2>
    <p class="mb-6">Welcome to Kidzania Admin.</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="font-fredoka text-darkblue">Courses</div>
        <div class="text-3xl">{{ coursesCount }}</div>
      </div>
      <div class="card">
        <div class="font-fredoka text-darkblue">Users</div>
        <div class="text-3xl">{{ usersCount }}</div>
      </div>
      <div class="card">
        <div class="font-fredoka text-darkblue">Exams</div>
        <div class="text-3xl">{{ examsCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import { useAuthStore } from '@/stores/auth.js'
import { useExamsStore } from '@/stores/exams.js'
const coursesStore = useCoursesStore()
const auth = useAuthStore()
const exams = useExamsStore()
onMounted(() => { coursesStore.load(); auth.load(); exams.load() })
const coursesCount = computed(() => coursesStore.courses.length)
const usersCount = computed(() => auth.users.length)
const examsCount = computed(() => exams.exams.length)
</script>
