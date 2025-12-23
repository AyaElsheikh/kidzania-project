import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

function openaiChatProxyPlugin() {
  return {
    name: 'openai-chat-proxy',
    configureServer(server) {
      async function readJson(req) {
        return await new Promise((resolve, reject) => {
          let data = ''
          req.on('data', (chunk) => { data += chunk })
          req.on('end', () => {
            try {
              resolve(data ? JSON.parse(data) : {})
            } catch (e) {
              reject(e)
            }
          })
          req.on('error', reject)
        })
      }

      function send(res, status, body, contentType = 'application/json') {
        res.statusCode = status
        res.setHeader('Content-Type', contentType)
        res.end(contentType === 'application/json' ? JSON.stringify(body) : body)
      }

      // Debug endpoint (safe): lets you verify `.env` is loaded server-side.
      // Visit: http://localhost:5173/api/ai-health
      server.middlewares.use('/api/ai-health', (req, res) => {
        if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' })
        return send(res, 200, {
          ok: true,
          hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
          hasModel: Boolean(process.env.OPENAI_MODEL),
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
        })
      })

      server.middlewares.use('/api/ai-chat', async (req, res) => {
        if (req.method !== 'POST') {
          return send(res, 405, { error: 'Method not allowed' })
        }

        const apiKey = process.env.OPENAI_API_KEY
        if (!apiKey) {
          return send(res, 500, {
            error: 'Missing OPENAI_API_KEY. Create a local .env file and set OPENAI_API_KEY.'
          })
        }

        try {
          const body = await readJson(req)
          const locale = body?.locale === 'ar' ? 'ar' : 'en'
          const incoming = Array.isArray(body?.messages) ? body.messages : []

          const safeMessages = incoming
            .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .slice(-12)
            .map((m) => ({ role: m.role, content: m.content.slice(0, 1200) }))

          const system = locale === 'ar'
            ? 'أنت مساعد تعليمي لطيف للأطفال. اجعل إجاباتك قصيرة وواضحة ومشجعة. لا تذكر سياسات أو محتوى غير مناسب. إذا كان السؤال خطيرًا أو غير مناسب للأطفال، ارفض بلطف واقترح بديلًا آمنًا.'
            : 'You are a friendly learning assistant for kids. Keep answers short, clear, and encouraging. Avoid inappropriate content. If the user asks something unsafe or not suitable for kids, refuse politely and suggest a safe alternative.'

          const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

          const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model,
              temperature: 0.6,
              max_tokens: 350,
              messages: [
                { role: 'system', content: system },
                ...safeMessages
              ]
            })
          })

          const json = await upstream.json().catch(() => null)
          if (!upstream.ok) {
            return send(res, upstream.status, {
              error: json?.error?.message || 'OpenAI request failed'
            })
          }

          const answer = json?.choices?.[0]?.message?.content?.toString?.() || ''
          return send(res, 200, { answer })
        } catch (e) {
          return send(res, 400, { error: 'Bad request' })
        }
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  // Ensure `.env` is loaded for server-side usage (without requiring VITE_ prefix)
  const env = loadEnv(mode, process.cwd(), '')
  process.env.OPENAI_API_KEY ??= env.OPENAI_API_KEY
  process.env.OPENAI_MODEL ??= env.OPENAI_MODEL

  return {
    plugins: [vue(), openaiChatProxyPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
