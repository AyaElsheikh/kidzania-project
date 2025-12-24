<template>
  <div class="exams-page">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h2>Exams Management</h2>
        <p class="text-muted">
          Create and manage exams, quizzes, and assessments for courses.
        </p>
      </div>
      <button class="btn btn-primary rounded-pill px-4" @click="goCreate">
        <i class="bi bi-plus"></i> Create New Test
      </button>
    </div>

    <!-- Filters -->
    <div class="filter-box mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-8">
          <div class="search-input">
            <i class="bi bi-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Search by exam title or course name...">
          </div>
        </div>

        <div class="col-md-4">
          <select class="form-select" v-model="filterCourse">
            <option value="">All Courses</option>
            <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.title_en || c.title }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>EXAM TITLE</th>
            <th>RELATED COURSE</th>
            <th>QUESTIONS</th>
            <th>STATUS</th>
            <th class="text-end">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in paginatedExams" :key="exam.id">
            <td>
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-file-text text-primary fs-4"></i>
                <span class="fw-bold text-darkblue">{{ exam.title }}</span>
              </div>
            </td>
            <td>
              <span class="badge bg-light text-dark border">
                {{ getCourseTitle(exam.courseId) }}
              </span>
            </td>
            <td>{{ exam.questions ? exam.questions.length : 0 }} Questions</td>
            <td>
              <span class="badge" :class="exam.status === 'published' ? 'badge-pub' : 'badge-draft'">
                {{ exam.status === 'published' ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="text-end actions">
              <i class="bi bi-pencil-square me-2" title="Edit" @click="edit(exam.id)"></i>
              <i class="bi bi-trash" title="Delete" @click="remove(exam.id)"></i>
            </td>
          </tr>
          
          <tr v-if="paginatedExams.length === 0">
            <td colspan="5" class="text-center py-4 text-muted">
              <span v-if="store.isLoading">Loading…</span>
              <span v-else>No exams found.</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-3" v-if="filteredExams.length > 0">
        <span class="text-muted">Showing <strong>{{ rangeStart }}–{{ rangeEnd }}</strong> of {{ filteredExams.length }} results</span>

        <ul class="pagination mb-0 admin-pagination">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExamsStore } from '@/stores/exams.js'
import { useCoursesStore } from '@/stores/courses.js'
import { useI18nStore } from '@/stores/i18n.js'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const store = useExamsStore()
const coursesStore = useCoursesStore()
const i18n = useI18nStore()
const toast = useToast()

// Load data
onMounted(() => {
  store.load()
  coursesStore.load()
})

const courses = computed(() => coursesStore.courses)

// Filters
const searchQuery = ref(String(route.query.q || ''))
const filterCourse = ref('')
watch(() => route.query.q, (q) => {
  searchQuery.value = String(q || '')
  currentPage.value = 1
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5

// Helper
const getCourseTitle = (id) => {
  const c = courses.value.find(c => c.id === id)
  return c ? (c.title_en || c.title) : 'Unknown Course'
}

// Computed List
const filteredExams = computed(() => {
  let list = store.exams
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(e => 
      e.title.toLowerCase().includes(q) || 
      getCourseTitle(e.courseId).toLowerCase().includes(q)
    )
  }
  
  if (filterCourse.value) {
    list = list.filter(e => e.courseId === filterCourse.value)
  }
  
  return list
})

const totalPages = computed(() => Math.ceil(filteredExams.value.length / itemsPerPage))
const paginatedExams = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredExams.value.slice(start, end)
})

const rangeStart = computed(() => filteredExams.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1)
const rangeEnd = computed(() => Math.min(currentPage.value * itemsPerPage, filteredExams.value.length))

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const setPage = (p) => currentPage.value = p

const goCreate = () => router.push({ name: 'admin-exams-new' })
const edit = (id) => router.push({ name: 'admin-exams-edit', params: { id } })

const remove = async (id) => {
  const msg = i18n.locale === 'ar' ? 'حذف هذا الامتحان؟' : 'Delete this test?'
  const confirmed = window.confirm(msg)
  if (!confirmed) return
  try {
    await store.remove(id)
    toast.success(i18n.locale === 'ar' ? 'تم حذف الامتحان.' : 'Test deleted.')
  } catch (e) {
    toast.error((e?.message || '').toString() || (i18n.locale === 'ar' ? 'فشل حذف الامتحان.' : 'Failed to delete test.'))
  }
}
</script>

<style scoped>
/* Reuse styles consistent with AdminCourses */
.exams-page { font-family: 'Fredoka', sans-serif; }
.filter-box { background: #fff; padding: 20px; border-radius: 18px; }
.search-input { position: relative; }
.search-input i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #888; }
.search-input input { width: 100%; padding: 12px 12px 12px 40px; border-radius: 14px; border: 1px solid #eee; }
.table-card { background: #fff; border-radius: 18px; padding: 10px 20px 20px; }
.table thead th { font-size: 13px; color: #6b7280; border-bottom: 1px solid #eee; padding-bottom: 12px; }
/* Pagination (Admin dashboard style) */
.admin-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}
.admin-pagination .page-link {
  border: none;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 800;
  margin: 0;
  border-radius: 999px;
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
}
.admin-pagination .page-item:not(:first-child):not(:last-child) .page-link {
  width: 36px;
  padding: 0;
}
.admin-pagination .page-item.active .page-link {
  background: #00aaff;
  color: #fff;
  box-shadow: 0 10px 22px rgba(0, 170, 255, 0.28);
}
.admin-pagination .page-item.disabled .page-link {
  opacity: 0.55;
  cursor: not-allowed;
  background: #f8fafc;
}
.admin-pagination .page-link:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}
.admin-pagination .page-item.disabled .page-link:hover,
.admin-pagination .page-item.active .page-link:hover {
  transform: none;
}
.text-darkblue { color: #033B62; }
.actions i { cursor: pointer; margin-left: 12px; color: #64748b; font-size: 1.1rem; }
.actions i:hover { color: #dc3545; }
.badge-draft { background: #f1f5f9; color: #475569; }
.badge-pub { background: #dcfce7; color: #16a34a; }
</style>
