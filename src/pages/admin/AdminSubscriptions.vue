<template>
  <div class="subscriptions-page">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h2>Users & Subscriptions</h2>
        <p class="text-muted">
          Manage user accounts, view enrolled courses, and handle subscriptions.
        </p>
      </div>
      <!-- Optional: Add User button if needed -->
      <!-- <button class="btn btn-primary rounded-pill px-4">
        <i class="bi bi-plus"></i> Add User
      </button> -->
    </div>

    <!-- Filters -->
    <div class="filter-box mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-12">
          <div class="search-input">
            <i class="bi bi-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Search by name or email...">
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>USER</th>
            <th>EMAIL</th>
            <th>ENROLLED COURSES</th>
            <th class="text-end">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="avatar-circle">{{ user.name.charAt(0).toUpperCase() }}</div>
                <span class="fw-bold text-darkblue">{{ user.name }}</span>
              </div>
            </td>
            <td class="text-muted">{{ user.email }}</td>
            <td>
              <div class="d-flex flex-wrap gap-1">
                <span v-for="course in userCourses(user.id)" :key="course.id" class="badge bg-primary-subtle text-primary border border-primary-subtle">
                  {{ course.title_en || course.title }}
                </span>
                <span v-if="userCourses(user.id).length === 0" class="text-muted small italic">No enrollments</span>
              </div>
            </td>
            <td class="text-end actions">
              <!-- Edit/Delete icons (Mock actions as auth store usually handles this) -->
              <i class="bi bi-pencil-square" @click="editUser(user)"></i>
              <i class="bi bi-trash" @click="removeUser(user.id)"></i>
            </td>
          </tr>
          
          <tr v-if="paginatedUsers.length === 0">
            <td colspan="4" class="text-center py-4 text-muted">No users found.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-3" v-if="filteredUsers.length > 0">
        <span class="text-muted">Showing <strong>{{ rangeStart }}–{{ rangeEnd }}</strong> of {{ filteredUsers.length }} results</span>

        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
          </li>
          <li 
            v-for="page in totalPages" 
            :key="page" 
            class="page-item" 
            :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="setPage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
          </li>
        </ul>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useCoursesStore } from '@/stores/courses.js'

const auth = useAuthStore()
const subs = useSubscriptionStore()
const courses = useCoursesStore()

onMounted(() => {
  auth.load()
  subs.load()
  courses.load()
})

const users = computed(() => auth.users)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

// Helpers
const userCourses = (userId) => {
  const ids = subs.byUser[userId] || []
  return courses.courses.filter(c => ids.includes(c.id))
}

// Filtering
const filteredUsers = computed(() => {
  let list = users.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    )
  }
  return list
})

// Pagination Logic
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const rangeStart = computed(() => filteredUsers.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1)
const rangeEnd = computed(() => Math.min(currentPage.value * itemsPerPage, filteredUsers.value.length))

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const setPage = (p) => currentPage.value = p

// Actions
const editUser = (user) => {
  alert(`Edit user: ${user.name} (Feature coming soon)`)
}
const removeUser = (id) => {
  if (confirm('Delete this user?')) {
    // auth.removeUser(id) // Assuming store doesn't have this yet, would need implementation
    alert('User deletion would happen here.')
  }
}
</script>

<style scoped>
.subscriptions-page { font-family: 'Fredoka', sans-serif; }
.filter-box { background: #fff; padding: 20px; border-radius: 18px; }
.search-input { position: relative; }
.search-input i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #888; }
.search-input input { width: 100%; padding: 12px 12px 12px 40px; border-radius: 14px; border: 1px solid #eee; }
.table-card { background: #fff; border-radius: 18px; padding: 10px 20px 20px; }
.table thead th { font-size: 13px; color: #6b7280; border-bottom: 1px solid #eee; padding-bottom: 12px; }

.avatar-circle {
  width: 32px; height: 32px;
  background: #e6f7ff; color: #00aaff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold; font-size: 14px;
}

.pagination .page-link { color: #6b7280; border: none; margin: 0 4px; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
.pagination .page-item.active .page-link { background-color: #00aaff; color: #fff; }
.pagination .page-item.disabled .page-link { color: #ccc; cursor: not-allowed; }
.pagination .page-link:hover:not(.active) { background-color: #f1f5f9; }

.actions i { cursor: pointer; margin-left: 12px; color: #64748b; font-size: 1.1rem; }
.actions i:hover { color: #00aaff; }
.actions i.bi-trash:hover { color: #dc3545; }
</style>
