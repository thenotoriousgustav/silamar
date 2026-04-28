# SiLamar — Lamar Kerja Lebih Cerdas

Platform AI-powered untuk fresh graduate Indonesia. Buat CV ATS-friendly, analisis resume, generate cover letter, dan track semua lamaran kerja dalam satu platform.

## ✨ Fitur

### Gratis
- **CV Builder** — Buat resume ATS-friendly dengan export PDF
- **Job Tracker** — Kanban board untuk track semua lamaran

### Berbayar (Kredit / Pro)
- **AI Resume Analyzer** — Skor ATS + saran perbaikan
- **Resume vs Job Description** — Match score + keyword gap
- **AI Cover Letter Generator** — Surat lamaran personal
- **Skill Gap Analysis** — Learning path yang dipersonalisasi
- **Mock Interview AI** — Pertanyaan + feedback jawaban

## 🛠 Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL via Neon + Drizzle ORM |
| Auth | Better Auth |
| Storage | Cloudflare R2 |
| AI | Google Gemini 2.0 Flash |
| Payment | Midtrans |
| Email | Resend |
| Styling | Tailwind CSS v4 |

## 🚀 Setup

### 1. Clone dan Install

```bash
git clone <repo-url>
cd silamar
pnpm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Isi semua variabel di `.env.local`:

| Variabel | Cara dapat |
|---|---|
| `DATABASE_URL` | [Neon Console](https://neon.tech) → New Project |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID/SECRET` | [Google Cloud Console](https://console.cloud.google.com) → OAuth 2.0 |
| `CLOUDFLARE_R2_*` | [Cloudflare Dashboard](https://dash.cloudflare.com) → R2 |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com) |
| `MIDTRANS_SERVER_KEY` | [Midtrans Dashboard](https://dashboard.midtrans.com) → Settings → Access Keys |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) |

### 3. Database Migration

```bash
pnpm db:generate   # Generate migration files
pnpm db:push       # Push schema to database
pnpm db:studio     # Open Drizzle Studio (optional)
```

### 4. Run Development

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📦 Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:generate  # Generate Drizzle migrations
pnpm db:push      # Push schema to DB
pnpm db:studio    # Drizzle Studio UI
```

## 📁 Struktur Folder

```
src/app/
├── (auth)/          # Login, Register
├── (dashboard)/     # Protected dashboard pages
├── (marketing)/     # Landing page
└── api/             # API routes

lib/
├── db/              # Drizzle client + schema
├── auth/            # Better Auth config
├── ai/              # Gemini AI + prompts
├── storage/         # Cloudflare R2
├── payment/         # Midtrans
├── email/           # Resend
└── utils/           # Utilities

components/
├── layout/          # Navbar, Sidebar, Footer
├── resume-builder/  # Resume editor components
├── job-tracker/     # Kanban components
├── analysis/        # AI analysis components
└── payment/         # Credit/payment modal
```

## 💳 Credit System

| Paket | Kredit | Harga |
|---|---|---|
| Starter Pack | 5 | Rp 15.000 |
| Standard Pack | 15 | Rp 35.000 |
| Pro Pack | 30 | Rp 60.000 |
| Pro Monthly | Unlimited | Rp 99.000/bln |

## 🔐 Auth Routes

- `POST /api/auth/sign-in/email` — Email sign in
- `POST /api/auth/sign-up/email` — Email sign up
- `POST /api/auth/sign-in/social` — Google OAuth
- `GET /api/auth/session` — Get current session

## 🌐 Deployment (Vercel)

1. Connect repo ke Vercel
2. Set environment variables di Vercel Dashboard
3. Set `NEXT_PUBLIC_APP_URL` ke domain produksi
4. Set `MIDTRANS_IS_PRODUCTION=true` untuk production
5. Deploy!

---

Dibuat dengan ❤️ untuk fresh graduate Indonesia 🇮🇩
