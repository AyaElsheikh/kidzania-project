<template>
  <div class="courses-page">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h2>Courses Management</h2>
        <p class="text-muted">
          Manage learning content, track progress, and organize subjects.
        </p>
      </div>
      <button class="btn btn-primary rounded-pill px-4" @click="goCreate">
        <i class="bi bi-plus"></i> Add new course
      </button>
    </div>

    <!-- Filters -->
    <div class="filter-box mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="search-input">
            <i class="bi bi-search"></i>
            <input type="text" v-model="searchQuery" placeholder="search by title, subject or ID ...">
          </div>
        </div>

        <div class="col-md-3">
          <select class="form-select" v-model="filterSubject">
            <option value="">All Subjects</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="Arabic">Arabic</option>
            <option value="English">English</option>
          </select>
        </div>

        <div class="col-md-3">
          <select class="form-select" v-model="filterGrade">
            <option value="">All Grades</option>
            <option value="Grade 1-3">Grade 1-3</option>
            <option value="Grade 3-4">Grade 3-4</option>
            <option value="Grade 5+">Grade 5+</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>COURSE NAME</th>
            <th>SUBJECT</th>
            <th>GRADE</th>
            <th>MODULES</th>
            <th class="text-end">ACTIONS</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="course in paginatedCourses" :key="course.id">
            <td>
              <div class="course-info">
                <img :src="course.thumbnail" alt="thumbnail" />
                <div>
                  <strong>{{ course.title_en || course.title }}</strong>
                  <small>{{ course.category }}</small>
                </div>
              </div>
            </td>
            <td><span class="badge" :class="getBadgeClass(course.category)">{{ course.category }}</span></td>
            <td>{{ course.grade || 'Grade 1-3' }}</td> <!-- Default grade if missing -->
            <td>{{ course.lessons ? course.lessons.length : 0 }} Lessons</td>
            <td class="text-end actions">
              <i class="bi bi-pencil" @click="openModal(course)"></i>
              <i class="bi bi-trash" @click="remove(course.id)"></i>
            </td>
          </tr>
          
          <tr v-if="paginatedCourses.length === 0">
            <td colspan="5" class="text-center py-4 text-muted">No courses found.</td>
          </tr>

        </tbody>
      </table>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center mt-3" v-if="filteredCourses.length > 0">
        <span class="text-muted">Showing <strong>{{ rangeStart }}–{{ rangeEnd }}</strong> of {{ filteredCourses.length }} results</span>

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
    
    <!-- Add/Edit Modal Overlay (Simple implementation) -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content-custom">
        <h4 class="mb-3">{{ editingId ? 'Edit Course' : 'Add New Course' }}</h4>
        <form @submit.prevent="save">
           <div class="row g-3">
             <div class="col-md-6">
                <label class="form-label">Title (English)</label> 
                <input v-model="form.title_en" class="form-control" required />
             </div>
             <div class="col-md-6">
                <label class="form-label">Title (Arabic)</label> 
                <input v-model="form.title_ar" class="form-control" />
             </div>
             
             <div class="col-12">
                <label class="form-label">Description (English)</label> 
                <textarea v-model="form.description_en" class="form-control" rows="2"></textarea>
             </div>
             
             <div class="col-12">
                <label class="form-label">Description (Arabic)</label> 
                <textarea v-model="form.description_ar" class="form-control" rows="2"></textarea>
             </div>
             
             <div class="col-md-6">
                <label class="form-label">Subject</label> 
                <select v-model="form.category" class="form-select">
                  <option>Math</option>
                  <option>Science</option>
                  <option>Arabic</option>
                  <option>English</option>
                </select>
             </div>
             
             <div class="col-md-6">
                <label class="form-label">Price</label> 
                <input type="number" v-model="form.price" class="form-control" min="0" step="0.01" />
             </div>
             
             <div class="col-md-6">
                <label class="form-label">Grade</label>
                <select v-model="form.grade" class="form-select">
                  <option value="Grade 1-3">Grade 1-3</option>
                  <option value="Grade 3-4">Grade 3-4</option>
                  <option value="Grade 5+">Grade 5+</option>
                </select>
             </div>
             
             <div class="col-12">
                <label class="form-label">Thumbnail Image</label> 
                <!-- File Input -->
                <input type="file" @change="onFileChange" class="form-control" accept="image/*" />
                
                <!-- URL Input -->
                <input 
                  type="text" 
                  v-model="form.thumbnail" 
                  class="form-control mt-2" 
                  placeholder="Or enter image URL"
                />
                
                <!-- Preview -->
                <div v-if="form.thumbnail" class="mt-2">
                  <small class="text-muted d-block mb-1">Preview:</small>
                  <img :src="form.thumbnail" alt="Preview" class="rounded" style="width: 120px; height: 120px; object-fit: cover; border: 1px solid #eee;" @error="form.thumbnail = '/assets/images/topcourses1.png'">
                </div>
             </div>
           </div>
           
           <div class="d-flex justify-content-end gap-2 mt-4">
             <button type="button" class="btn btn-secondary" @click="showModal = false" :disabled="isSaving">Cancel</button>
             <button type="submit" class="btn btn-primary" :disabled="isSaving">
               <span v-if="isSaving">Saving...</span>
               <span v-else>{{ editingId ? 'Update Course' : 'Create Course' }}</span>
             </button>
           </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const toast = useToast()

// Load data
onMounted(() => {
  store.load()
})

// Filters
const searchQuery = ref(String(route.query.q || ''))
const filterSubject = ref('')
const filterGrade = ref('')

watch(() => route.query.q, (q) => {
  searchQuery.value = String(q || '')
  currentPage.value = 1
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 5

// Computed list
const filteredCourses = computed(() => {
  let list = store.courses
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(c => 
      (c.title_en?.toLowerCase() || '').includes(q) ||
      (c.title?.toLowerCase() || '').includes(q) ||
      (c.category?.toLowerCase() || '').includes(q)
    )
  }
  
  if (filterSubject.value) {
    list = list.filter(c => c.category === filterSubject.value)
  }
  
  // Note: Grade logic is presumptive as it wasn't in original data, 
  // but we can add it to the form to make it real.
  if (filterGrade.value) {
     // If course has 'grade' property
     list = list.filter(c => c.grade === filterGrade.value)
  }
  
  return list
})

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / itemsPerPage))

const paginatedCourses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCourses.value.slice(start, end)
})

const rangeStart = computed(() => filteredCourses.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1)
const rangeEnd = computed(() => Math.min(currentPage.value * itemsPerPage, filteredCourses.value.length))

// Pagination Methods
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const setPage = (p) => currentPage.value = p

// Helper
const getBadgeClass = (category) => {
  switch (category) {
    case 'Math': return 'badge-math'
    case 'Science': return 'badge-science'
    case 'Arabic': return 'badge-arabic'
    case 'English': return 'badge-english'
    default: return 'badge-english'
  }
}

// Modal Logic
const showModal = ref(false)
const editingId = ref(null)
const form = reactive({
  title_en: '',
  title_ar: '',
  description_en: '',
  category: 'Math',
  price: 0,
  thumbnail: '',
  grade: 'Grade 1-3' // Default
})

const goCreate = () => {
  try {
    router.push({ name: 'admin-courses-new' })
  } catch (error) {
    console.error('Navigation error:', error)
    toast.error('Failed to navigate to create course page.')
  }
}

const openModal = (course = null) => {
  if (course) {
    // Navigate to edit page instead of modal
    router.push({ name: 'admin-courses-edit', params: { id: course.id } })
  } else {
    goCreate()
  }
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.thumbnail = e.target.result // Base64 string
    }
    reader.readAsDataURL(file)
  }
}

const isSaving = ref(false)

const save = async () => {
  // Validation
  if (!form.title_en || !form.title_en.trim()) {
    toast.error('Please enter a course title (English).')
    return
  }
  
  if (!form.category) {
    toast.error('Please select a subject.')
    return
  }
  
  if (isSaving.value) return
  
  isSaving.value = true
  
  try {
    const courseData = {
      title: form.title_en.trim(),
      title_en: form.title_en.trim(),
      title_ar: form.title_ar?.trim() || form.title_en.trim(),
      description: form.description_en?.trim() || '',
      description_en: form.description_en?.trim() || '',
      description_ar: form.description_ar?.trim() || '',
      category: form.category,
      price: Number(form.price) || 0,
      thumbnail: form.thumbnail || '/assets/images/topcourses1.png',
      grade: form.grade || 'Grade 1-3',
      // Defaults for new courses
      age: '4-8',
      seats: 10,
      lessons: editingId.value ? undefined : [] // Keep existing lessons when editing
    }
    
    if (editingId.value) {
      // Update existing course
      const existingCourse = store.getById(editingId.value)
      if (existingCourse) {
        // Preserve existing data that wasn't in the form
        courseData.id = editingId.value
        courseData.lessons = existingCourse.lessons || []
        courseData.heroImage = existingCourse.heroImage || courseData.thumbnail
        courseData.overviewImage = existingCourse.overviewImage || courseData.thumbnail
        courseData.overview_ar = existingCourse.overview_ar || courseData.description_ar
        courseData.overview_en = existingCourse.overview_en || courseData.description_en
        courseData.tags = existingCourse.tags || []
        courseData.age = existingCourse.age || '4-8'
        courseData.seats = existingCourse.seats || 10
        courseData.createdAt = existingCourse.createdAt
        courseData.updatedAt = new Date().toISOString()
      }
      
      await store.updateCourse(courseData)
      toast.success('Course updated successfully.')
    } else {
      // Create new course
      courseData.id = `c${Date.now()}`
      courseData.heroImage = courseData.thumbnail
      courseData.overviewImage = courseData.thumbnail
      courseData.overview_ar = courseData.description_ar
      courseData.overview_en = courseData.description_en
      courseData.tags = []
      courseData.createdAt = new Date().toISOString()
      courseData.updatedAt = new Date().toISOString()
      
      await store.addCourse(courseData)
      toast.success('Course created successfully.')
    }
    
    showModal.value = false
    // Reset form
    editingId.value = null
    form.title_en = ''
    form.title_ar = ''
    form.description_en = ''
    form.description_ar = ''
    form.category = 'Math'
    form.price = 0
    form.thumbnail = ''
    form.grade = 'Grade 1-3'
  } catch (e) {
    const errorMsg = e?.message || 'Failed to save course.'
    toast.error(errorMsg)
    console.error('Save course error:', e)
  } finally {
    isSaving.value = false
  }
}

const remove = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this course?')
  if (!confirmed) return
  
  try {
    await store.deleteCourse(id)
    toast.success('Course deleted successfully.')
  } catch (e) {
    const errorMsg = e?.message || 'Failed to delete course.'
    toast.error(errorMsg)
    console.error('Delete course error:', e)
  }
}
</script>

<style scoped>
/* ===== Courses Page ===== */
.courses-page {
  /* Using standard Bootstrap font logic inherited from App or simplified */
  font-family: 'Fredoka', sans-serif;
}

.filter-box {
  background: #fff;
  padding: 20px;
  border-radius: 18px;
}

.search-input {
  position: relative;
}
.search-input i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}
.search-input input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 14px;
  border: 1px solid #eee;
}

.table-card {
  background: #fff;
  border-radius: 18px;
  padding: 10px 20px 20px;
}

.table thead th {
  font-size: 13px;
  color: #6b7280;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
}

.course-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.course-info img {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
}
.course-info small {
  display: block;
  color: #6b7280;
  font-size: 12px;
}

/* Badges */
.badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 12px;
}

.badge-math { background: #e0f2fe; color: #0284c7; }
.badge-science { background: #dcfce7; color: #16a34a; }
.badge-arabic { background: #f3e8ff; color: #9333ea; }
.badge-english { background: #fff7ed; color: #ea580c; }

.actions i {
  cursor: pointer;
  margin-left: 12px;
  color: #64748b;
  font-size: 1.1rem;
  transition: color 0.2s;
}
.actions i:hover {
  color: #00aaff;
}
.actions i.bi-trash:hover {
  color: #dc3545;
}

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

/* Modal Simple Styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content-custom {
  background: #fff;
  padding: 30px;
  border-radius: 20px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
