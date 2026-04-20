# Edwin Fom — Journal

A personal editorial blog and developer journal. Built with Next.js 15, Tailwind CSS v4, Drizzle ORM, BetterAuth, and DeepSeek AI.

![Hero](public/screenshots/hero.png)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Drizzle ORM |
| Auth | BetterAuth — magic link email only |
| Email | Resend |
| AI | DeepSeek (reading companion + article meta generation) |
| i18n | next-intl — FR (primary) / EN |
| Deploy | Vercel |

---

## Features

**Public site**
- Editorial masthead with newspaper-style header
- Featured hero article with typographic figure
- Latest articles grid — 4-up with stagger animations
- Projects list with status indicators
- Full article reading view — TOC, reading progress bar, code blocks
- Comment system — public posting, moderated by Edwin
- ⌘K command palette — search articles and projects
- AI reading companion (⌘J) — powered by DeepSeek, context-aware per article
- 3 themes × 2 modes (sanguine, noir, swiss — light/dark)
- Fully responsive — mobile-first

**Dashboard** (private, magic link auth)
- Article editor — Markdown with live preview, FR/EN tabs
- Auto-generated TOC and tags via DeepSeek on publish
- Comment moderation — approve / delete
- Project CRUD — full editor with modal
- Site settings — bio, tagline, links, stack, colophon, masthead config

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Resend](https://resend.com) account
- A [DeepSeek](https://platform.deepseek.com) API key (optional — AI features degrade gracefully)

### Installation

```bash
git clone https://github.com/edwinfom/blog.git
cd blog
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in:

```env
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=        # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3001

# Email (magic link)
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev   # use your domain once configured

# AI
DEEPSEEK_API_KEY=sk-...
```

### Database setup

```bash
npm run db:generate   # generate migrations
npm run db:migrate    # apply to Neon
npm run db:seed       # seed sample articles + projects
npm run db:seed-auth  # create Edwin's admin account
```

### Development

```bash
npm run dev           # http://localhost:3001
```

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Public site (FR/EN)
│   │   ├── page.tsx        # Home
│   │   ├── journal/        # Article list + reading view
│   │   ├── projets/        # Projects page
│   │   └── a-propos/       # About page
│   ├── dashboard/          # Protected dashboard
│   │   ├── articles/       # Article editor
│   │   ├── comments/       # Comment moderation
│   │   ├── projects/       # Project CRUD
│   │   └── settings/       # Site settings
│   ├── api/
│   │   ├── auth/           # BetterAuth handler
│   │   ├── ai/             # DeepSeek proxy
│   │   ├── comments/       # Public comment API
│   │   ├── search/         # CmdK search data
│   │   └── dashboard/      # Protected CRUD APIs
│   └── login/              # Magic link login page
├── components/
│   ├── home/               # Masthead, Hero, LatestSection, ProjectsSection
│   ├── article/            # ArticleBody, TOC, CodeBlock, Comments
│   ├── layout/             # Nav, Footer
│   ├── shared/             # CmdK, Rule, StaggerReveal
│   ├── ai/                 # AICompanion, AIContext, AIArticleSync
│   └── theme/              # ThemeProvider
├── db/
│   ├── schema.ts           # Drizzle schema
│   ├── queries.ts          # Data access layer
│   └── seed.ts             # Sample data
├── lib/
│   ├── auth.ts             # BetterAuth config
│   ├── auth-client.ts      # BetterAuth client
│   ├── settings.ts         # Site settings helpers
│   └── ai-article.ts       # DeepSeek meta generation
├── hooks/
│   └── useConfirm.tsx      # Confirm dialog hook
├── i18n/                   # next-intl routing + config
└── messages/               # FR + EN translation files
```

---

## Dashboard access

Navigate to `/login`, enter your email, and click the magic link sent to your inbox. Only the account created via `npm run db:seed-auth` can sign in (`disableSignUp: true`).

---

## Scripts

```bash
npm run dev           # Development server
npm run build         # Production build
npm run db:generate   # Generate Drizzle migrations
npm run db:migrate    # Apply migrations
npm run db:studio     # Open Drizzle Studio
npm run db:seed       # Seed articles + projects
npm run db:seed-auth  # Create admin account
```

---

## License

MIT — Edwin Fom
