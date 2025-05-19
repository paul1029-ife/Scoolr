# Scoolr 🎓

Scoolr is an open source modern school management system built with **Next.js**, **Supabase**, and **Clerk** for authentication. It streamlines administration, class management, and user access control in educational institutions — from student records to teacher dashboards.

## 🚀 Features

- 🔐 Authentication & User Management (powered by Clerk)
- 🏫 Role-based Dashboards (Students, Teachers, Admins)
- 📚 Course & Subject Management
- 📅 Timetable & Scheduling Support
- 📝 Assignment and Grading System
- 📊 Analytics & Reporting (Attendance, Performance)
- 📦 Backend powered by Supabase (PostgreSQL + Auth + Storage)
- ⚡ Built with Next.js App Router and API Routes

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Clerk](https://clerk.dev/)
- Tailwind CSS for styling
- React Hook Form + Zod for validation
- Shadcn UI for components
- Tanstack query for global state manangement

## 📂 Project Structure

```
scoolr/
├── app/                # Next.js app directory
│   ├── dashboard/      # Role-based dashboard pages
│   ├── auth/           # Auth pages (login/signup)
│   └── api/            # API routes (Supabase + custom logic)
├── components/         # Shared UI components
├── lib/                # Supabase and Clerk clients
├── types/              # TypeScript types
├── utils/              # Helper functions
├── styles/             # Global styles
├── middleware.ts       # Clerk auth middleware
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/scoolr.git
cd scoolr
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file and fill in the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see it in action.

## 🧪 Testing

Basic testing can be done through the UI. You can also write integration and unit tests using Jest or Vitest (not yet included).

## 📌 Roadmap

- [ ] Notification system for events & announcements
- [ ] Mobile-responsive improvements
- [ ] Parent/Guardian Portal (development)
- [ ] Offline support with PWA (development)

## 🧑‍💻 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss your ideas.


---

Built with ❤️ by Ifeoluwa Agbogun
