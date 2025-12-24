<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back, Admin. Here is your daily overview.</p>
      </div>
      <span class="date-badge">
        <i class="bi bi-calendar me-2"></i> Today, {{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
      </span>
    </div>

    <!-- Stats Cards -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon-container">
          <div class="stat-icon courses">
            <i class="bi bi-book fs-4 text-primary"></i>
          </div>
          <div class="stat-percentage">
            <i class="bi bi-arrow-up-short me-1"></i> +5%
          </div>
        </div>
        <div class="stat-label">Active courses</div>
        <div class="stat-value">{{ activeCoursesCount }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-container">
          <div class="stat-icon tests">
            <i class="bi bi-clipboard-check fs-4 text-purple"></i>
          </div>
          <div class="stat-percentage">
            <i class="bi bi-arrow-up-short me-1"></i> +12%
          </div>
        </div>
        <div class="stat-label">Total Tests</div>
        <div class="stat-value">{{ totalTestsCount }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-container">
          <div class="stat-icon games">
             <i class="bi bi-controller fs-4 text-warning"></i>
          </div>
          <div class="stat-percentage">
            <i class="bi bi-arrow-up-short me-1"></i> +5%
          </div>
        </div>
        <div class="stat-label">Available Games</div>
        <div class="stat-value">{{ gamesCount }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-container">
          <div class="stat-icon quizzes">
            <i class="bi bi-question-circle fs-4 text-danger"></i>
          </div>
          <div class="stat-percentage">
            <i class="bi bi-arrow-up-short me-1"></i> +8%
          </div>
        </div>
        <div class="stat-label">Active Quizzes</div>
        <div class="stat-value">{{ publishedTestsCount }}</div>
      </div>
    </div>

    <!-- Dashboard Layout: Left Column (Quick Actions + Recent Activity) | Right Column (Content Distribution) -->
    <div class="dashboard-layout">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Quick Actions -->
        <div class="section-container">
          <h3 class="section-title">Quick Actions</h3>
          <div class="actions-grid">
            <div class="action-card" @click="goAddCourse">
              <div class="action-icon">
                <i class="bi bi-plus-lg"></i>
              </div>
              <div class="action-info">
                <h4>Add Course</h4>
                <p>Create new module</p>
              </div>
            </div>

            <div class="action-card" @click="goCreateQuiz">
              <div class="action-icon">
                <i class="bi bi-question-circle"></i>
              </div>
              <div class="action-info">
                <h4>Create Quiz</h4>
                <p>New Assessment</p>
              </div>
            </div>

            <div class="action-card" @click="goUploadGame">
              <div class="action-icon">
                 <i class="bi bi-cloud-upload"></i>
              </div>
              <div class="action-info">
                <h4>Upload Games</h4>
                <p>Add Interactive Content</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="section-container">
          <h3 class="section-title">Recent Activity</h3>
          <div class="recent-activity">
            <div class="activity-table-container">
              <table class="activity-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Date</th>
                    <th>User</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="a in recentActivity" :key="a.key">
                    <td>
                      <div class="activity-user">
                        <div class="user-icon" :class="a.iconClass">
                          <i :class="a.icon" class="small-icon"></i>
                        </div>
                        <span class="activity-text">{{ a.text }}</span>
                      </div>
                    </td>
                    <td>{{ a.dateLabel }}</td>
                    <td><div class="activity-user"><span>{{ a.by }}</span></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Content Distribution -->
      <div class="right-column">
        <div class="distribution-container">
          <h3 class="section-title">Content Distribution</h3>

          <!-- Circular Chart -->
          <div class="circular-progress-container">
            <div class="circular-progress" :style="{ background: circularBg }"></div>
             <div class="progress-content">
                <div class="progress-total">{{ totalItems }}</div>
                <div class="progress-label">Total Items</div>
            </div>
          </div>

          <!-- Distribution Items -->
          <div class="distribution-items">
            <!-- Courses -->
            <div class="distribution-item item-1">
               <div class="item-info-row">
                  <div class="item-info">
                      <div class="item-bullet"></div>
                      <div class="item-name">Courses (Video/Text)</div>
                  </div>
                  <div class="item-percentage">{{ distCoursesPct }}%</div>
               </div>
               <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: `${distCoursesPct}%` }"></div>
               </div>
            </div>

            <!-- Interactive Quizzes -->
            <div class="distribution-item item-2">
               <div class="item-info-row">
                  <div class="item-info">
                      <div class="item-bullet"></div>
                      <div class="item-name">Interactive Quizzes</div>
                  </div>
                  <div class="item-percentage">{{ distQuizzesPct }}%</div>
               </div>
               <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: `${distQuizzesPct}%` }"></div>
               </div>
            </div>

             <!-- Games -->
            <div class="distribution-item item-3">
               <div class="item-info-row">
                  <div class="item-info">
                      <div class="item-bullet"></div>
                      <div class="item-name">Games</div>
                  </div>
                  <div class="item-percentage">{{ distGamesPct }}%</div>
               </div>
               <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: `${distGamesPct}%` }"></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useExamsStore } from '@/stores/exams.js'
import { useAdminStore } from '@/stores/admin.js'
import { usersApi } from '@/api/usersApi.js'

const router = useRouter()
const coursesStore = useCoursesStore()
const examsStore = useExamsStore()
const adminStore = useAdminStore()

const users = ref([])

const gamesCount = 6 // matches current PlayWithUs list (static for now)

onMounted(async () => {
  await Promise.all([
    coursesStore.load(),
    examsStore.load(),
    adminStore.load(),
    usersApi.list().then((u) => { users.value = Array.isArray(u) ? u : [] }).catch(() => { users.value = [] })
  ])
})

const activeCoursesCount = computed(() => coursesStore.courses.filter(c => (c.status || 'published') === 'published').length)
const totalTestsCount = computed(() => examsStore.exams.length)
const publishedTestsCount = computed(() => examsStore.published.length)

const totalItems = computed(() => activeCoursesCount.value + totalTestsCount.value + gamesCount)

const pct = (n) => {
  const t = totalItems.value
  if (!t) return 0
  return Math.round((n / t) * 100)
}

const distCoursesPct = computed(() => pct(activeCoursesCount.value))
const distQuizzesPct = computed(() => pct(totalTestsCount.value))
const distGamesPct = computed(() => pct(gamesCount))

const circularBg = computed(() => {
  const c = distCoursesPct.value
  const q = distQuizzesPct.value
  const g = Math.max(0, 100 - c - q)
  const s1 = c
  const s2 = c + q
  return `conic-gradient(#3b82f6 0 ${s1}%, #a855f7 ${s1}% ${s2}%, #f59e0b ${s2}% ${s2 + g}%, #e5e7eb ${s2 + g}% 100%)`
})

function fmtDate(iso) {
  const d = iso ? new Date(iso) : null
  if (!d || Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const adminName = computed(() => adminStore.admin?.name || 'Admin User')

const recentActivity = computed(() => {
  const items = []

  for (const c of coursesStore.courses) {
    const when = c.updatedAt || c.createdAt
    if (!when) continue
    const isNew = c.createdAt && c.updatedAt && String(c.createdAt) === String(c.updatedAt)
    items.push({
      key: `course-${c.id}-${when}`,
      at: when,
      by: adminName.value,
      icon: isNew ? 'bi bi-plus-lg' : 'bi bi-pencil-fill',
      iconClass: isNew ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary',
      text: isNew ? `New course added: ${c.title_en || c.title}` : `Course updated: ${c.title_en || c.title}`,
      dateLabel: fmtDate(when)
    })
  }

  for (const e of examsStore.exams) {
    const when = e.updatedAt || e.createdAt
    if (!when) continue
    const isNew = e.createdAt && e.updatedAt && String(e.createdAt) === String(e.updatedAt)
    items.push({
      key: `exam-${e.id}-${when}`,
      at: when,
      by: adminName.value,
      icon: 'bi bi-clipboard-check',
      iconClass: isNew ? 'bg-success-subtle text-success' : 'bg-purple-subtle text-purple',
      text: isNew ? `New test created: ${e.title}` : `Test updated: ${e.title}`,
      dateLabel: fmtDate(when)
    })
  }

  for (const u of users.value) {
    const when = u.createdAt
    if (!when) continue
    items.push({
      key: `user-${u.id}-${when}`,
      at: when,
      by: 'System',
      icon: 'bi bi-person-fill',
      iconClass: 'bg-purple-subtle text-purple',
      text: `New student registered: ${u.name || u.email || u.id}`,
      dateLabel: fmtDate(when)
    })
  }

  return items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 5)
})

function goAddCourse() {
  router.push({ name: 'admin-courses-new' })
}
function goCreateQuiz() {
  router.push({ name: 'admin-exams-new' })
}
function goUploadGame() {
  router.push({ name: 'play' })
}
</script>

<style scoped>
:deep(.text-purple) {
  color: #7C3AED !important;
}
:deep(.bg-purple-subtle) {
   background-color: #F3E8FF !important;
}

.dashboard-wrapper {
  color: #111418; /* --text-dark */
  --text-dark: #111418;
  --text-medium: #617289;
  --primary-blue: #00BFFF;
  --border-radius-lg: 24px;
}

.dashboard-header {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.dashboard-header p {
  color: var(--text-medium);
  font-size: 16px;
  font-weight: 400;
  margin: 0;
}

.date-badge {
  background-color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  font-size: 14px;
  color: var(--text-medium);
  font-weight: 500;
  white-space: nowrap;
}

/* Stats Cards */
.stats-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.stat-card:hover {
  border-color: #D9D9D9;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.stat-icon-container {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}
.stat-icon.courses { background-color: #D9F5FF; }
.stat-icon.tests { background-color: #FAF5FF; }
.stat-icon.games { background-color: #FFF7ED; }
.stat-icon.quizzes { background-color: #FDF2F8; }

.stat-percentage {
  display: flex;
  align-items: center;
  background-color: #DCFCE7;
  border-radius: 9999px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #166534;
  margin-left: auto;
}

.stat-label {
  font-size: 14px;
  color: var(--text-medium);
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-dark);
}

/* Layout */
.dashboard-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.right-column {
    display: flex;
    flex-direction: column;
}

.section-container {
  background-color: transparent;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 20px;
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.action-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: flex-start;
  gap: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  min-height: 100px;
}

.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  border-color: #D9D9D9;
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(43, 124, 238, 0.1);
  color: #2B7CEE;
  font-size: 20px;
  flex-shrink: 0;
}

.action-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.action-info p {
  font-size: 13px;
  color: var(--text-medium);
  margin: 0;
  font-weight: 400;
}

/* Recent Activity */
.recent-activity {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table th {
  text-align: left;
  color: #617289;
  font-weight: 600;
  font-size: 14px;
  padding: 20px 30px;
  border-bottom: 1px solid #D9D9D9;
  background-color: #F6F7F8;
}

.activity-table td {
  padding: 18px 30px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 14px;
  color: var(--text-dark);
  vertical-align: middle;
}

.activity-table tr:last-child td {
  border-bottom: none;
}

.activity-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.small-icon {
    font-size: 14px;
}

.activity-text {
  font-weight: 600;
  color: #033B62;
  font-size: 14px;
}

/* Distribution */
.distribution-container {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid #DBE0E6;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.circular-progress-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 30px;
  flex-shrink: 0;
}

.circular-progress {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
      #3B82F6 0deg 65%,     
      #C084FC 65% 90%,     
      #FDBA74 90% 100%      
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.circular-progress::before {
  content: '';
  position: absolute;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  background-color: white;
  border-radius: 50%;
}

.progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
}

.progress-total {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-dark);
  line-height: 1;
}

.progress-label {
  font-size: 14px;
  color: #617289;
  font-weight: 400;
  margin-top: 5px;
}

.distribution-items {
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 10px;
  flex-grow: 1;
  justify-content: center;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-bullet {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.item-name {
  font-size: 15px;
  color: var(--text-dark);
  font-weight: 500;
}

.item-percentage {
  font-size: 16px;
  color: #617289;
  font-weight: 600;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
}

.item-1 .item-bullet, .item-1 .progress-bar { background-color: #3B82F6; }
.item-2 .item-bullet, .item-2 .progress-bar { background-color: #C084FC; }
.item-3 .item-bullet, .item-3 .progress-bar { background-color: #FDBA74; }

/* Responsive Grid */
@media (max-width: 1200px) {
  .stats-container { grid-template-columns: repeat(2, 1fr); }
  .dashboard-layout { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .stats-container { grid-template-columns: 1fr; }
  .actions-grid { grid-template-columns: 1fr; }
}
</style>
