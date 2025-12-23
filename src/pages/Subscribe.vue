<template>
  <div class="payment-page">
    <div class="payment-container" v-if="course">
      
      <!-- Success View -->
      <div v-if="showSuccess" class="success-view">
        <div class="success-card">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2>{{ t('subscribe.successMsg', { course: getDisplayTitle(course) }) }}</h2>
          <button class="btn btn-primary mt-4" @click="goToMyCourses">{{ t('subscribe.goToMyCourses') }}</button>
        </div>
      </div>

      <!-- Payment Form View -->
      <div v-else>
        <h1 class="page-title">{{ t('subscribe.pageTitle') }}</h1>
        <div class="payment-layout">
          <!-- Left Column: Payment Form -->
          <div class="payment-form-section">
            <!-- Billing Details -->
            <div class="section-block">
              <h3 class="block-title">{{ t('subscribe.billingDetails') }}</h3>
              <div class="form-row">
                <div class="form-group half">
                  <label>{{ t('subscribe.firstName') }}</label>
                  <input type="text" v-model="form.firstName" :placeholder="t('subscribe.firstNamePlaceholder')" class="input-field" />
                </div>
                <div class="form-group half">
                  <label>{{ t('subscribe.lastName') }}</label>
                  <input type="text" v-model="form.lastName" :placeholder="t('subscribe.lastNamePlaceholder')" class="input-field" />
                </div>
              </div>
              <div class="form-group">
                <label>{{ t('subscribe.email') }}</label>
                <input 
                  type="email" 
                  v-model="form.email" 
                  :placeholder="t('subscribe.emailPlaceholder')" 
                  class="input-field" 
                  :class="{ 'is-invalid': errors.email }"
                />
                <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="section-block">
              <h3 class="block-title">{{ t('subscribe.paymentDetails') }}</h3>
              
              <!-- Static Credit Card UI removed as requested -->

              <!-- Card Details Form -->
              <div class="card-details-form mt-4">
                <div class="form-group">
                  <label>{{ t('subscribe.cardNumber') }}</label>
                  <div class="input-with-icon">
                    <input 
                      type="text" 
                      v-model="form.cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      maxlength="19" 
                      class="input-field" 
                      :class="{ 'is-invalid': errors.cardNumber }"
                    />
                    <i class="icon-credit-card"></i>
                  </div>
                  <span v-if="errors.cardNumber" class="error-text">{{ errors.cardNumber }}</span>
                </div>
                <div class="form-row">
                  <div class="form-group half">
                    <label>{{ t('subscribe.expiryDate') }}</label>
                    <input 
                      type="text" 
                      v-model="form.expiry" 
                      placeholder="MM/YY" 
                      maxlength="5" 
                      class="input-field" 
                      :class="{ 'is-invalid': errors.expiry }"
                    />
                    <span v-if="errors.expiry" class="error-text">{{ errors.expiry }}</span>
                  </div>
                  <div class="form-group half">
                    <label>{{ t('subscribe.cvv') }}</label>
                    <input 
                      type="text" 
                      v-model="form.cvv" 
                      placeholder="123" 
                      maxlength="3" 
                      class="input-field" 
                      :class="{ 'is-invalid': errors.cvv }"
                    />
                    <span v-if="errors.cvv" class="error-text">{{ errors.cvv }}</span>
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ t('subscribe.cardHolder') }}</label>
                  <input type="text" v-model="form.cardHolder" :placeholder="t('subscribe.cardHolderPlaceholder')" class="input-field" />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Order Summary -->
          <div class="order-summary-section">
            <div class="summary-card">
              <h3 class="summary-title">{{ t('subscribe.orderSummary') }}</h3>
              
              <div class="course-preview">
                <div class="course-img">
                  <img :src="course.thumbnail" :alt="course.title" />
                </div>
                <div class="course-info">
                  <h4>{{ getDisplayTitle(course) }}</h4>
                  <p>{{ t('course.categoryLabel') }}: {{ categoryText(course) }}</p>
                </div>
              </div>

              <div class="price-breakdown">
                <div class="price-row">
                  <span>{{ t('subscribe.originalPrice') }}</span>
                  <span class="original-price">${{ (course.price * 1.25).toFixed(2) }}</span>
                </div>
                <div class="price-row discount">
                  <span>{{ t('subscribe.discount') }} (25%)</span>
                  <span>-${{ (course.price * 0.25).toFixed(2) }}</span>
                </div>
                <div class="divider"></div>
                <div class="price-row total">
                  <span>{{ t('subscribe.total') }}</span>
                  <span class="total-amount">${{ course.price }}</span>
                </div>
              </div>

              <button class="pay-btn" @click="doSubscribe" :disabled="isProcessing">
                <span v-if="!isProcessing">{{ t('subscribe.payNow') }} ${{ course.price }}</span>
                <span v-else>{{ t('subscribe.processing') }}</span>
              </button>
              
              <p class="secure-note">
                <i class="icon-lock"></i> {{ t('subscribe.securePayment') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="not-found">
      <p>{{ t('courseDetail.notFound') }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCoursesStore } from '@/stores/courses.js'
import { useSubscriptionStore } from '@/stores/subscription.js'
import { useI18nStore } from '@/stores/i18n.js'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const store = useCoursesStore()
const sub = useSubscriptionStore()
const i18n = useI18nStore()
const t = i18n.t
const toast = useToast()

const isProcessing = ref(false)
const showSuccess = ref(false)
const errors = reactive({})

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  cardHolder: ''
})

onMounted(() => { 
  store.load()
  sub.load() 
})

const course = computed(() => store.getById(route.params.id))

const getDisplayTitle = (c) => {
  return i18n.locale === 'en' ? (c.title_en || c.title) : (c.title_ar || c.title)
}

const categoryText = (c) => {
  const map = { Arabic: t('category.arabic'), English: t('category.english'), Math: t('category.math') }
  return map[c.category] || c.category
}

const validate = () => {
  let isValid = true
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email || !emailPattern.test(form.email)) {
    errors.email = t('subscribe.errors.invalidEmail')
    isValid = false
  }

  // Card validation (simple length check + digit only)
  const cardClean = form.cardNumber.replace(/\s/g, '')
  if (!/^\d{16}$/.test(cardClean)) {
    errors.cardNumber = t('subscribe.errors.invalidCard')
    isValid = false
  }

  // Expiry validation (MM/YY)
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
    errors.expiry = t('subscribe.errors.invalidExpiry')
    isValid = false
  } else {
    // Check if expired
    const parts = form.expiry.split('/')
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10)
      const year = parseInt('20' + parts[1], 10)
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = t('subscribe.errors.expiredCard')
        isValid = false
      }
    }
  }

  // CVV validation
  if (!/^\d{3}$/.test(form.cvv)) {
    errors.cvv = t('subscribe.errors.invalidCvv')
    isValid = false
  }

  if (!isValid) {
    toast.error(t('subscribe.fillRequired'))
  }

  return isValid
}

const doSubscribe = async () => {
  if (!course.value) return
  
  if (!validate()) {
    // alert(t('subscribe.fillRequired')) // Optional: show toast or just rely on inline errors
    return
  }

  isProcessing.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  sub.subscribe(course.value.id)
  isProcessing.value = false
  
  // Show Success View instead of redirecting immediately
  showSuccess.value = true
}

const goToMyCourses = () => {
  router.push('/my-courses')
}
</script>

<style scoped>
.payment-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px 0 80px;
}

.payment-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  color: #033B62;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 40px;
  text-align: center;
}

.payment-layout {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 30px;
  align-items: start;
}

/* Sections */
.section-block {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.05);
}

.block-title {
  color: #033B62;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Forms */
.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.half {
  flex: 1;
}

label {
  display: block;
  color: #555;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease;
  background-color: #fcfcfc;
}

.input-field:focus {
  outline: none;
  border-color: #00BFFF;
  background-color: white;
}

.is-invalid {
  border-color: #ff4d4f !important;
  background-color: #fff1f0 !important;
}

.error-text {
  color: #ff4d4f;
  font-size: 0.85rem;
  margin-top: 5px;
  display: block;
}



/* Summary Card */
.summary-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid rgba(0,0,0,0.05);
  position: sticky;
  top: 40px;
}

.summary-title {
  color: #033B62;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 25px;
}

.course-preview {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
}

.course-img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.course-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info h4 {
  color: #033B62;
  font-weight: 700;
  font-size: 1rem;
  margin: 0 0 5px;
  line-height: 1.4;
}

.course-info p {
  color: #777;
  font-size: 0.9rem;
  margin: 0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #555;
  font-size: 0.95rem;
}

.original-price {
  text-decoration: line-through;
  color: #999;
}

.discount {
  color: #27ae60;
  font-weight: 600;
}

.divider {
  height: 1px;
  background-color: #eee;
  margin: 15px 0;
}

.total {
  color: #033B62;
  font-weight: 800;
  font-size: 1.4rem;
  margin-top: 5px;
  margin-bottom: 25px;
}

.pay-btn {
  background-color: #00BFFF;
  color: white;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 191, 255, 0.25);
}

.pay-btn:hover:not(:disabled) {
  background-color: #009ad6;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 191, 255, 0.35);
}

.pay-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.secure-note {
  text-align: center;
  color: #888;
  font-size: 0.85rem;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/* Success View */
.success-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  text-align: center;
}

.success-card {
  background: white;
  padding: 50px;
  border-radius: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  max-width: 500px;
}

.success-icon {
  width: 80px;
  height: 80px;
  background-color: #e6f7ff;
  color: #00BFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
}

.success-icon svg {
  width: 40px;
  height: 40px;
}

.success-card h2 {
  color: #033B62;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 30px;
}

.btn-primary {
  background-color: #00BFFF;
  color: white;
  padding: 15px 40px;
  border-radius: 50px;
  border: none;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #009ad6;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 191, 255, 0.3);
}

@media (max-width: 900px) {
  .payment-layout {
    grid-template-columns: 1fr;
  }
  .summary-card {
    position: static;
  }
}
</style>
