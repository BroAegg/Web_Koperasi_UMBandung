# 📚 Coding Standards & Guidelines

## 🎯 Core Principles

1. **Type Safety First** - No `any`, no `@ts-nocheck`, no `@ts-ignore`
2. **Validate Everything** - Use Zod for all API inputs
3. **Consistent Naming** - Follow conventions strictly
4. **Proper Migrations** - Never use `prisma db push` in production
5. **Error Handling** - Always handle errors properly
6. **Test Your Code** - Write tests for critical functionality

---

## 📝 Naming Conventions

### Database (Prisma Schema)

```prisma
// ✅ CORRECT: snake_case
model User {
  id         String   @id @default(cuid())
  email      String   @unique
  created_at DateTime @default(now())
  member_id  String?
}

// ❌ WRONG: camelCase in database
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  createdAt DateTime @default(now())
  memberId  String?
}
```

### TypeScript Code

```typescript
// ✅ CORRECT: camelCase for variables, functions
const userName = "John Doe";
const isActive = true;

function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// ✅ CORRECT: PascalCase for types, interfaces, components
interface UserProfile {
  id: string;
  email: string;
}

export default function DashboardPage() {
  return <div>Dashboard</div>;
}

// ❌ WRONG: Inconsistent naming
const user_name = "John Doe";  // Should be camelCase
function GetUserById() { }      // Should be camelCase
```

### File Names

```
✅ CORRECT:
- components: PascalCase - `UserProfile.tsx`, `PaymentModal.tsx`
- utils: kebab-case - `format-currency.ts`, `date-helpers.ts`
- pages: kebab-case - `financial-management/page.tsx`

❌ WRONG:
- user_profile.tsx (should be PascalCase)
- FormatCurrency.ts (should be kebab-case)
```

---

## 🛡️ Type Safety Rules

### 1. No `any` Type

```typescript
// ❌ WRONG
function processData(data: any) {
  return data.value
}

// ✅ CORRECT
function processData(data: { value: string }) {
  return data.value
}

// ✅ CORRECT: Use generics if flexible type needed
function processData<T extends { value: unknown }>(data: T) {
  return data.value
}
```

### 2. No `@ts-nocheck` or `@ts-ignore`

```typescript
// ❌ WRONG
// @ts-nocheck
export default function Component() {
  const value = someFunction() // Untyped
}

// ✅ CORRECT: Fix the types
export default function Component() {
  const value: string = someFunction()
}
```

### 3. Proper Zod Validation

```typescript
// ✅ CORRECT: Define Zod schema
import { z } from 'zod'

export const createTransactionSchema = z.object({
  type: z.enum(['PEMASUKAN', 'PENGELUARAN']),
  amount: z.number().positive(),
  description: z.string().min(1),
  category: z.string().min(1),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>

// Use in tRPC
createTransaction: protectedProcedure.input(createTransactionSchema).mutation(async ({ input }) => {
  // input is fully typed!
})
```

---

## 🔒 Database Best Practices

### 1. Use Migrations (NOT `db push`)

```bash
# ❌ WRONG: In production or when working with team
npx prisma db push

# ✅ CORRECT: Create proper migrations
npx prisma migrate dev --name add_supplier_email
npx prisma migrate deploy  # For production
```

### 2. Consistent Field Naming

```prisma
// ✅ CORRECT: snake_case in schema
model Product {
  id             String   @id @default(cuid())
  business_name  String   // Maps to businessName in TypeScript
  created_at     DateTime @default(now())

  @@map("products")  // Table name in database
}

// ❌ WRONG: Mixed naming
model Product {
  id            String   @id @default(cuid())
  businessName  String   // Should be snake_case
  createdAt     DateTime
}
```

### 3. Define Enums in Schema

```prisma
// ✅ CORRECT: Enum in schema
enum Role {
  SUPER_ADMIN
  KOPERASI
  KASIR
  ANGGOTA
}

model User {
  role Role @default(ANGGOTA)
}

// ❌ WRONG: Hardcoded strings
model User {
  role String @default("ANGGOTA")  // No type safety!
}
```

---

## ⚠️ Error Handling

### 1. tRPC Error Handling

```typescript
// ✅ CORRECT: Use TRPCError with proper codes
import { TRPCError } from '@trpc/server'

createTransaction: protectedProcedure
  .input(createTransactionSchema)
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    })

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })
    }

    if (user.role !== 'KOPERASI') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only Koperasi can create transactions',
      })
    }

    try {
      return await ctx.db.financialTransaction.create({
        data: input,
      })
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create transaction',
        cause: error,
      })
    }
  })
```

### 2. Frontend Error Handling

```typescript
// ✅ CORRECT: Handle mutation errors
const { mutate, isLoading, error } = api.financial.createTransaction.useMutation({
  onSuccess: () => {
    toast({
      title: 'Success',
      description: 'Transaction created successfully',
    })
  },
  onError: (error) => {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    })
  },
})

// ❌ WRONG: No error handling
const { mutate } = api.financial.createTransaction.useMutation()
mutate(data) // What if it fails?
```

---

## 🎨 Component Best Practices

### 1. Use Server Components by Default

```typescript
// ✅ CORRECT: Server Component (default)
export default async function DashboardPage() {
  const stats = await getStats();  // Fetch on server

  return <DashboardStats stats={stats} />;
}

// ✅ CORRECT: Client Component (only when needed)
"use client";

export default function InteractiveChart({ data }: Props) {
  const [filter, setFilter] = useState("daily");

  return <Chart data={data} filter={filter} />;
}
```

### 2. Proper Component Structure

```typescript
// ✅ CORRECT: Clear separation of concerns
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
}

export function PaymentModal({ isOpen, onClose, amount }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");

  const { mutate, isLoading } = api.pos.processPayment.useMutation({
    onSuccess: () => {
      toast({ title: "Payment successful" });
      onClose();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Modal content */}
    </Dialog>
  );
}
```

---

## 📊 Performance Guidelines

### 1. Debounce Search Inputs

```typescript
// ✅ CORRECT: Debounced search
const debouncedSearch = useDebounce(searchTerm, 300)

const { data } = api.products.search.useQuery(
  { query: debouncedSearch },
  { enabled: debouncedSearch.length > 0 }
)

// ❌ WRONG: No debounce - API called on every keystroke
const { data } = api.products.search.useQuery({ query: searchTerm })
```

### 2. Optimize Database Queries

```typescript
// ✅ CORRECT: Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
})

// ❌ WRONG: Select everything
const users = await prisma.user.findMany() // Returns all fields
```

---

## 🧪 Testing Standards

### 1. Unit Tests for Utilities

```typescript
// format-currency.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency } from './format-currency'

describe('formatCurrency', () => {
  it('should format Indonesian Rupiah correctly', () => {
    expect(formatCurrency(50000)).toBe('Rp 50.000')
  })

  it('should handle decimal values', () => {
    expect(formatCurrency(50000.75)).toBe('Rp 50.000,75')
  })
})
```

### 2. E2E Tests for Critical Flows

```typescript
// login.spec.ts
import { test, expect } from '@playwright/test'

test('should login as Koperasi', async ({ page }) => {
  await page.goto('/login')

  await page.fill('input[name="email"]', 'koperasi@umb.ac.id')
  await page.fill('input[name="password"]', 'koperasi123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('/koperasi')
  await expect(page.locator('text=Dashboard')).toBeVisible()
})
```

---

## ✅ Code Review Checklist

Before submitting PR, check:

- [ ] No `any`, `@ts-nocheck`, or `@ts-ignore`
- [ ] All API inputs validated with Zod
- [ ] Database uses snake_case, code uses camelCase
- [ ] Used migrations (not `db push`)
- [ ] Error handling implemented
- [ ] Tests written for new functionality
- [ ] Components follow Server/Client pattern
- [ ] Performance optimizations applied (debounce, memoization)
- [ ] Accessibility considered (ARIA labels, keyboard nav)
- [ ] Dark mode works correctly

---

## 📚 References

- [TypeScript Best Practices](https://typescript-tv.com/best-practices)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [tRPC Documentation](https://trpc.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Enforce these standards strictly!** 💪

Good code today = Less bugs tomorrow.
