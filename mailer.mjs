import nodemailer from 'nodemailer'

// Load a local .env file if present (Node 20.12+). Real environment variables
// set on the hosting dashboard always win over the file.
try { process.loadEnvFile?.() } catch { /* no .env file - that's fine on hosting */ }

export function getMailConfig(env = process.env) {
  return {
    resendKey: (env.RESEND_API_KEY || '').trim(),
    resendFrom: (env.RESEND_FROM || 'Portfolio Inquiry <onboarding@resend.dev>').trim(),
    host: (env.SMTP_HOST || 'smtp.gmail.com').trim(),
    port: Number(env.SMTP_PORT || 465),
    user: (env.SMTP_USER || '').trim(),
    // Google shows app passwords as "abcd efgh ijkl mnop" - spaces must be removed.
    pass: (env.SMTP_APP_PASSWORD || '').replace(/\s+/g, ''),
    to: (env.INQUIRY_TO || 'ta480105@gmail.com').trim()
  }
}

export const smtpConfigured = cfg => Boolean(cfg.user && cfg.pass)
export const resendConfigured = cfg => Boolean(cfg.resendKey)
export const mailConfigured = cfg => Boolean(cfg.to && (resendConfigured(cfg) || smtpConfigured(cfg)))
export const mailProvider = cfg => resendConfigured(cfg) ? 'resend' : smtpConfigured(cfg) ? 'smtp' : 'none'

export function describeError(error) {
  if (!error) return 'Unknown error'
  const parts = [error.code, error.responseCode, error.command, error.message].filter(Boolean)
  return parts.join(' | ')
}

export function hintForError(error) {
  const text = describeError(error)
  if (/EAUTH|535|534|Username and Password not accepted|Invalid login|BadCredentials/i.test(text)) {
    return 'Gmail rejected the login. Create a NEW Google App Password (2-Step Verification must be ON), paste the 16 letters into SMTP_APP_PASSWORD, and make sure SMTP_USER is the same Gmail account that created it.'
  }
  if (/ETIMEDOUT|ECONNECTION|ESOCKET|ECONNREFUSED|ENETUNREACH|EHOSTUNREACH|ENOTFOUND|Greeting never received|Connection timeout/i.test(text)) {
    return 'The server could not reach Gmail. Many hosts (e.g. Render free tier) block SMTP ports. Fix: set RESEND_API_KEY (free at resend.com) - it sends over HTTPS and is not blocked.'
  }
  if (/Resend \(401|Resend \(403|API key/i.test(text)) {
    return 'Resend rejected the request. Check RESEND_API_KEY. With the default onboarding@resend.dev sender, INQUIRY_TO must be the same email you signed up to Resend with.'
  }
  if (/Resend \(422/i.test(text)) {
    return 'Resend rejected the email content/sender. If you use your own RESEND_FROM, the domain must be verified in Resend.'
  }
  return 'See the message above. Run "npm run test:email" locally for a step-by-step check.'
}

function buildMessage(data) {
  const text = [
    'New website project inquiry', '',
    `Name: ${data.name}`,
    `Business: ${data.business || 'Not provided'}`,
    `Client email: ${data.email}`,
    `WhatsApp: ${data.phone || 'Not provided'}`,
    `Service: ${data.service || 'Not specified'}`,
    `Budget: ${data.budget || 'Not sure yet'}`,
    '', 'Project details:', data.message
  ].join('\n')
  const subject = `Portfolio inquiry: ${data.service || 'Website project'} - ${data.name}`.replace(/[\r\n]+/g, ' ')
  return { text, subject }
}

async function sendViaResend(cfg, data) {
  const { text, subject } = buildMessage(data)
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: cfg.resendFrom, to: [cfg.to], reply_to: data.email, subject, text }),
    signal: AbortSignal.timeout(15_000)
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Resend (${response.status}): ${body.slice(0, 300)}`)
  }
}

async function sendViaSmtp(cfg, data) {
  const { text, subject } = buildMessage(data)
  // Try the configured port first; if the connection itself fails, try the other Gmail port.
  const ports = [cfg.port]
  const alt = cfg.port === 465 ? 587 : cfg.port === 587 ? 465 : null
  if (alt) ports.push(alt)

  let lastError
  for (const port of ports) {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: cfg.user, pass: cfg.pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000
    })
    try {
      await transporter.sendMail({
        from: `Portfolio Inquiry <${cfg.user}>`,
        to: cfg.to,
        replyTo: data.email,
        subject,
        text
      })
      return
    } catch (error) {
      lastError = error
      console.error(`SMTP attempt on port ${port} failed:`, describeError(error))
      // Wrong password will fail on every port - no point retrying.
      if (error && (error.code === 'EAUTH' || error.responseCode === 535)) break
    } finally {
      transporter.close()
    }
  }
  throw lastError
}

export async function sendInquiryMail(cfg, data) {
  if (resendConfigured(cfg)) {
    try {
      return await sendViaResend(cfg, data)
    } catch (error) {
      console.error('Resend failed:', describeError(error))
      if (!smtpConfigured(cfg)) throw error
    }
  }
  return sendViaSmtp(cfg, data)
}
