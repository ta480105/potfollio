import { getMailConfig, mailConfigured, mailProvider, sendInquiryMail, describeError, hintForError } from '../mailer.mjs'

const cfg = getMailConfig()
console.log('Email provider  :', mailProvider(cfg))
console.log('Send to         :', cfg.to)
console.log('SMTP host/port  :', `${cfg.host}:${cfg.port}`)
console.log('SMTP user       :', cfg.user || '(missing)')
console.log('App password    :', cfg.pass ? `${cfg.pass.length} characters (Google app passwords have 16)` : '(missing)')
console.log('Resend API key  :', cfg.resendKey ? 'set' : '(not set)')
console.log('')

if (!mailConfigured(cfg)) {
  console.error('Email is NOT configured. Copy .env.example to .env and fill SMTP_USER + SMTP_APP_PASSWORD (or RESEND_API_KEY).')
  process.exit(1)
}

try {
  await sendInquiryMail(cfg, {
    name: 'Test Inquiry', business: 'Test', email: cfg.to, phone: '', service: 'test',
    budget: '', message: 'If you can read this, your portfolio inquiry email works.'
  })
  console.log(`SUCCESS - test email sent to ${cfg.to}. Check Inbox and Spam.`)
} catch (error) {
  console.error('FAILED:', describeError(error))
  console.error('\nWhat to do:', hintForError(error))
  process.exit(1)
}
