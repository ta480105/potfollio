import express from 'express'
import { getMailConfig, mailConfigured, mailProvider, sendInquiryMail, describeError, hintForError } from './mailer.mjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const PORT = Number(process.env.PORT || 3001)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')
const recentRequests = new Map()

app.disable('x-powered-by')
// Behind a hosting proxy every visitor would otherwise share one IP (and one 30s cooldown).
app.set('trust proxy', 1)
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (_req, res) => {
  const cfg = getMailConfig()
  res.json({ ok: true, service: 'portfolio-inquiries', emailConfigured: mailConfigured(cfg), emailProvider: mailProvider(cfg) })
})

app.post('/api/inquiries', async (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const lastRequest = recentRequests.get(ip) || 0
  if (now - lastRequest < 30_000) {
    return res.status(429).json({ error: 'Please wait 30 seconds before sending another inquiry.' })
  }

  const { name, business = '', email, phone = '', service, budget = '', message, website = '' } = req.body || {}
  // Honeypot: silently accept automated submissions without sending email.
  if (typeof website === 'string' && website.trim()) return res.json({ ok: true })

  const clean = value => typeof value === 'string' ? value.trim() : ''
  const data = { name: clean(name), business: clean(business), email: clean(email), phone: clean(phone), service: clean(service), budget: clean(budget), message: clean(message) }
  if (!data.name || !data.email || !data.message) return res.status(400).json({ error: 'Please provide your name, a valid email address, and project details.' })
  if (data.name.length > 120 || data.business.length > 160 || data.email.length > 254 || data.phone.length > 40 || data.service.length > 100 || data.budget.length > 80 || data.message.length > 5000) {
    return res.status(400).json({ error: 'One or more fields are too long. Please shorten them and try again.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return res.status(400).json({ error: 'Please enter a valid email address.' })

  const cfg = getMailConfig()
  if (!mailConfigured(cfg)) {
    console.error('Inquiry received but email is not configured (set SMTP_USER + SMTP_APP_PASSWORD, or RESEND_API_KEY).')
    return res.status(503).json({ error: 'Email delivery is not configured yet. Please email ta480105@gmail.com directly for now.' })
  }

  try {
    await sendInquiryMail(cfg, data)
    recentRequests.set(ip, now)
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Inquiry email failed:', describeError(error))
    console.error('Hint:', hintForError(error))
    return res.status(502).json({ error: 'Email delivery failed. Please try again later or email ta480105@gmail.com directly.' })
  }
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath, { index: false, maxAge: '1h' }))
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')))
}

app.listen(PORT, () => {
  const cfg = getMailConfig()
  console.log(`Portfolio server listening on port ${PORT}`)
  console.log(`Email provider: ${mailProvider(cfg)}${mailConfigured(cfg) ? '' : ' (NOT configured - inquiries will not be delivered)'}`)
})
