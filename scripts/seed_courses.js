/* eslint-disable no-console */
import fs from 'node:fs'

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'))
}

function writeJson(path, obj) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + '\n', 'utf8')
}

function normalizeLesson(l, idx) {
  return {
    id: l.id || `l${idx + 1}`,
    title: l.title || l.title_en || l.title_ar || `Lesson ${idx + 1}`,
    title_ar: l.title_ar || l.title || '',
    title_en: l.title_en || l.title || '',
    duration: l.duration || '4:00',
    description_ar: l.description_ar || '',
    description_en: l.description_en || '',
    videoUrl: l.videoUrl || ''
  }
}

function isValidCourse(c) {
  const lessons = Array.isArray(c.lessons) ? c.lessons : []
  if (!lessons.length) return false
  for (const l of lessons) {
    const hasTitle = String(l.title || l.title_en || l.title_ar || '').trim().length > 0
    const hasVideo = String(l.videoUrl || '').trim().length > 0
    if (!hasTitle || !hasVideo) return false
  }
  return true
}

function newCourses() {
  const mp4 = 'https://www.w3schools.com/html/mov_bbb.mp4'

  return [
    {
      id: 'c11',
      title: 'Animals Explorer',
      title_ar: 'عالم الحيوانات',
      title_en: 'Animals Explorer',
      category: 'English',
      price: 0,
      thumbnail: '/assets/images/topcourses3.png',
      heroImage: '/assets/images/topcourses3.png',
      overviewImage: '/assets/images/topcourses3.png',
      description: 'Learn animals and sounds',
      description_ar: 'نتعلم أسماء الحيوانات وأصواتها',
      description_en: 'Learn animal names and sounds',
      overview_ar: 'كورس ممتع لتعلّم أسماء الحيوانات الشائعة وأصواتها من خلال صور وأنشطة بسيطة تساعد الطفل على الحفظ والتذكر.',
      overview_en: 'A fun course to learn common animal names and sounds using pictures and simple activities.',
      age: '3-5',
      grade: 'Grade 1-3',
      seats: 20,
      status: 'published',
      tags: ['Games', 'Stories'],
      lessons: [
        {
          id: 'l1',
          title: 'Farm Animals',
          title_ar: 'حيوانات المزرعة',
          title_en: 'Farm Animals',
          duration: '4:10',
          description_ar: 'تعرّف على الحيوانات اللي بنشوفها في المزرعة وأسماءها.',
          description_en: 'Meet the animals you see on a farm and learn their names.',
          videoUrl: mp4
        },
        {
          id: 'l2',
          title: 'Wild Animals',
          title_ar: 'حيوانات الغابة',
          title_en: 'Wild Animals',
          duration: '4:45',
          description_ar: 'نستكشف حيوانات الغابة ونميّز بينها بالصور.',
          description_en: 'Explore wild animals and recognize them by pictures.',
          videoUrl: mp4
        },
        {
          id: 'l3',
          title: 'Animal Sounds',
          title_ar: 'أصوات الحيوانات',
          title_en: 'Animal Sounds',
          duration: '5:05',
          description_ar: 'نربط اسم الحيوان بصوته ونلعب لعبة تخمين بسيطة.',
          description_en: 'Match animal names to sounds with a simple guessing game.',
          videoUrl: mp4
        }
      ]
    },
    {
      id: 'c12',
      title: 'Colors & Art',
      title_ar: 'الألوان والرسم',
      title_en: 'Colors & Art',
      category: 'English',
      price: 19,
      thumbnail: '/assets/images/Home-Feature.png',
      heroImage: '/assets/images/Home-Feature.png',
      overviewImage: '/assets/images/Home-Feature.png',
      description: 'Colors, mixing, and fun drawing',
      description_ar: 'الألوان، المزج، ورسومات ممتعة',
      description_en: 'Colors, mixing, and fun drawing',
      overview_ar: 'هنتعلم الألوان الأساسية وهنجرب مزج الألوان بأنشطة بسيطة، مع أفكار رسم سهلة للأطفال.',
      overview_en: 'Learn basic colors, try simple color mixing, and enjoy easy drawing ideas for kids.',
      age: '3-5',
      grade: 'Grade 1-3',
      seats: 18,
      status: 'published',
      tags: ['Games', 'Music'],
      lessons: [
        {
          id: 'l1',
          title: 'Primary Colors',
          title_ar: 'الألوان الأساسية',
          title_en: 'Primary Colors',
          duration: '3:50',
          description_ar: 'أحمر، أزرق، أصفر… ونتعلم أمثلة من حولنا.',
          description_en: 'Red, blue, yellow… with real-life examples.',
          videoUrl: mp4
        },
        {
          id: 'l2',
          title: 'Color Mixing',
          title_ar: 'مزج الألوان',
          title_en: 'Color Mixing',
          duration: '4:30',
          description_ar: 'نجرب نخلط لونين ونشوف النتيجة بطريقة ممتعة.',
          description_en: 'Mix two colors and see the result in a fun way.',
          videoUrl: mp4
        },
        {
          id: 'l3',
          title: 'Draw a Rainbow',
          title_ar: 'ارسم قوس قزح',
          title_en: 'Draw a Rainbow',
          duration: '5:00',
          description_ar: 'خطوات بسيطة لرسم قوس قزح وتلوينه.',
          description_en: 'Simple steps to draw and color a rainbow.',
          videoUrl: mp4
        }
      ]
    },
    {
      id: 'c13',
      title: 'Shapes Adventure',
      title_ar: 'مغامرة الأشكال',
      title_en: 'Shapes Adventure',
      category: 'Math',
      price: 0,
      thumbnail: '/assets/images/OBJECTS.png',
      heroImage: '/assets/images/OBJECTS.png',
      overviewImage: '/assets/images/OBJECTS.png',
      description: 'Learn shapes with fun activities',
      description_ar: 'نتعلم الأشكال بأنشطة ممتعة',
      description_en: 'Learn shapes with fun activities',
      overview_ar: 'كورس بسيط لتعلّم الأشكال الأساسية (دائرة/مربع/مثلث/مستطيل) مع ألعاب مطابقة وأنشطة فرز.',
      overview_en: 'A simple course to learn basic shapes (circle/square/triangle/rectangle) with matching and sorting activities.',
      age: '3-5',
      grade: 'Grade 1-3',
      seats: 18,
      status: 'published',
      tags: ['Puzzles', 'Games'],
      lessons: [
        {
          id: 'l1',
          title: 'Circle & Square',
          title_ar: 'الدائرة والمربع',
          title_en: 'Circle & Square',
          duration: '3:30',
          description_ar: 'نتعرّف على الدائرة والمربع ونشوف أمثلة في البيت.',
          description_en: 'Meet the circle and square with everyday examples.',
          videoUrl: mp4
        },
        {
          id: 'l2',
          title: 'Triangle & Rectangle',
          title_ar: 'المثلث والمستطيل',
          title_en: 'Triangle & Rectangle',
          duration: '4:10',
          description_ar: 'تمييز المثلث والمستطيل مع لعبة اختيار الشكل الصحيح.',
          description_en: 'Spot triangles and rectangles with a pick-the-right-shape game.',
          videoUrl: mp4
        },
        {
          id: 'l3',
          title: 'Shape Matching Game',
          title_ar: 'لعبة مطابقة الأشكال',
          title_en: 'Shape Matching Game',
          duration: '5:10',
          description_ar: 'مطابقة الأشكال بالصور وتقوية الانتباه.',
          description_en: 'Match shapes by pictures and boost attention.',
          videoUrl: mp4
        }
      ]
    },
    {
      id: 'c14',
      title: 'Arabic Letters - Level 2',
      title_ar: 'الحروف العربية - المستوى 2',
      title_en: 'Arabic Letters - Level 2',
      category: 'Arabic',
      price: 25,
      thumbnail: '/assets/images/topcourses1.png',
      heroImage: '/assets/images/topcourses1.png',
      overviewImage: '/assets/images/topcourses1.png',
      description: 'More letters and simple words',
      description_ar: 'حروف أكثر وكلمات بسيطة',
      description_en: 'More letters and simple words',
      overview_ar: 'تكملة ممتعة لتعلّم الحروف مع تدريب على التمييز والنطق وبناء كلمات قصيرة.',
      overview_en: 'A fun continuation to learn more Arabic letters, practice pronunciation, and build short words.',
      age: '5-7',
      grade: 'Grade 1-3',
      seats: 14,
      status: 'published',
      tags: ['Spell', 'Games'],
      lessons: [
        {
          id: 'l1',
          title: 'الحروف 3',
          title_ar: 'الحروف 3',
          title_en: 'Letters 3',
          duration: '4:15',
          description_ar: 'نتعلم مجموعة جديدة من الحروف مع أمثلة مصورة.',
          description_en: 'Learn a new set of letters with visual examples.',
          videoUrl: mp4
        },
        {
          id: 'l2',
          title: 'الحروف 4',
          title_ar: 'الحروف 4',
          title_en: 'Letters 4',
          duration: '4:25',
          description_ar: 'استكمال الحروف مع تدريب نطق سريع.',
          description_en: 'Continue letters with quick pronunciation practice.',
          videoUrl: mp4
        },
        {
          id: 'l3',
          title: 'كلمات وجُمل قصيرة',
          title_ar: 'كلمات وجُمل قصيرة',
          title_en: 'Short Words & Sentences',
          duration: '5:20',
          description_ar: 'نبني كلمات ونكوّن جمل قصيرة بسهولة.',
          description_en: 'Build words and make short sentences easily.',
          videoUrl: mp4
        }
      ]
    },
    {
      id: 'c15',
      title: 'English Phonics',
      title_ar: 'فونكس إنجليزي',
      title_en: 'English Phonics',
      category: 'English',
      price: 29,
      thumbnail: '/assets/images/topcourses2.png',
      heroImage: '/assets/images/topcourses2.png',
      overviewImage: '/assets/images/topcourses2.png',
      description: 'Sounds and blending for beginners',
      description_ar: 'الأصوات ودمج الحروف للمبتدئين',
      description_en: 'Sounds and blending for beginners',
      overview_ar: 'تعلم أصوات الحروف ودمجها لتكوين كلمات بسيطة مع تدريبات نطق قصيرة.',
      overview_en: 'Learn letter sounds and blending to form simple words with short pronunciation drills.',
      age: '5-7',
      grade: 'Grade 1-3',
      seats: 12,
      status: 'published',
      tags: ['Music', 'Games'],
      lessons: [
        {
          id: 'l1',
          title: 'Letter Sounds A–E',
          title_ar: 'أصوات الحروف A–E',
          title_en: 'Letter Sounds A–E',
          duration: '4:05',
          description_ar: 'نسمع الصوت ونقلده بطريقة ممتعة.',
          description_en: 'Hear the sound and repeat it in a fun way.',
          videoUrl: mp4
        },
        {
          id: 'l2',
          title: 'Blending Sounds',
          title_ar: 'دمج الأصوات',
          title_en: 'Blending Sounds',
          duration: '4:40',
          description_ar: 'نجمع الأصوات ونكوّن كلمات قصيرة.',
          description_en: 'Blend sounds to make short words.',
          videoUrl: mp4
        },
        {
          id: 'l3',
          title: 'Sight Words',
          title_ar: 'كلمات شائعة',
          title_en: 'Sight Words',
          duration: '5:10',
          description_ar: 'نتعلم كلمات سهلة ومتكررة للأطفال.',
          description_en: 'Learn easy, common words for kids.',
          videoUrl: mp4
        }
      ]
    },
    {
      id: 'c16',
      title: 'Math Basics (Kids)',
      title_ar: 'أساسيات الرياضيات للأطفال',
      title_en: 'Math Basics (Kids)',
      category: 'Math',
      price: 29,
      thumbnail: '/assets/images/math.png',
      heroImage: '/assets/images/math.png',
      overviewImage: '/assets/images/math.png',
      description: 'Counting, comparing, and simple problems',
      description_ar: 'العدّ، المقارنة، ومسائل بسيطة',
      description_en: 'Counting, comparing, and simple problems',
      overview_ar: 'كورس يثبت الأساسيات: العدّ، الأكبر/الأصغر، ومسائل بسيطة من الحياة اليومية.',
      overview_en: 'Build strong foundations: counting, greater/less, and simple real-life word problems.',
      age: '5-7',
      grade: 'Grade 1-3',
      seats: 16,
      status: 'published',
      tags: ['Count', 'Puzzles'],
      lessons: [
        {
          id: 'l1',
          title: 'Compare Numbers',
          title_ar: 'مقارنة الأرقام',
          title_en: 'Compare Numbers',
          duration: '4:20',
          description_ar: 'أكبر من/أصغر من/يساوي مع أمثلة سهلة.',
          description_en: 'Greater than / less than / equal with simple examples.',
          videoUrl: mp4
        },
        {
          id: 'l2',
          title: 'Number Patterns',
          title_ar: 'أنماط الأرقام',
          title_en: 'Number Patterns',
          duration: '4:55',
          description_ar: 'نكتشف الأنماط ونكمل التسلسل.',
          description_en: 'Spot patterns and complete the sequence.',
          videoUrl: mp4
        },
        {
          id: 'l3',
          title: 'Simple Word Problems',
          title_ar: 'مسائل كلامية بسيطة',
          title_en: 'Simple Word Problems',
          duration: '5:30',
          description_ar: 'مسائل قصيرة من الحياة اليومية تساعد على الفهم.',
          description_en: 'Short real-life problems that build understanding.',
          videoUrl: mp4
        }
      ]
    },
    {
      id: 'c17',
      title: 'English Vocabulary (Everyday)',
      title_ar: 'مفردات إنجليزية يومية',
      title_en: 'English Vocabulary (Everyday)',
      category: 'English',
      price: 25,
      thumbnail: '/assets/images/OurTopCourses.png',
      heroImage: '/assets/images/OurTopCourses.png',
      overviewImage: '/assets/images/OurTopCourses.png',
      description: 'Daily words with pictures',
      description_ar: 'كلمات يومية بالصور',
      description_en: 'Daily words with pictures',
      overview_ar: 'مفردات يومية (البيت/المدرسة/الطعام) مع صور وتمارين خفيفة لتثبيت الكلمات.',
      overview_en: 'Everyday vocabulary (home/school/food) with pictures and light practice to remember words.',
      age: '4-6',
      grade: 'Grade 1-3',
      seats: 14,
      status: 'published',
      tags: ['Games', 'Stories'],
      lessons: [
        {
          id: 'l1',
          title: 'At Home',
          title_ar: 'في البيت',
          title_en: 'At Home',
          duration: '4:10',
          description_ar: 'نتعلم كلمات عن أشياء موجودة في البيت.',
          description_en: 'Learn words for common things at home.',
          videoUrl: mp4
        },
        {
          id: 'l2',
          title: 'At School',
          title_ar: 'في المدرسة',
          title_en: 'At School',
          duration: '4:35',
          description_ar: 'مفردات المدرسة والأدوات بطريقة بسيطة.',
          description_en: 'Simple school vocabulary and objects.',
          videoUrl: mp4
        },
        {
          id: 'l3',
          title: 'Food & Drinks',
          title_ar: 'الأكل والشرب',
          title_en: 'Food & Drinks',
          duration: '5:00',
          description_ar: 'أسماء أطعمة ومشروبات يحبها الأطفال.',
          description_en: 'Names of food and drinks kids love.',
          videoUrl: mp4
        }
      ]
    },
    {
      id: 'c18',
      title: 'Arabic Reading (Starter)',
      title_ar: 'قراءة عربية (مبتدئين)',
      title_en: 'Arabic Reading (Starter)',
      category: 'Arabic',
      price: 0,
      thumbnail: '/assets/images/topcourses1.png',
      heroImage: '/assets/images/topcourses1.png',
      overviewImage: '/assets/images/topcourses1.png',
      description: 'Simple reading with short words',
      description_ar: 'قراءة بسيطة بكلمات قصيرة',
      description_en: 'Simple reading with short words',
      overview_ar: 'نبدأ القراءة بكلمات قصيرة وصوتيات سهلة تساعد الطفل على الثقة في القراءة خطوة بخطوة.',
      overview_en: 'Start reading with short words and easy phonics that build confidence step by step.',
      age: '5-7',
      grade: 'Grade 1-3',
      seats: 18,
      status: 'published',
      tags: ['Stories', 'Spell'],
      lessons: [
        {
          id: 'l1',
          title: 'حروف وكلمات',
          title_ar: 'حروف وكلمات',
          title_en: 'Letters & Words',
          duration: '4:20',
          description_ar: 'نربط الحرف بكلمة قصيرة وصورة.',
          description_en: 'Match letters with short words and pictures.',
          videoUrl: mp4
        },
        {
          id: 'l2',
          title: 'تشكيل بسيط',
          title_ar: 'تشكيل بسيط',
          title_en: 'Basic Harakat',
          duration: '4:55',
          description_ar: 'فتحة/ضمة/كسرة مع أمثلة سهلة.',
          description_en: 'Fatha/Damma/Kasra with easy examples.',
          videoUrl: mp4
        },
        {
          id: 'l3',
          title: 'جُمل قصيرة',
          title_ar: 'جُمل قصيرة',
          title_en: 'Short Sentences',
          duration: '5:15',
          description_ar: 'نقرأ جمل قصيرة ونفهم معناها.',
          description_en: 'Read short sentences and understand their meaning.',
          videoUrl: mp4
        }
      ]
    }
  ]
}

function upsertCourses(list, additions) {
  const map = new Map()
  for (const c of list) map.set(String(c.id), c)
  for (const c of additions) map.set(String(c.id), c)
  return Array.from(map.values())
}

function main() {
  const dbPath = 'db.json'
  const dataPath = 'src/data/courses.json'

  const db = readJson(dbPath)
  const beforeCourses = Array.isArray(db.courses) ? db.courses : []

  const removed = beforeCourses
    .filter((c) => !isValidCourse(c))
    .map((c) => String(c.id))

  // Clean invalid courses
  let nextCourses = beforeCourses.filter((c) => isValidCourse(c))

  // Add new courses (all valid)
  nextCourses = upsertCourses(nextCourses, newCourses().map((c) => ({
    ...c,
    lessons: (c.lessons || []).map(normalizeLesson)
  })))

  // Sort by numeric id if possible, else by string
  nextCourses.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }))

  // Clean related collections referencing removed courseIds
  const removedSet = new Set(removed)
  if (removedSet.size) {
    if (Array.isArray(db.subscriptions)) {
      db.subscriptions = db.subscriptions.filter((s) => !removedSet.has(String(s.courseId)))
    }
    if (Array.isArray(db.exams)) {
      db.exams = db.exams.filter((e) => !removedSet.has(String(e.courseId)))
    }
    if (Array.isArray(db.results)) {
      db.results = db.results.filter((r) => !removedSet.has(String(r.courseId)))
    }
  }

  db.courses = nextCourses
  writeJson(dbPath, db)

  // Keep src/data/courses.json in sync (courses only)
  if (fs.existsSync(dataPath)) {
    const data = readJson(dataPath)
    data.courses = nextCourses
    writeJson(dataPath, data)
  }

  console.log('[seed] Removed invalid courses:', removed)
  console.log('[seed] Total courses now:', nextCourses.length)
}

main()


