# 🚀 Getting Started - Web Koperasi UMB

## Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **pnpm**

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd Web_Koperasi_UMBandung

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Setup database
npx prisma generate
npx prisma migrate dev

# 5. Seed initial data
npx prisma db seed

# 6. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

| Role        | Email                | Password    |
| ----------- | -------------------- | ----------- |
| Super Admin | superadmin@umb.ac.id | admin123    |
| Koperasi    | koperasi@umb.ac.id   | koperasi123 |
| Kasir       | kasir@umb.ac.id      | kasir123    |
| Anggota     | anggota@umb.ac.id    | anggota123  |

⚠️ **Important**: Change these credentials in production!

## Project Structure

```
Web_Koperasi_UMBandung/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and helpers
│   ├── hooks/           # Custom React hooks
│   ├── server/          # tRPC server & Prisma client
│   └── styles/          # Global styles
├── prisma/              # Database schema & migrations
├── public/              # Static assets
└── tests/               # E2E and unit tests
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests with Playwright
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
```

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Backend**: tRPC v11, Prisma ORM, PostgreSQL
- **Auth**: NextAuth.js v5
- **UI Components**: shadcn/ui + Custom components
- **State Management**: Zustand + TanStack Query (via tRPC)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Type Safety**: TypeScript + Zod validation

## Need Help?

- 📖 Read the [Architecture Guide](./ARCHITECTURE.md)
- 🗄️ Check [Database Schema](./DATABASE.md)
- 🔌 See [API Reference](./API-REFERENCE.md)
- 🐛 Found a bug? Check [Troubleshooting](./TROUBLESHOOTING.md)

---

**Built with ❤️ for Koperasi Universitas Muhammadiyah Bandung**
