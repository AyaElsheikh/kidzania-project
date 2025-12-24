**Kidzania (Kidzademy) — منصة تعليمية تفاعلية للأطفال**

منصة Web حديثة بتجمع بين **الكورسات + الاختبارات + الألعاب التعليمية** في تجربة ممتعة للأطفال، مع **لوحة تحكم Admin** لإدارة المحتوى.  
المشروع مبني على **Vue 3 + Vite + Pinia** ويعتمد على **JSON Server** لتخزين البيانات بشكل دائم أثناء التطوير.

---

## محتويات سريعة
- **نظرة عامة**
- **أهم المميزات**
- **التقنيات**
- **التشغيل محليًا**
- **بيانات تجريبية (Demo Accounts)**
- **الـAPI (JSON Server)**
- **مساعد الذكاء الاصطناعي (اختياري)**
- **هيكل المشروع**

---

## نظرة عامة
**Kidzania / Kidzademy** مصمم عشان يخلي التعلم “زي اللعب”:
- الطالب يشترك في كورسات، يتابع الدروس، ويشوف **progress ديناميكي**.
- الطالب يحل اختبارات، ويشوف **review** بعد ما يخلص (بدون إظهار الإجابة الصحيحة أثناء الحل).
- ألعاب تفاعلية (Drag & Drop / Matching / Memory) بتدعم **عربي + English** بنفس ألوان وهوية المشروع.
- الأدمن يدير كل حاجة: كورسات/مناهج/اختبارات/مستخدمين/اشتراكات… إلخ.

---

## أهم المميزات
### للطلاب
- **Courses**
  - مشاهدة الدروس داخل Course Player
  - **Progress حقيقي** مبني على الدروس اللي اتعملها “Complete”
  - صفحة `My Courses` لا تعرض أي كروت قبل الـenrollment + رسالة تشجيعية
- **Tests**
  - واجهة حل اختبار مع إمكانية تغيير الإجابة قبل Finish
  - إظهار الإجابة الصحيحة فقط في الـReview
  - رسالة تحفيزية حسب النتيجة
- **Games**
  - واجهات ألعاب احترافية للأطفال (Animations + ألوان متناسقة)
  - دعم **العربي/الإنجليزي** تلقائيًا حسب لغة التطبيق

### للأدمن
- **Admin Dashboard** بمؤشرات وإحصائيات ومحتوى حديث
- **Exam Builder**
  - فالديشن قوي للأسئلة (4 اختيارات + إجابة صحيحة إلزامية + رسائل توست واضحة)
  - نشر الاختبار بسهولة حتى مع الامتحانات الجديدة
  - **Draft vs Published** (الدرافت يظهر في الـAdmin فقط)
  - إعداد **Allow Retry** للتحكم في زر “Try Again”
- **Course Builder**
  - إنشاء/تعديل كورسات + Chapters + Lessons مع حفظ دائم في JSON Server
  - منع إضافة Lesson جديدة قبل إدخال بيانات الدرس الحالي
- **Users**
  - إدارة المستخدمين + Suspended/Active
  - منع المستخدم Suspended من تسجيل الدخول

---

## التقنيات (Tech Stack)
- **Frontend**: Vue 3 (Composition API) + Vite
- **State**: Pinia
- **Routing**: Vue Router
- **UI**: Bootstrap + CSS مخصص (Theme موحّد)
- **Notifications**: Vue Toastification
- **Mock Backend / Persistence**: JSON Server (`db.json`)

---

## التشغيل محليًا (Local Run)
### المتطلبات
- Node.js **18+** (مستحسن)
- npm

### تثبيت وتشغيل سريع
```bash
npm install
npm run api
npm run dev
```

### تشغيل بضغطة واحدة (Windows)
استخدم الملف:
- `build-and-run.bat`  
هيشغل **JSON Server على 3001** وبعدين يشغل **Vite Dev Server**.

---

## بيانات تجريبية (Demo Accounts)
> هذه البيانات موجودة داخل `db.json` لأغراض التطوير فقط.

### Admin Panel
- **username**: `admin@gmail.com`
- **password**: `admin123`

### User (مثال)
- **email**: `mahmoud@gmail.com`
- **password**: `12345678`
- هذا المستخدم حالته **suspended** (لا يمكنه تسجيل الدخول)

---

## الـAPI (JSON Server)
### التشغيل
```bash
npm run api
```
- **Base URL**: `http://localhost:3001`

### ملاحظة مهمة (Proxy)
التطبيق يستخدم Proxy داخل `vite.config.js`:
- أي طلب لـ `fetch('/api-data/...')` يتم تحويله إلى `http://localhost:3001/...`

### Collections الموجودة في `db.json`
- `exams`
- `results`
- `courses`
- `subscriptions`
- `users`
- `admins`

---

## مساعد الذكاء الاصطناعي (اختياري) — Kidzademy AI Assistant
المشروع يحتوي على صفحة AI Chat، ويتم حماية الـAPI Key عبر **Vite server middleware** (بدون كشف المفتاح في المتصفح).

### إعداد `.env`
أنشئ ملف `.env` في جذر المشروع:
```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

### اختبار سريع
افتح:
- `http://localhost:5173/api/ai-health`  
للتأكد إن الـenv اتحمّل على السيرفر.

---

## هيكل المشروع (High-level)
- `src/pages/` صفحات المستخدم (Home/Courses/Tests/Play/Games…)
- `src/pages/admin/` صفحات لوحة الأدمن
- `src/stores/` Pinia stores
- `src/api/` API clients (كلها عبر `/api-data`)
- `db.json` قاعدة بيانات JSON Server
- `build-and-run.bat` تشغيل سريع على Windows



