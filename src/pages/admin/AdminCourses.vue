<template>
  <div>
    <h2 class="section-title">Manage Courses</h2>
    <form class="card grid grid-cols-1 md:grid-cols-2 gap-3 mb-6" @submit.prevent="save">
      <input v-model="title_en" :placeholder="locale==='en' ? 'Title (EN)' : 'العنوان (إنجليزي)'" class="p-3 rounded-xl border" />
      <input v-model="title_ar" :placeholder="locale==='en' ? 'Title (AR)' : 'العنوان (عربي)'" class="p-3 rounded-xl border" />
      <input v-model="description_en" :placeholder="locale==='en' ? 'Description (EN)' : 'الوصف (إنجليزي)'" class="p-3 rounded-xl border col-span-1 md:col-span-2" />
      <input v-model="description_ar" :placeholder="locale==='en' ? 'Description (AR)' : 'الوصف (عربي)'" class="p-3 rounded-xl border col-span-1 md:col-span-2" />
      <select v-model="category" class="p-3 rounded-xl border">
        <option>Arabic</option>
        <option>English</option>
        <option>Math</option>
      </select>
      <input v-model.number="price" type="number" placeholder="Price" class="p-3 rounded-xl border" />
      <input v-model="thumbnail" placeholder="Thumbnail URL" class="p-3 rounded-xl border col-span-1 md:col-span-2" />
      <div class="flex gap-3 col-span-1 md:col-span-2">
        <button class="btn" type="submit">{{ editingId ? (locale==='en' ? 'Update Course' : 'تحديث الكورس') : (locale==='en' ? 'Add Course' : 'إضافة كورس') }}</button>
        <button v-if="editingId" class="btn-outline" type="button" @click="resetForm">{{ locale==='en' ? 'Cancel' : 'إلغاء' }}</button>
      </div>
    </form>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="c in courses" :key="c.id" class="card">
        <img :src="c.thumbnail" class="w-full h-32 object-cover rounded-xl" />
        <div class="mt-2 font-fredoka text-darkblue">{{ c.title_en || c.title }}</div>
        <div class="text-sm text-gray-600">{{ c.category }} • ${{ c.price }}</div>
        <div class="mt-3 flex gap-2">
          <button class="btn-outline" @click="edit(c)">{{ locale==='en' ? 'Edit' : 'تعديل' }}</button>
          <button class="btn" @click="remove(c.id)">{{ locale==='en' ? 'Delete' : 'حذف' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses.js'
import { useI18nStore } from '@/stores/i18n.js'
const store = useCoursesStore()
onMounted(() => store.load())
const title_en = ref('')
const title_ar = ref('')
const description_en = ref('')
const description_ar = ref('')
const category = ref('Arabic')
const price = ref(29)
const thumbnail = ref('/assets/arabic.svg')
const courses = computed(() => store.courses)
const editingId = ref(null)
const i18n = useI18nStore()
const locale = i18n.locale
const save = () => {
  const course = {
    id: editingId.value || `c${Date.now()}`,
    title: title_en.value,
    title_en: title_en.value,
    title_ar: title_ar.value,
    description: description_en.value,
    description_en: description_en.value,
    description_ar: description_ar.value,
    category: category.value,
    price: price.value,
    thumbnail: thumbnail.value,
    age: '4-8',
    seats: 10,
    lessons: []
  }
  if (editingId.value) {
    store.updateCourse(course)
  } else {
    store.addCourse(course)
  }
  resetForm()
}
const edit = (c) => {
  editingId.value = c.id
  title_en.value = c.title_en || c.title || ''
  title_ar.value = c.title_ar || ''
  description_en.value = c.description_en || c.description || ''
  description_ar.value = c.description_ar || ''
  category.value = c.category
  price.value = c.price
  thumbnail.value = c.thumbnail
}
const remove = (id) => { if (confirm(locale==='en' ? 'Delete course?' : 'حذف الكورس؟')) store.deleteCourse(id) }
const resetForm = () => { editingId.value = null; title_en.value = title_ar.value = description_en.value = description_ar.value = ''; category.value = 'Arabic'; price.value = 29; thumbnail.value = '/assets/arabic.svg' }
</script>
