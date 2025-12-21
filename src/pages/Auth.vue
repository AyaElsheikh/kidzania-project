<template>
  <div class="auth-wrapper">
    <div class="auth-container shadow-lg">

      <div class="row g-0 h-100">

        <!-- الصورة - تظهر فقط على الشاشات الكبيرة -->
        <div class="col-lg-6 d-none d-lg-block auth-visual"></div>

        <!-- الفورم -->
        <div class="col-lg-6 col-12 d-flex align-items-center justify-content-center">
          <div class="form-box">

            <h1 class="fw-bold mb-4" style="color: #033B62;">{{ mode === 'login' ? 'Log in' : 'Sign up' }}</h1>

            <!-- الفورم كامل زي ما هو -->
            <form class="row gy-3" @submit.prevent="onSubmit" novalidate>
              
              <template v-if="mode === 'signup'">
                <div class="col-12">
                  <label class="form-label fw-semibold" style="color: #033B62;">Full Name</label>
                  <input
                    v-model="name"
                    type="text"
                    class="form-control"
                    :class="inputState('name')"
                    placeholder="Enter your Name"
                    required
                    @input="touched.name = true; validateField('name')"
                    @blur="touched.name = true; validateField('name')"
                  />
                  <div class="invalid-feedback" v-if="errors.name">{{ errors.name }}</div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold" style="color: #033B62;">Phone number</label>
                  <input
                    v-model="phone"
                    type="tel"
                    class="form-control"
                    :class="inputState('phone')"
                    placeholder="Enter your number"
                    required
                    @input="touched.phone = true; validateField('phone')"
                    @blur="touched.phone = true; validateField('phone')"
                  />
                  <div class="invalid-feedback" v-if="errors.phone">{{ errors.phone }}</div>
                </div>
              </template>

              <div class="col-12">
                <label class="form-label fw-semibold" style="color: #033B62;">Email</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  :class="inputState('email')"
                  placeholder="Enter your Email"
                  required
                  @input="touched.email = true; validateField('email')"
                  @blur="touched.email = true; validateField('email')"
                />
                <div class="invalid-feedback" v-if="errors.email">{{ errors.email }}</div>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold" style="color: #033B62;">Password</label>
                <div class="input-group">
                  <input
                    v-model="password"
                    :type="showPass ? 'text' : 'password'"
                    class="form-control"
                    :class="inputState('password')"
                    placeholder="At least 8 characters"
                    required
                    minlength="8"
                    @input="touched.password = true; validateField('password')"
                    @blur="touched.password = true; validateField('password')"
                  />
                  <button type="button" class="btn btn-outline-secondary" @click="showPass = !showPass">
                    👁
                  </button>
                </div>
                <div class="invalid-feedback d-block" v-if="errors.password">{{ errors.password }}</div>
              </div>

              <div class="col-12" v-if="mode === 'signup'">
                <label class="form-label fw-semibold" style="color: #033B62;">Repeat password</label>
                <div class="input-group">
                  <input
                    v-model="password2"
                    :type="showPass2 ? 'text' : 'password'"
                    class="form-control"
                    :class="inputState('password2')"
                    placeholder="At least 8 characters"
                    required
                    minlength="8"
                    @input="touched.password2 = true; validateField('password2')"
                    @blur="touched.password2 = true; validateField('password2')"
                  />
                  <button type="button" class="btn btn-outline-secondary" @click="showPass2 = !showPass2">
                    👁
                  </button>
                </div>
                <div class="invalid-feedback d-block" v-if="errors.password2">{{ errors.password2 }}</div>
              </div>

              <div class="col-12 d-flex justify-content-between align-items-center" v-if="mode === 'login'">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="remember" id="rememberMe">
                  <label class="form-check-label" for="rememberMe">Remember me</label>
                </div>
                <a class="fw-semibold text-decoration-none" style="color: #00BFFF;" href="#" @click.prevent="resetPassword">
                  Forget Password?
                </a>
              </div>

              <div class="col-12">
                <button class="btn w-100 py-2 fw-semibold text-white" style="background-color: #00BFFF;" type="submit">
                  {{ mode === 'login' ? 'Sign in' : 'Sign up' }}
                </button>
              </div>

              <div class="col-12 d-flex align-items-center gap-2 text-muted">
                <hr class="flex-grow-1" />
                <span class="small fw-semibold">OR</span>
                <hr class="flex-grow-1" />
              </div>

              <div class="col-12 d-flex flex-column flex-md-row gap-2">
                <button type="button" class="btn btn-outline-secondary flex-fill">Sign in with Google</button>
                <button type="button" class="btn btn-outline-primary flex-fill">Sign in with Facebook</button>
              </div>

              <div class="col-12 text-muted">
                <p class="mb-0" v-if="mode === 'signup'">
                  Already have an account ?
                  <a class="fw-semibold text-decoration-none" style="color: #00BFFF;" href="#" @click.prevent="mode = 'login'">Log in</a>
                </p>
                <p class="mb-0" v-else>
                  New here ?
                  <a class="fw-semibold text-decoration-none" style="color: #00BFFF;" href="#" @click.prevent="mode = 'signup'">Create account</a>
                </p>
              </div>
            </form>

          </div>
        </div>

      </div>

    </div>
  </div>
</template>



<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { useAdminStore } from '@/stores/admin.js'

const mode = ref('login')
const showPass = ref(false)
const showPass2 = ref(false)
const remember = ref(false)
const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const errors = reactive({})
const touched = reactive({
  name: false,
  phone: false,
  email: false,
  password: false,
  password2: false
})

const router = useRouter()
const auth = useAuthStore()
const adminStore = useAdminStore()
auth.load()
adminStore.load()

const resetErrors = () => {
  errors.name = ''
  errors.phone = ''
  errors.email = ''
  errors.password = ''
  errors.password2 = ''
}

const validateField = (field) => {
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (field === 'email' || field === 'all') {
    errors.email = emailRe.test(email.value) ? '' : 'البريد غير صحيح، استخدم صيغة name@example.com'
  }
  if (field === 'password' || field === 'all') {
    errors.password = password.value.length < 8 ? 'كلمة المرور لا تقل عن 8 أحرف' : ''
  }
  if (mode.value === 'signup') {
    if (field === 'name' || field === 'all') {
      errors.name = name.value.trim() ? '' : 'الاسم مطلوب'
    }
    if (field === 'phone' || field === 'all') {
      errors.phone = /^[0-9+\-() ]{6,20}$/.test(phone.value) ? '' : 'أدخل رقم هاتف صحيح'
    }
    if (field === 'password2' || field === 'all' || field === 'password') {
      errors.password2 = password2.value === password.value ? '' : 'كلمتا المرور غير متطابقتين'
    }
  } else {
    errors.name = ''
    errors.phone = ''
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

const onSubmit = () => {
  if (!validate()) return
  try {
    if (mode.value === 'login') {
      // admin shortcut
      if (email.value === 'admin@gmail.com' && password.value === 'admin123') {
        // Force setup to ensure these credentials work even if another admin exists
        adminStore.setup({ name: 'Admin', username: 'admin@gmail.com', password: 'admin123' })
        
        adminStore.login({ username: 'admin@gmail.com', password: 'admin123' })
        
        // Also ensure user exists in auth store so header shows generic logged in state if needed
        auth.loginOrRegister({
          name: 'Admin',
          phone: '0000000000',
          email: 'admin@gmail.com',
          password: 'admin123'
        })
        
        router.push('/admin')
        return
      }
      auth.login({ email: email.value.trim(), password: password.value })
    } else {
      auth.register({
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        password: password.value
      })
    }
    router.push('/profile')
  } catch (err) {
    if (err.message === 'no-user') errors.email = 'لا يوجد حساب بهذا البريد، قم بعمل Sign up'
    else if (err.message === 'bad-pass') errors.password = 'كلمة المرور غير صحيحة'
    else if (err.message === 'user-exists') errors.email = 'هذا البريد مسجل بالفعل، سجّل الدخول'
    else errors.email = 'حدث خطأ، حاول مرة أخرى'
  }
}

const resetPassword = () => {
  if (!email.value) {
    errors.email = 'Enter your email first'
    return
  }
  alert('Reset link sent (demo)')
}

watch(mode, () => {
  resetErrors()
  touched.name = false
  touched.phone = false
  touched.email = false
  touched.password = false
  touched.password2 = false
})
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  padding: 20px;
}

/* الكارد الرئيسي */
.auth-container {
  width: 100%;
  max-width: 1100px;
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  padding: 0;
}



.auth-visual {
  background: url('/assets/register.png') center/cover no-repeat;
  min-height: 770px; 
  height: 100%;
}
.auth-container .row {
  min-height: 750px; 
}



.form-box {
  width: 100%;
  max-width: 420px;
  padding: 40px 30px;
}

/* المسافة بين الصورة والفورم — الكارد متفصل كويس */
.auth-container .row {
  height: 100%;
  min-height: 600px;
}

/* موبايل: الصورة تختفي ويظهر فورم فقط */
@media (max-width: 767px) {
  .auth-container {
    max-width: 95%;
    border-radius: 16px;
  }

  .form-box {
    max-width: 100%;
    padding: 30px 20px;
  }

  .auth-visual {
    display: none !important;
  }
}

</style>


