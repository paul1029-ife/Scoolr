# Scoolr 🎓

Scoolr is an open source school operating system for Nigerian secondary
schools. It covers the day-to-day running of a school — enrolment and
attendance, staff, subjects, guardians, events and fees — in one place, on
one set of records.

Built with **Next.js 16**, **Prisma** and **Neon Postgres**, with **Neon Auth**
for sign-in.

## 🚀 Features

- 🏫 **Multi-school.** Every record is scoped to a school, so several can share
  one deployment. A new account registers its own school and becomes its admin.
- 🧭 **Guided onboarding.** School profile, academic session and terms, classes
  and arms, grading scale and streams — the dashboard stays blocked until a
  school has enough set up to be usable.
- 🎓 **Students, classes and attendance.** JSS 1–SSS 3 with arms, per-class
  registers, and attendance rates derived from the records rather than stored.
- 👩‍🏫 **Teachers and subjects.** Staff records, subject assignments, and
  per-subject class and teacher allocation.
- 👪 **Guardians.** Parents and guardians as their own records, linked to
  students by relationship.
- 💳 **Billing.** Termly fee structures per class, invoices, payments, and
  collection and outstanding figures. Money is handled in integer kobo.
- 📅 **Events.** School calendar with attendees and materials.
- 🔐 **Roles and invitations.** Role-based permissions enforced in every server
  action, a staff screen for changing roles, and email invitations via Resend.
- 📥 **CSV import.** Students, teachers, parents & guardians, subjects, and
  classes & arms — with downloadable templates, per-row validation, duplicate
  detection and a preview before anything is written.

## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router, server actions, Turbopack)
- [React 19](https://react.dev/) + TypeScript
- [Prisma 7](https://www.prisma.io/) with the `@prisma/adapter-pg` driver adapter
- [Neon](https://neon.com/) Postgres
- [Neon Auth](https://neon.com/docs/neon-auth/overview) (managed Better Auth)
- [Tailwind CSS](https://tailwindcss.com/) with shadcn/Radix primitives
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Recharts](https://recharts.org/) for dashboard charts
- [Resend](https://resend.com/) for transactional email

## 📂 Project Structure

```
scoolr/
├── app/
│   ├── dashboard/      # The application itself, one folder per module
│   ├── onboarding/     # Blocking setup wizard for a new school
│   ├── login, signup, start, invite/   # Auth and school registration
│   ├── api/auth/       # Neon Auth route handler
│   └── page.tsx        # Marketing landing page
├── components/
│   ├── ui/             # shadcn primitives (button, table, dialog, …)
│   ├── common/         # Page header, metrics, form drawer
│   └── auth/           # Sign-in/up forms, permissions provider
├── lib/
│   ├── actions/        # Server actions — the authorisation boundary
│   ├── queries/        # Read paths, scoped by school
│   ├── auth/           # Neon Auth client/server, permissions
│   ├── import/         # CSV definitions, parsing and analysis
│   ├── email/          # Resend templates
│   ├── prisma.ts       # Lazy Prisma singleton
│   └── tenant.ts       # Resolves the signed-in user and their school
├── prisma/             # Schema, migrations and seed
├── context/, hooks/, providers/, types/
├── proxy.ts            # Route guard (Next 16 renamed middleware → proxy)
└── README.md
```

## ⚙️ Getting Started

### 1. Clone and install

```bash
git clone https://github.com/paul1029-ife/Scoolr.git
cd Scoolr
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill it in. You need a Neon project with
Neon Auth enabled:

```bash
cp .env.example .env
```

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string (host contains `-pooler`) |
| `DIRECT_DATABASE_URL` | Neon **direct** string — migrations need it, as the pooler cannot take advisory locks |
| `NEON_AUTH_BASE_URL` | The project's auth endpoint |
| `NEON_AUTH_COOKIE_SECRET` | Signs session cookies, at least 32 characters |
| `RESEND_API_KEY` | Optional. Without it invitations are still created, but the link must be shared manually |
| `EMAIL_FROM` | Sender address on a domain verified in Resend |

### 3. Create the schema

```bash
npm run db:migrate
```

Optionally seed a school with the JSS 1–SSS 3 classes:

```bash
npm run db:seed
```

Set `SCOOLR_SEED_DEMO_DATA=true` first if you also want a sample roster of
fictional teachers, students, attendance and payments. Leave it unset for a
real school.

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`, create an account, and you will be taken
through registering your school and onboarding it.

### Deploying

Set the same environment variables on the host, plus
`NEXT_PUBLIC_APP_URL` so invitation links resolve, and run
`npm run db:deploy` against the direct connection string.

Neon Auth rejects requests from origins it does not know, so add the
deployed hostname — including `www.` if you serve it — as a trusted domain:

```bash
npx neonctl neon-auth domain add https://your-domain.com --project-id <project-id>
```

## 🧪 Testing

There are no automated tests yet. Billing arithmetic, the CSV import engine
and school-scoping in queries are the areas most worth covering first.

## 📌 Roadmap

- [ ] Assignments and grading against the configured grading scale
- [ ] Timetabling
- [ ] Parent and student portals — both roles exist but have no dashboard yet
- [ ] Notifications for events and announcements
- [ ] Automated test coverage

## 🧑‍💻 Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss your ideas.

---

Built with ❤️ by Ifeoluwa Agbogun
