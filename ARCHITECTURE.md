# 🏗️ Architecture Guide

## System Overview

Web Koperasi UMB is built with modern, type-safe architecture following best practices for scalability, maintainability, and developer experience.

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│           Frontend (Next.js 15)             │
│  ┌──────────────────────────────────────┐   │
│  │  App Router Pages (/app)             │   │
│  │  - Role-based layouts                │   │
│  │  - Server & Client Components        │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  UI Components                       │   │
│  │  - shadcn/ui base components         │   │
│  │  - Custom business components        │   │
│  │  - Dark mode ready (CSS variables)   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↕ tRPC
┌─────────────────────────────────────────────┐
│           Backend (tRPC + Prisma)           │
│  ┌──────────────────────────────────────┐   │
│  │  tRPC Routers                        │   │
│  │  - Input validation (Zod)            │   │
│  │  - Authentication middleware         │   │
│  │  - Role-based permissions            │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  Prisma ORM                          │   │
│  │  - Type-safe database queries        │   │
│  │  - Migration management              │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│         PostgreSQL Database                 │
└─────────────────────────────────────────────┘
```

## Design Principles

### 1. Type Safety First

- **TypeScript everywhere**: Zero `@ts-nocheck` or `any` types
- **Zod schemas**: Validate all API inputs
- **Prisma types**: End-to-end type safety from DB to UI

### 2. Separation of Concerns

- **tRPC routers**: Business logic and data access
- **React components**: Pure presentation logic
- **Hooks**: Reusable stateful logic

### 3. Dark Mode Ready

- CSS variables for theming
- `next-themes` for system preference detection
- All components support light/dark mode

### 4. Progressive Enhancement

- Server Components by default
- Client Components only when needed (interactivity)
- Optimistic updates for better UX

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (roles)/           # Role-based pages
│   │   ├── koperasi/
│   │   ├── kasir/
│   │   └── anggota/
│   ├── api/               # API routes & tRPC handler
│   └── layout.tsx         # Root layout
│
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── shared/            # Shared business components
│   └── layout/            # Layout components
│
├── server/
│   ├── api/               # tRPC routers
│   │   ├── routers/       # Feature routers
│   │   ├── root.ts        # Root router
│   │   └── trpc.ts        # tRPC setup
│   └── db.ts              # Prisma client
│
├── lib/
│   ├── utils.ts           # Utility functions
│   ├── constants.ts       # App constants
│   └── validations/       # Zod schemas
│
├── hooks/
│   ├── use-toast.ts       # Toast notifications
│   ├── use-debounce.ts    # Performance hooks
│   └── use-accessibility.ts
│
└── styles/
    └── globals.css        # Global styles + CSS variables
```

## Data Flow

### 1. User Action → tRPC Mutation

```typescript
// Frontend
const { mutate } = api.financial.createTransaction.useMutation()

mutate({
  amount: 50000,
  type: 'PEMASUKAN',
  description: 'Penjualan produk',
})
```

### 2. tRPC Router → Validation → Database

```typescript
// Backend
createTransaction: protectedProcedure
  .input(createTransactionSchema) // Zod validation
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.transaction.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    })
  })
```

### 3. Response → Optimistic Update → UI

```typescript
// Frontend with optimistic update
mutate(data, {
  onMutate: async (newTransaction) => {
    // Optimistically update UI
    await utils.financial.getTransactions.cancel()
    const previous = utils.financial.getTransactions.getData()

    utils.financial.getTransactions.setData(undefined, (old) => [newTransaction, ...(old ?? [])])

    return { previous }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    utils.financial.getTransactions.setData(undefined, context?.previous)
  },
})
```

## Authentication Flow

```
1. User enters credentials
   ↓
2. NextAuth.js validates with Prisma
   ↓
3. JWT token generated & stored in HTTP-only cookie
   ↓
4. tRPC context includes session data
   ↓
5. Protected routes check session.user.role
   ↓
6. Permission middleware validates access
```

## Performance Optimizations

1. **Server Components**: Reduce client bundle size
2. **React.lazy**: Code-splitting for heavy components
3. **Virtual scrolling**: Handle large tables efficiently
4. **Image optimization**: `next/image` with proper sizing
5. **Debounced search**: Reduce API calls (300ms delay)
6. **TanStack Query caching**: Automatic data caching via tRPC

## Testing Strategy

```
┌─────────────────────────────────────────┐
│  E2E Tests (Playwright)                 │
│  - Critical user flows                  │
│  - Multi-role scenarios                 │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Integration Tests (Vitest)             │
│  - API routes                           │
│  - Database operations                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Unit Tests (Vitest + Testing Library)  │
│  - Utilities                            │
│  - Components                           │
│  - Validations                          │
└─────────────────────────────────────────┘
```

## Security Considerations

- ✅ HTTP-only cookies for session management
- ✅ CSRF protection built into NextAuth.js
- ✅ Input validation with Zod on all API routes
- ✅ Role-based access control (RBAC)
- ✅ SQL injection prevention via Prisma ORM
- ✅ XSS protection via React's built-in escaping

## Deployment Architecture

```
┌──────────────────────────────────────┐
│  Vercel (Frontend + API)             │
│  - Edge network                      │
│  - Automatic HTTPS                   │
│  - Zero-downtime deployments         │
└──────────────────────────────────────┘
            ↓
┌──────────────────────────────────────┐
│  Railway / Supabase (PostgreSQL)     │
│  - Managed database                  │
│  - Automatic backups                 │
│  - Connection pooling                │
└──────────────────────────────────────┘
```

---

**For implementation details, see:**

- [Database Schema](./DATABASE.md)
- [API Reference](./API-REFERENCE.md)
- [Testing Guide](./TESTING.md)
