# Kidzania

تشغيل المشروع:

```
npm install
npm run dev
```

التقنيات: Vue 3 + Vite + Pinia + Vue Router + bootstrap

## Kidzademy AI Assistant (OpenAI)

للتشغيل محليًا بدون كشف الـ API Key في المتصفح:

- أنشئ ملف `.env` في جذر المشروع (لن يتم رفعه بسبب `.gitignore`)
- أضف المتغيرات التالية:

```
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

ثم افتح صفحة **Kidzademy AI Assistant** من شريط التنقل.

البيانات تُستورد من `src/data/courses.json` عبر:

```
import data from "@/data/courses.json";
const courses = data.courses;
```
