<template>
  <div class="auth-wrapper">
    <div class="auth-container">
      <div class="row g-0 h-100">
        <!-- القسم الأيسر - الفورم -->
        <div class="col-lg-6 col-12 auth-form-section">
          <div class="form-container">
            <!-- الشعار -->
            <div class="auth-logo mb-4">
              <img src="/assets/Logo.png" alt="Kidzademy" class="logo-img" />
            </div>

            <!-- العنوان -->
            <h1 class="auth-title">{{ mode === 'login' ? t('auth.login') : t('auth.signup') }}</h1>

            <!-- الفورم -->
            <form class="auth-form" @submit.prevent="onSubmit" novalidate>
              
              <template v-if="mode === 'signup'">
                <div class="form-group">
                  <label class="form-label">{{ t('auth.fullName') }}</label>
                  <input
                    v-model="name"
                    type="text"
                    class="form-control"
                    :class="inputState('name')"
                    :placeholder="t('auth.enterName')"
                    required
                    @input="touched.name = true; validateField('name')"
                    @blur="touched.name = true; validateField('name')"
                  />
                  <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
                </div>

                <div class="form-group">
                  <label class="form-label">{{ t('auth.phone') }}</label>
                  <input
                    v-model="phone"
                    type="tel"
                    class="form-control"
                    :class="inputState('phone')"
                    :placeholder="t('auth.enterPhone')"
                    required
                    @input="touched.phone = true; validateField('phone')"
                    @blur="touched.phone = true; validateField('phone')"
                  />
                  <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
                </div>

                <div class="form-group">
                  <label class="form-label">{{ i18n.locale === 'ar' ? 'الفئة العمرية' : 'Age Group' }}</label>
                  <select
                    v-model="age"
                    class="form-control"
                    :class="inputState('age')"
                    required
                    @change="touched.age = true; validateField('age')"
                    @blur="touched.age = true; validateField('age')"
                  >
                    <option value="">{{ i18n.locale === 'ar' ? 'اختر العمر' : 'Select age' }}</option>
                    <option value="3-5">3-5</option>
                    <option value="4-6">4-6</option>
                    <option value="5-7">5-7</option>
                    <option value="6-8">6-8</option>
                    <option value="7-9">7-9</option>
                    <option value="8-10">8-10</option>
                  </select>
                  <div class="invalid-feedback" v-if="errors.age">{{ errors.age }}</div>
                </div>
              </template>

              <div class="form-group">
                <label class="form-label">{{ t('auth.email') }}</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  :class="inputState('email')"
                  :placeholder="t('auth.enterEmail')"
                  required
                  @input="touched.email = true; validateField('email')"
                  @blur="touched.email = true; validateField('email')"
                />
                <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t('auth.password') }}</label>
                <div class="password-input-group">
                  <input
                    v-model="password"
                    :type="showPass ? 'text' : 'password'"
                    class="form-control"
                    :class="inputState('password')"
                    :placeholder="t('auth.enterPassword')"
                    required
                    minlength="8"
                    @input="touched.password = true; validateField('password')"
                    @blur="touched.password = true; validateField('password')"
                  />
                  <button type="button" class="password-toggle" @click="showPass = !showPass">
                    <svg v-if="!showPass" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
                <div class="invalid-feedback d-block" v-if="errors.password">{{ errors.password }}</div>
              </div>

              <div class="form-group" v-if="mode === 'signup'">
                <label class="form-label">{{ t('auth.repeatPassword') }}</label>
                <div class="password-input-group">
                  <input
                    v-model="password2"
                    :type="showPass2 ? 'text' : 'password'"
                    class="form-control"
                    :class="inputState('password2')"
                    :placeholder="t('auth.enterPassword')"
                    required
                    minlength="8"
                    @input="touched.password2 = true; validateField('password2')"
                    @blur="touched.password2 = true; validateField('password2')"
                  />
                  <button type="button" class="password-toggle" @click="showPass2 = !showPass2">
                    <svg v-if="!showPass2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
                <div class="invalid-feedback d-block" v-if="errors.password2">{{ errors.password2 }}</div>
              </div>

              <div class="form-options" v-if="mode === 'login'">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="remember" id="rememberMe">
                  <label class="form-check-label" for="rememberMe">{{ t('auth.rememberMe') }}</label>
                </div>
                <a class="forget-link" href="#" @click.prevent="resetPassword">
                  {{ t('auth.forgetPassword') }}
                </a>
              </div>

              <button class="auth-submit-btn" type="submit" :disabled="isSubmitting">
                <span v-if="isSubmitting">{{ i18n.locale === 'ar' ? 'جاري المعالجة...' : 'Processing...' }}</span>
                <span v-else>{{ mode === 'login' ? t('auth.signin') : t('auth.signup') }}</span>
              </button>

              <div class="divider">
                <hr />
                <span>{{ t('auth.or') }}</span>
                <hr />
              </div>

              <div class="social-buttons">
                <button type="button" class="social-btn google-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {{ t('auth.signInWithGoogle') }}
                </button>
                <button type="button" class="social-btn facebook-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {{ t('auth.signInWithFacebook') }}
                </button>
              </div>

              <div class="auth-footer">
                <p v-if="mode === 'signup'">
                  {{ t('auth.alreadyHaveAccount') }}
                  <a href="#" @click.prevent="mode = 'login'">{{ t('auth.login') }}</a>
                </p>
                <p v-else>
                  {{ t('auth.newHere') }}
                  <a href="#" @click.prevent="mode = 'signup'">{{ t('auth.createAccount') }}</a>
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- القسم الأيمن - الصورة -->
        <div class="col-lg-6 d-none d-lg-block auth-visual"></div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useAdminStore } from '@/stores/admin.js'
import { useI18nStore } from '@/stores/i18n.js'
import { useToast } from 'vue-toastification'

const i18n = useI18nStore()
const t = i18n.t

const mode = ref('login')
const showPass = ref(false)
const showPass2 = ref(false)
const remember = ref(false)
const name = ref('')
const phone = ref('')
const age = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const errors = reactive({})
const touched = reactive({
  name: false,
  phone: false,
  age: false,
  email: false,
  password: false,
  password2: false
})

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const adminStore = useAdminStore()
const toast = useToast()

function safeRedirectTarget(raw) {
  const s = String(raw || '').trim()
  // only allow in-app relative paths
  if (s.startsWith('/')) return s
  return '/'
}

function clearReasonFromQuery() {
  const q = { ...route.query }
  if ('reason' in q) delete q.reason
  // avoid extra navigation if already clean
  router.replace({ query: q }).catch(() => {})
}

onMounted(async () => {
  await auth.load()
  await adminStore.load()

  // Show one-time message when arriving from a guard (nav/enroll)
  const reason = String(route.query.reason || '')
  if (reason === 'enroll') {
    toast.info(i18n.locale === 'ar'
      ? 'لازم تسجّل دخول عشان تعمل Enroll في الكورس.'
      : 'You need to log in to enroll in this course.')
    clearReasonFromQuery()
  } else if (reason === 'nav') {
    toast.info(i18n.locale === 'ar'
      ? 'لازم تسجّل دخول عشان تقدر تفتح الصفحة دي.'
      : 'Please log in to access this page.')
    clearReasonFromQuery()
  }
})

const resetErrors = () => {
  errors.name = ''
  errors.phone = ''
  errors.age = ''
  errors.email = ''
  errors.password = ''
  errors.password2 = ''
}

const validateField = (field) => {
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (field === 'email' || field === 'all') {
    errors.email = emailRe.test(email.value) ? '' : t('auth.errors.emailInvalid')
  }
  if (field === 'password' || field === 'all') {
    errors.password = password.value.length < 8 ? t('auth.errors.passwordMin') : ''
  }
  if (mode.value === 'signup') {
    if (field === 'name' || field === 'all') {
      errors.name = name.value.trim() ? '' : t('auth.errors.nameRequired')
    }
    if (field === 'phone' || field === 'all') {
      errors.phone = /^[0-9+\-() ]{6,20}$/.test(phone.value) ? '' : t('auth.errors.phoneInvalid')
    }
    if (field === 'age' || field === 'all') {
      errors.age = String(age.value || '').trim() ? '' : (i18n.locale === 'ar' ? 'اختر الفئة العمرية.' : 'Please select an age group.')
    }
    if (field === 'password2' || field === 'all' || field === 'password') {
      errors.password2 = password2.value === password.value ? '' : t('auth.errors.passwordMismatch')
    }
  } else {
    errors.name = ''
    errors.phone = ''
    errors.age = ''
    errors.password2 = ''
  }
}

const validate = () => {
  validateField('all')
  return Object.values(errors).every((v) => !v)
}

const inputState = (field) => ({
  'is-invalid': touched[field] && errors[field],
  'is-valid': touched[field] && !errors[field]
})

const isSubmitting = ref(false)

const onSubmit = async () => {
  if (!validate()) {
    toast.error(i18n.locale === 'ar' ? 'من فضلك أصلح الأخطاء في النموذج.' : 'Please fix the errors in the form.')
    return
  }
  
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    if (mode.value === 'login') {
      const emailLower = String(email.value || '').trim().toLowerCase()
      // Admin login from the same page (no separate admin login page)
      if (emailLower === 'admin@gmail.com') {
        const ok = await adminStore.login({ username: emailLower, password: password.value })
        if (!ok) {
          errors.password = i18n.locale === 'ar' ? 'بيانات الأدمن غير صحيحة.' : 'Invalid admin credentials.'
          toast.error(errors.password)
          return
        }
        toast.success(i18n.locale === 'ar' ? 'تم تسجيل الدخول كأدمن بنجاح!' : 'Logged in as admin successfully!')
        const to = String(route.query.redirect || '/admin')
        router.push(to)
        return
      }
      // Regular user login
      adminStore.logout() // Security: ensure no admin session remains
      await auth.login({ email: email.value.trim(), password: password.value })
      toast.success(i18n.locale === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!')
      router.push(safeRedirectTarget(route.query.redirect || '/'))
    } else {
      // Signup
      adminStore.logout() // Security: ensure no admin session from previous state
      await auth.register({
        name: name.value.trim(),
        phone: phone.value.trim(),
        age: age.value,
        email: email.value.trim(),
        password: password.value
      })
      toast.success(i18n.locale === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!')
      router.push(safeRedirectTarget(route.query.redirect || '/'))
    }
  } catch (err) {
    const errorMsg = err?.message || ''
    if (errorMsg === 'no-user' || errorMsg.includes('no-user')) {
      errors.email = t('auth.errors.noUser')
      toast.error(i18n.locale === 'ar' ? 'البريد الإلكتروني غير مسجل.' : 'Email not registered.')
    } else if (errorMsg === 'reserved-admin' || errorMsg.includes('reserved-admin')) {
      errors.email = t('auth.errors.reservedAdmin')
      toast.error(i18n.locale === 'ar' ? 'هذا البريد محجوز للأدمن. أدخل كلمة مرور الأدمن لتسجيل الدخول.' : 'This email is reserved for admin. Enter the admin password to log in.')
    } else if (errorMsg === 'suspended' || errorMsg.includes('suspended')) {
      errors.email = i18n.locale === 'ar' ? 'هذا الحساب موقوف. تواصل مع الدعم.' : 'This account is suspended. Please contact support.'
      toast.error(i18n.locale === 'ar' ? 'هذا الحساب موقوف. تواصل مع الدعم.' : 'This account is suspended. Please contact support.')
    } else if (errorMsg === 'bad-pass' || errorMsg.includes('bad-pass')) {
      errors.password = t('auth.errors.badPassword')
      toast.error(i18n.locale === 'ar' ? 'كلمة المرور غير صحيحة.' : 'Incorrect password.')
    } else if (errorMsg === 'user-exists' || errorMsg.includes('user-exists')) {
      errors.email = t('auth.errors.userExists')
      toast.error(i18n.locale === 'ar' ? 'البريد الإلكتروني مسجل بالفعل.' : 'Email already registered.')
    } else {
      errors.email = t('auth.errors.general')
      toast.error(i18n.locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.')
    }
    console.error('Auth error:', err)
  } finally {
    isSubmitting.value = false
  }
}

const resetPassword = () => {
  if (!email.value) {
    errors.email = t('auth.errors.enterEmailFirst')
    return
  }
  toast.success(t('auth.resetLinkSent'))
}

watch(mode, () => {
  resetErrors()
  touched.name = false
  touched.phone = false
  touched.age = false
  touched.email = false
  touched.password = false
  touched.password2 = false
})

// Watch locale changes to update error messages
watch(() => i18n.locale, () => {
  if (Object.keys(errors).some(key => errors[key])) {
    validateField('all')
  }
})
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 30px 20px;
}

.auth-container {
  width: 100%;
  max-width: 950px;
  height: auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: row;
}

.auth-container .row {
  height: 100%;
  margin: 0;
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
}

/* القسم الأيسر - الفورم */
.auth-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 40px 60px;
  width: 50%;
  flex: 0 0 50%;
  height: 700px;
}

.form-container {
  width: 100%;
  max-width: 420px;
}

.auth-logo {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.logo-img {
  height: 38px;
  width: auto;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #033B62;
  margin-bottom: 0.75rem;
  margin-top: 0;
  line-height: 1.2;
  letter-spacing: 2px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-weight: 600;
  color: #033B62;
  font-size: 0.8rem;
  margin-bottom: 0;
  letter-spacing: 0.01em;
}

.form-control {
  padding: 0.5rem 0.875rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #033B62;
  height: auto;
  line-height: 1.4;
}

.form-control::placeholder {
  color: #9ca3af;
}

.form-control:focus {
  border-color: #00BFFF;
  box-shadow: 0 0 0 4px rgba(0, 191, 255, 0.1);
  outline: none;
  background: #ffffff;
}

.password-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-group .form-control {
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.625rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  width: 20px;
  height: 20px;
}

.password-toggle:hover {
  color: #033B62;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.15rem;
  margin-bottom: 0;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.form-check-input {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  border: 2px solid #d1d5db;
  border-radius: 4px;
}

.form-check-input:checked {
  background-color: #00BFFF;
  border-color: #00BFFF;
}

.form-check-label {
  font-size: 0.8rem;
  color: #033B62;
  cursor: pointer;
  margin: 0;
  user-select: none;
}

.forget-link {
  color: #00BFFF;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.forget-link:hover {
  color: #00a8e6;
  text-decoration: underline;
}

.auth-submit-btn {
  width: 100%;
  padding: 0.625rem 1.5rem;
  background-color: #00BFFF;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.1rem;
  letter-spacing: 0.01em;
}

.auth-submit-btn:hover:not(:disabled) {
  background-color: #00a8e6;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 191, 255, 0.35);
}

.auth-submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.auth-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin: 0.875rem 0 0.75rem 0;
}

.divider hr {
  flex: 1;
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0;
}

.divider span {
  color: #6b7280;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.social-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4375rem 0.5625rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #033B62;
  font-size: 0.65rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.01em;
}

.social-btn:hover {
  border-color: #00BFFF;
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.social-btn:active {
  transform: translateY(0);
}

.social-btn svg {
  flex-shrink: 0;
}

.google-btn {
  border-color: #e5e7eb;
}

.facebook-btn {
  border-color: #e5e7eb;
}

.auth-footer {
  text-align: center;
  margin-top: 0.875rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.auth-footer p {
  margin: 0;
}

.auth-footer a {
  color: #00BFFF;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.375rem;
  transition: all 0.3s ease;
}

.auth-footer a:hover {
  color: #00a8e6;
  text-decoration: underline;
}

/* القسم الأيمن - الصورة */
.auth-visual {
  background: url('/assets/register.png') center/cover no-repeat;
  height: 700px;
  width: 50%;
  flex: 0 0 50%;
  position: relative;
  border-radius: 0 16px 16px 0;
}

/* Responsive */
@media (max-width: 991px) {
  .auth-wrapper {
    padding: 30px 15px;
  }

  .auth-container {
    flex-direction: column;
    max-width: 550px;
    min-height: auto;
  }

  .auth-container .row {
    flex-direction: column;
    flex-wrap: wrap;
  }

  .auth-form-section {
    padding: 40px 40px;
    width: 100%;
    flex: 0 0 100%;
    min-height: auto;
  }

  .auth-logo {
    margin-bottom: 1.5rem;
  }
  
  .auth-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .auth-visual {
    min-height: 350px;
    width: 100%;
    flex: 0 0 100%;
    border-radius: 0 0 20px 20px;
  }
}

@media (max-width: 767px) {
  .auth-wrapper {
    padding: 30px 15px;
  }

  .auth-container {
    border-radius: 20px;
    max-width: 100%;
  }

  .auth-form-section {
    padding: 40px 30px;
  }

  .auth-logo {
    margin-bottom: 2rem;
  }

  .logo-img {
    height: 42px;
  }

  .auth-title {
    font-size: 1.875rem;
    margin-bottom: 1.75rem;
  }

  .auth-form {
    gap: 1.5rem;
  }

  .social-buttons {
    flex-direction: column;
    gap: 0.875rem;
  }

  .social-btn {
    width: 100%;
  }

  .auth-visual {
    min-height: 350px;
    border-radius: 0 0 20px 20px;
  }

  .divider {
    margin: 1.5rem 0 1.25rem 0;
  }
}

</style>


