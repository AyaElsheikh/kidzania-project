# ميزة صفحة تفاصيل الكورس

## الوصف
تم إنشاء صفحة Vue جديدة لعرض تفاصيل الكورسات بتصميم حديث وجذاب، تحتوي على:
- Hero Section مع gradient background
- Course Overview مع وصف مفصل
- Course Outline مع accordion تفاعلي
- Other Courses section لعرض كورسات أخرى
الصفحة مدمجة بالكامل مع Vue Router ونظام إدارة الحالة.

## الملفات المُحدثة

### 1. `src/pages/CourseDetailsPage.vue`
- صفحة Vue جديدة تعرض تفاصيل الكورس
- تستخدم Vue Router للتنقل
- مدمجة مع stores الخاصة بالكورسات والاشتراكات
- تدعم عرض الفيديوهات للمشتركين فقط

### 2. `src/router/index.js`
- تم إضافة route جديد `/course-details/:id`
- يوجه إلى صفحة CourseDetailsPage

### 3. `src/pages/Home.vue`
- تم ربط أزرار "View Details" في قسم "Our Top Courses"
- تفتح صفحة التفاصيل في تبويب جديد مع معرف الكورس المناسب

### 4. `src/components/ExploreCourseCard.vue`
- تم تغيير زر "Add To My Courses" إلى "View Details"
- يفتح صفحة التفاصيل مع معرف الكورس

## كيفية الاستخدام

### من الصفحة الرئيسية:
1. اذهب إلى قسم "Our Top Courses"
2. اضغط على زر "View Details" لأي كورس
3. ستفتح صفحة التفاصيل في تبويب جديد

### من صفحة الكورسات:
1. اذهب إلى صفحة "Explore Courses"
2. اضغط على زر "View Details" في أي بطاقة كورس
3. ستفتح صفحة التفاصيل في تبويب جديد

### الوصول المباشر:
```
http://localhost:5174/course-details/c1
http://localhost:5174/course-details/c2
http://localhost:5174/course-details/c3
```

## الميزات

### 1. Hero Section:
- عنوان الكورس مع gradient background جذاب
- عرض خاص (25% off)
- زر الاشتراك أو بدء الكورس
- صورة الكورس

### 2. Course Overview:
- وصف مفصل للكورس
- صورة توضيحية
- تخطيط responsive

### 3. Course Outline (Accordion):
- قائمة تفاعلية بجميع دروس الكورس
- أيقونات ومدة كل درس
- عرض الفيديوهات للمشتركين
- رسالة قفل للمستخدمين غير المشتركين
- Bootstrap accordion مع تصميم مخصص

### 4. Other Courses Section:
- عرض 3 كورسات أخرى
- بطاقات جذابة مع tags
- أزرار للانتقال لتفاصيل الكورسات الأخرى

### 5. نظام الاشتراك:
- زر اشتراك للمستخدمين غير المشتركين
- زر "بدء الكورس" للمشتركين
- مدمج مع subscription store

### 4. التنقل:
- زر العودة للصفحة السابقة باستخدام Vue Router
- تمرير سلس إلى قسم الدروس

### 5. التصميم:
- بدون navbar وfooter (صفحة مستقلة)
- يستخدم نفس الألوان والخطوط المستخدمة في المشروع
- متجاوب مع جميع أحجام الشاشات
- يدعم اللغة العربية مع اتجاه RTL

## الكورسات المتاحة
- `c1`: العربية للأطفال
- `c2`: أساسيات الإنجليزية  
- `c3`: رياضيات ممتعة

## المكونات المستخدمة
- `VideoPlayer.vue`: لعرض الفيديوهات
- `SubscribeModal.vue`: لنافذة الاشتراك
- `useCoursesStore`: لإدارة بيانات الكورسات
- `useSubscriptionStore`: لإدارة الاشتراكات
- `useI18nStore`: لدعم اللغات المتعددة

## التقنيات المستخدمة
- Vue 3 Composition API
- Vue Router
- Pinia (State Management)
- Tailwind CSS
- CSS Custom Properties