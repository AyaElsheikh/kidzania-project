<template>
  <div class="users-page">
    <!-- Header -->
    <div class="users-header">
      <div>
        <div class="users-breadcrumb">Users</div>
        <h2 class="users-title">Users Management</h2>
        <p class="users-subtitle text-muted">Manage accounts, track progress, and add new users.</p>
      </div>

      <button class="btn btn-primary users-add-btn" type="button" @click="openCreate">
        <span class="me-2" aria-hidden="true">＋</span>
        Add new user
      </button>
    </div>

    <!-- Stats -->
    <div class="users-stats">
      <div class="stat-card card-soft">
        <div class="stat-top">
          <div class="stat-icon stat-icon--blue" aria-hidden="true">👥</div>
          <span class="stat-pill stat-pill--green">+5% vs last month</span>
        </div>
        <div class="stat-label">Total users</div>
        <div class="stat-value">{{ totalUsers }}</div>
      </div>

      <div class="stat-card card-soft">
        <div class="stat-top">
          <div class="stat-icon stat-icon--orange" aria-hidden="true">🧒</div>
          <span class="stat-pill stat-pill--green">+12% new signups</span>
        </div>
        <div class="stat-label">Active children</div>
        <div class="stat-value">{{ activeUsers }}</div>
      </div>

      <div class="stat-card card-soft">
        <div class="stat-top">
          <div class="stat-icon stat-icon--purple" aria-hidden="true">🛡</div>
          <span class="stat-pill stat-pill--green">+5%</span>
        </div>
        <div class="stat-label">Subscribed Users</div>
        <div class="stat-value">{{ subscribedUsers }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="users-filters card-soft">
      <div class="filters-row">
        <div class="search-wrap">
          <span class="search-ic" aria-hidden="true">🔎</span>
          <input
            v-model.trim="searchQuery"
            class="search-input"
            type="text"
            placeholder="search by name, email or ID ..."
          />
        </div>

        <div class="filters-right">
          <select v-model="filterStatus" class="filter-select">
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          <select v-model="filterGrade" class="filter-select">
            <option value="">Grade level</option>
            <option v-for="g in gradeOptions" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="users-table card-soft">
      <table class="table table-borderless align-middle mb-0">
        <thead>
          <tr>
            <th style="width: 38%;">USER</th>
            <th style="width: 10%;">ROLE</th>
            <th style="width: 14%;">STATUS</th>
            <th style="width: 22%;">EMAIL</th>
            <th style="width: 16%;">SUBSCRIPTION</th>
            <th class="text-end" style="width: 10%;">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in paginatedUsers" :key="u.id" class="user-row">
            <td>
              <div class="user-cell">
                <img v-if="u.avatar" :src="u.avatar" class="user-avatar" alt="" />
                <div v-else class="user-avatar user-avatar--fallback" aria-hidden="true">
                  {{ (u.name || 'U').slice(0, 1).toUpperCase() }}
                </div>
                <div class="user-meta">
                  <div class="user-name">{{ u.name || '—' }}</div>
                  <div class="user-sub">{{ u.grade || '—' }}</div>
                </div>
              </div>
            </td>

            <td>
              <span class="role-pill" :class="isReservedAdminEmail(u.email) ? 'role--admin' : 'role--user'">
                {{ isReservedAdminEmail(u.email) ? 'Admin' : 'User' }}
              </span>
            </td>

            <td>
              <span class="status-pill" :class="u.status === 'suspended' ? 'status--bad' : 'status--ok'">
                {{ u.status === 'suspended' ? 'Suspended' : 'Active' }}
              </span>
            </td>

            <td class="text-muted">{{ u.email || '—' }}</td>

            <td>
              <span class="sub-pill" :class="isUserSubscribed(u.id) ? 'sub--yes' : 'sub--no'">
                {{ isUserSubscribed(u.id) ? 'Subscribed' : 'Non-Subscribed' }}
              </span>
            </td>

            <td class="text-end">
              <div class="actions-cell">
                <button class="act-btn" type="button" title="Edit" :disabled="isReservedAdminEmail(u.email)" @click="openConfirm('edit', u)">
                  <i class="bi bi-pencil" aria-hidden="true"></i>
                </button>
                <button
                  class="act-btn"
                  type="button"
                  :title="u.status === 'suspended' ? 'Activate' : 'Suspend'"
                  :disabled="isReservedAdminEmail(u.email)"
                  @click="openConfirm('toggle', u)"
                >
                  <i :class="u.status === 'suspended' ? 'bi bi-check2-circle' : 'bi bi-slash-circle'" aria-hidden="true"></i>
                </button>
                <button class="act-btn act-btn--danger" type="button" title="Delete" :disabled="isReservedAdminEmail(u.email)" @click="openConfirm('delete', u)">
                  <i class="bi bi-trash" aria-hidden="true"></i>
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="paginatedUsers.length === 0">
            <td colspan="6" class="text-center py-5 text-muted">No users found.</td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length > 0" class="users-pagination">
        <div class="text-muted">
          Showing <strong>{{ rangeStart }}–{{ rangeEnd }}</strong> of {{ filteredUsers.length }} results
        </div>

        <div class="pager">
          <button class="pager-btn" type="button" :disabled="currentPage === 1" @click="prevPage">Previous</button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="pager-dot"
            type="button"
            :class="{ active: currentPage === p }"
            @click="setPage(p)"
          >
            {{ p }}
          </button>
          <button class="pager-btn" type="button" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-card">
        <div class="modal-head">
          <div class="modal-title">{{ editingUserId ? 'Edit user' : 'Add new user' }}</div>
          <button class="modal-x" type="button" @click="closeForm">×</button>
        </div>

        <form @submit.prevent="saveUser">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Name</label>
              <input v-model.trim="form.name" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input v-model.trim="form.email" type="email" class="form-control" required />
            </div>
            <div class="col-md-6">
              <label class="form-label">Phone</label>
              <input v-model.trim="form.phone" class="form-control" placeholder="Optional" />
            </div>
            <div class="col-md-6">
              <label class="form-label">Grade level</label>
              <select v-model="form.grade" class="form-select">
                <option value="">Select grade</option>
                <option v-for="g in gradeOptions" :key="g" :value="g">{{ g }}</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-select">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">{{ editingUserId ? 'New Password (optional)' : 'Password' }}</label>
              <input v-model="form.password" type="password" class="form-control" :required="!editingUserId" minlength="6" />
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-light" type="button" :disabled="isSaving" @click="closeForm">Cancel</button>
            <button class="btn btn-primary" type="submit" :disabled="isSaving">
              {{ isSaving ? 'Saving…' : (editingUserId ? 'Update user' : 'Create user') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm modal (Edit / Suspend / Delete) -->
    <div v-if="confirmAction" class="modal-overlay" @click.self="closeConfirm">
      <div class="modal-card modal-card--sm">
        <div class="modal-title">{{ confirmTitle }}</div>
        <p class="text-muted mb-0">
          {{ confirmText }}
          <strong v-if="confirmAction?.user?.name"> {{ confirmAction.user.name }}</strong>
        </p>
        <div class="modal-actions">
          <button class="btn btn-light" type="button" :disabled="isSaving" @click="closeConfirm">Cancel</button>
          <button :class="confirmCtaClass" type="button" :disabled="isSaving" @click="confirmDo">
            {{ confirmCtaText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { usersApi } from '@/api/usersApi.js'
import { subscriptionsApi } from '@/api/subscriptionsApi.js'

const toast = useToast()
const route = useRoute()
const RESERVED_ADMIN_EMAIL = 'admin@gmail.com'

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function isReservedAdminEmail(email) {
  return normalizeEmail(email) === RESERVED_ADMIN_EMAIL
}

const isLoading = ref(false)
const isSaving = ref(false)

const users = ref([])
const subscriptions = ref([])

const searchQuery = ref(String(route.query.q || ''))
const filterStatus = ref('')
const filterGrade = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const gradeOptions = [
  'Grade 1-3',
  'Grade 3-4',
  'Grade 5+'
]

const showForm = ref(false)
const editingUserId = ref(null)
const confirmAction = ref(null) // { type: 'edit'|'toggle'|'delete', user }

const form = reactive({
  name: '',
  email: '',
  phone: '',
  grade: '',
  status: 'active',
  password: ''
})

function normalizeUser(raw) {
  return {
    id: raw?.id,
    name: raw?.name || '',
    email: raw?.email || '',
    phone: raw?.phone || '',
    grade: raw?.grade || raw?.gradeLevel || '',
    status: raw?.status || 'active',
    avatar: raw?.avatar || '',
    createdAt: raw?.createdAt || null,
    updatedAt: raw?.updatedAt || null
  }
}

async function loadAll() {
  isLoading.value = true
  try {
    const [u, s] = await Promise.all([
      usersApi.list(),
      subscriptionsApi.list()
    ])
    users.value = (Array.isArray(u) ? u : []).map(normalizeUser)
    subscriptions.value = Array.isArray(s) ? s : []
  } catch (e) {
    toast.error((e?.message || '').toString() || 'Failed to load users.')
    users.value = []
    subscriptions.value = []
    console.error('Load users error:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadAll)

const subscribedUserIds = computed(() => {
  const set = new Set()
  for (const s of subscriptions.value) {
    if (s?.userId != null) set.add(String(s.userId))
  }
  return set
})

function isUserSubscribed(userId) {
  return subscribedUserIds.value.has(String(userId))
}

const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => (u.status || 'active') !== 'suspended').length)
const subscribedUsers = computed(() => {
  let count = 0
  for (const u of users.value) if (isUserSubscribed(u.id)) count++
  return count
})

const filteredUsers = computed(() => {
  let list = users.value

  const q = (searchQuery.value || '').trim().toLowerCase()
  if (q) {
    list = list.filter(u =>
      String(u.id || '').toLowerCase().includes(q) ||
      String(u.name || '').toLowerCase().includes(q) ||
      String(u.email || '').toLowerCase().includes(q)
    )
  }

  if (filterStatus.value) {
    list = list.filter(u => (u.status || 'active') === filterStatus.value)
  }

  if (filterGrade.value) {
    list = list.filter(u => (u.grade || '') === filterGrade.value)
  }

  return list
})

watch([searchQuery, filterStatus, filterGrade], () => {
  currentPage.value = 1
})

watch(() => route.query.q, (q) => {
  searchQuery.value = String(q || '')
  currentPage.value = 1
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage)))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredUsers.value.slice(start, start + itemsPerPage)
})

const rangeStart = computed(() => (filteredUsers.value.length ? (currentPage.value - 1) * itemsPerPage + 1 : 0))
const rangeEnd = computed(() => Math.min(currentPage.value * itemsPerPage, filteredUsers.value.length))

function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function setPage(p) { currentPage.value = p }

function resetForm() {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.grade = ''
  form.status = 'active'
  form.password = ''
}

function openCreate() {
  editingUserId.value = null
  resetForm()
  showForm.value = true
}

function openEdit(u) {
  editingUserId.value = u.id
  form.name = u.name || ''
  form.email = u.email || ''
  form.phone = u.phone || ''
  form.grade = u.grade || ''
  form.status = u.status || 'active'
  form.password = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingUserId.value = null
  resetForm()
}

function openDelete(u) {
  // kept for backward compatibility (unused)
  confirmAction.value = { type: 'delete', user: u }
}

const confirmTitle = computed(() => {
  const t = confirmAction.value?.type
  if (t === 'delete') return 'Delete user?'
  if (t === 'edit') return 'Edit user?'
  if (t === 'toggle') {
    const isSusp = confirmAction.value?.user?.status === 'suspended'
    return isSusp ? 'Activate user?' : 'Suspend user?'
  }
  return 'Are you sure?'
})

const confirmText = computed(() => {
  const t = confirmAction.value?.type
  if (t === 'delete') return 'This will permanently remove'
  if (t === 'edit') return 'You are about to edit'
  if (t === 'toggle') {
    const isSusp = confirmAction.value?.user?.status === 'suspended'
    return isSusp ? 'This will activate' : 'This will suspend'
  }
  return 'Confirm action for'
})

const confirmCtaText = computed(() => {
  const t = confirmAction.value?.type
  if (t === 'delete') return 'Delete'
  if (t === 'edit') return 'Continue'
  if (t === 'toggle') {
    const isSusp = confirmAction.value?.user?.status === 'suspended'
    return isSusp ? 'Activate' : 'Suspend'
  }
  return 'Confirm'
})

const confirmCtaClass = computed(() => {
  const t = confirmAction.value?.type
  if (t === 'delete') return 'btn btn-danger'
  if (t === 'toggle') return 'btn btn-warning'
  return 'btn btn-primary'
})

function closeConfirm() {
  confirmAction.value = null
}

function openConfirm(type, u) {
  confirmAction.value = { type, user: u }
}

async function confirmDo() {
  const action = confirmAction.value
  if (!action?.type || !action?.user) return
  const u = action.user
  const type = action.type

  if (type === 'edit') {
    closeConfirm()
    openEdit(u)
    return
  }

  if (type === 'toggle') {
    closeConfirm()
    await toggleStatus(u)
    return
  }

  if (type === 'delete') {
    closeConfirm()
    await deleteUserById(u.id)
  }
}

async function deleteUserById(id) {
  if (!id) return
  if (isSaving.value) return
  isSaving.value = true
  try {
    await usersApi.remove(id)
    toast.success('User deleted.')
    await loadAll()
  } catch (e) {
    toast.error((e?.message || '').toString() || 'Failed to delete user.')
    console.error('Delete user error:', e)
  } finally {
    isSaving.value = false
  }
}

async function toggleStatus(u) {
  if (!u?.id) return
  if (isSaving.value) return
  isSaving.value = true
  try {
    const nextStatus = (u.status === 'suspended') ? 'active' : 'suspended'
    await usersApi.update(u.id, { status: nextStatus, updatedAt: new Date().toISOString() })
    toast.success(nextStatus === 'active' ? 'User activated.' : 'User suspended.')
    await loadAll()
  } catch (e) {
    toast.error((e?.message || '').toString() || 'Failed to update status.')
    console.error('Update status error:', e)
  } finally {
    isSaving.value = false
  }
}

async function saveUser() {
  if (isSaving.value) return

  const name = (form.name || '').trim()
  const email = normalizeEmail(form.email)
  if (!name) { toast.error('Name is required.'); return }
  if (!email) { toast.error('Email is required.'); return }
  if (isReservedAdminEmail(email)) {
    toast.error('This email is reserved for the only Admin account (admin@gmail.com). Please use a different email.')
    return
  }

  isSaving.value = true
  try {
    const now = new Date().toISOString()

    if (!editingUserId.value) {
      const existing = await usersApi.findByEmail(email).catch(() => [])
      if (Array.isArray(existing) && existing.length) {
        toast.error('Email already exists.')
        return
      }

      const payload = {
        id: `u${Date.now()}`,
        name,
        email,
        phone: (form.phone || '').trim(),
        grade: form.grade || '',
        status: form.status || 'active',
        password: form.password || '',
        createdAt: now,
        updatedAt: now
      }
      await usersApi.create(payload)
      toast.success('User created.')
      closeForm()
      await loadAll()
      return
    }

    // edit
    // prevent updating any user to the reserved admin email (and protect legacy data)
    if (isReservedAdminEmail(email)) {
      toast.error('This email is reserved for the only Admin account (admin@gmail.com).')
      return
    }
    const patch = {
      name,
      email,
      phone: (form.phone || '').trim(),
      grade: form.grade || '',
      status: form.status || 'active',
      updatedAt: now
    }
    if (form.password) patch.password = form.password
    await usersApi.update(editingUserId.value, patch)
    toast.success('User updated.')
    closeForm()
    await loadAll()
  } catch (e) {
    toast.error((e?.message || '').toString() || 'Failed to save user.')
    console.error('Save user error:', e)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.users-page {
  font-family: 'Fredoka', sans-serif;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.users-breadcrumb {
  font-size: 14px;
  color: #0f172a;
  font-weight: 700;
}

.users-title {
  margin: 6px 0 2px;
  font-weight: 900;
  color: #0f172a;
  font-size: 34px;
}

.users-subtitle {
  margin: 0;
}

.users-add-btn {
  border-radius: 14px;
  padding: 12px 18px;
  font-weight: 800;
  background: #00aaff;
  border: none;
}

.users-stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 18px;
  margin: 18px 0;
}

.card-soft {
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
  padding: 18px;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-weight: 900;
}
.stat-icon--blue { background: #e6f7ff; color: #00aaff; }
.stat-icon--orange { background: #fff4e6; color: #f59e0b; }
.stat-icon--purple { background: #f3e8ff; color: #a855f7; }

.stat-pill {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.stat-pill--green {
  background: rgba(22,163,74,0.12);
  color: #16a34a;
}

.stat-label {
  color: #64748b;
  font-weight: 800;
  font-size: 14px;
}
.stat-value {
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
  margin-top: 6px;
}

.users-filters {
  padding: 16px;
  margin-bottom: 14px;
}
.filters-row {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 16px;
  align-items: center;
}
.search-wrap {
  position: relative;
}
.search-ic {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}
.search-input {
  width: 100%;
  padding: 12px 14px 12px 44px;
  border-radius: 16px;
  border: 1px solid #e9eef5;
  background: #fbfcff;
}
.filters-right {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.filter-select {
  width: 100%;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid #e9eef5;
  background: #fbfcff;
}

.users-table thead th {
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #eef2f7;
  padding: 16px 12px;
}
.users-table tbody td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid rgba(0,0,0,0.04);
}
.user-avatar--fallback {
  background: #e6f7ff;
  color: #00aaff;
  display: grid;
  place-items: center;
  font-weight: 900;
}
.user-name {
  font-weight: 900;
  color: #0f172a;
}
.user-sub {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 700;
}

.status-pill,
.sub-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
}
.role-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  border: 1px solid rgba(0,0,0,0.06);
  background: #f1f5f9;
  color: #475569;
}
.role--admin {
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.35);
  color: #854d0e;
}
.role--user {
  background: rgba(2, 132, 199, 0.12);
  border-color: rgba(2, 132, 199, 0.22);
  color: #0284c7;
}
.status--ok { background: rgba(22,163,74,0.12); color: #16a34a; }
.status--bad { background: rgba(220,38,38,0.12); color: #dc2626; }
.sub--yes { background: rgba(2,132,199,0.12); color: #0284c7; }
.sub--no { background: rgba(245,158,11,0.14); color: #b45309; }

.act-btn {
  border: none;
  background: transparent;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  color: #64748b;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.actions-cell {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
}
.act-btn i {
  font-size: 1.05rem;
  line-height: 1;
}
.act-btn:hover { background: #f1f5f9; color: #00aaff; }
.act-btn--danger:hover { color: #dc2626; background: rgba(220,38,38,0.08); }

.act-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.act-btn:disabled:hover {
  background: transparent;
  color: #64748b;
}

.users-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 14px;
}
.pager {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pager-btn {
  border: 1px solid #e9eef5;
  background: #fff;
  border-radius: 12px;
  padding: 8px 12px;
  color: #64748b;
  font-weight: 800;
}
.pager-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pager-dot {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 900;
}
.pager-dot.active {
  background: #00aaff;
  color: #fff;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 2000;
}
.modal-card {
  width: min(720px, 96vw);
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-card--sm {
  width: min(420px, 96vw);
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.modal-title {
  font-weight: 900;
  color: #0f172a;
  font-size: 18px;
}
.modal-x {
  border: none;
  background: #f1f5f9;
  border-radius: 12px;
  width: 36px;
  height: 36px;
  font-size: 22px;
  line-height: 1;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

@media (max-width: 1100px) {
  .users-stats { grid-template-columns: 1fr; }
  .filters-row { grid-template-columns: 1fr; }
  .filters-right { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .users-title { font-size: 28px; }
  .filters-right { grid-template-columns: 1fr; }
}
</style>

