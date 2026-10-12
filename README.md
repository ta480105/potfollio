# Tabish — Website Developer Portfolio

Responsive React + TypeScript + Vite portfolio with a Node/Express backend for project inquiries. Inquiry emails are sent to `ta480105@gmail.com`; SMTP credentials stay on the server and are never included in the browser bundle.

## Requirements
- Node.js 20 or newer recommended
- npm

## Run locally
1. Open this project folder in VS Code.
2. Install packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the SMTP settings (see **Email setup** below).
4. Open two VS Code terminals:
   - Terminal 1: `npm run dev:server`
   - Terminal 2: `npm run dev`
5. Open the Vite URL shown in Terminal 2.

The Vite development server forwards `/api` requests to the backend on port 3001.

## Email setup
The form sends mail from the backend. Pick ONE option.

### Option A - Gmail SMTP
1. Sign in to `ta480105@gmail.com` and turn ON Google 2-Step Verification.
2. Google Account, Security, App Passwords: create a password (16 letters). Spaces don't matter - they are removed automatically.
3. Put it in `SMTP_APP_PASSWORD` (local `.env` file, or your hosting dashboard). `SMTP_USER` must be that same Gmail account.
4. The server tries port 465 first and automatically falls back to 587.

### Option B - Resend (use this if your host blocks SMTP)
1. Sign up at resend.com with `ta480105@gmail.com` and create an API key.
2. Set `RESEND_API_KEY` (starts with `re_`). Mail goes out over HTTPS, so hosting SMTP blocks don't matter.
3. With the default sender (`onboarding@resend.dev`) Resend only delivers to the email you signed up with - which is exactly what this form needs.
4. If both options are set, Resend is tried first and Gmail SMTP is the backup.

### Test it
```bash
npm run test:email
```
This prints your settings (without secrets), sends a test email, and if it fails tells you the exact reason and fix. On hosting, `/api/health` shows `emailConfigured` and `emailProvider`, and the server logs show the real error for every failed inquiry.

Never use your normal Gmail password in the app, and never commit `.env`.

## Production build and run
```bash
npm run build
npm start
```
Set these environment variables in your hosting provider's server settings: `NODE_ENV=production`, `INQUIRY_TO`, and either `SMTP_USER` + `SMTP_APP_PASSWORD` or `RESEND_API_KEY`. Restart/redeploy after changing them. The server serves the built frontend and `/api/inquiries` from the same origin. Deploy this as a Node web service, not a static-only site. The start command is `npm start` and build command is `npm install && npm run build`.

Health check: `/api/health`.

## WhatsApp contact
The WhatsApp number is intentionally blank because no number was provided. To enable the WhatsApp contact button, edit `whatsappNumber` in `src/config/site.ts` to your country code and phone number using digits only (India: `91` followed by the number). Do not add `+`, spaces, or hyphens. Email contact and form inquiries can work without this.

## Checks and limitations
- Form checks required fields, email format, and field lengths in both browser and server.
- Server returns success only after the SMTP provider accepts the message; failures are shown to the visitor.
- A basic per-IP cooldown and a honeypot are included, but this is not a complete anti-spam system for a high-traffic public site.
- This code can be build-checked locally, but actual email delivery must be tested with valid SMTP credentials in your own environment.
- Project cards are clearly marked as demo concepts. Their links are intentionally empty until real demos exist.
