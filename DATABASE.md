# 🗄️ Database Schema

## Overview

Web Koperasi UMB menggunakan PostgreSQL dengan Prisma ORM untuk type-safe database access.

## Core Principles

1. **snake_case for database**: Semua nama kolom dan tabel menggunakan `snake_case`
2. **camelCase in code**: TypeScript models menggunakan `camelCase` (auto-mapped by Prisma)
3. **Enums in schema**: Define all enums di Prisma schema, bukan hardcoded strings
4. **Proper migrations**: NEVER use `prisma db push` in production, always use migrations
5. **Indexes**: Add indexes untuk foreign keys dan frequently queried fields

## Schema Diagram

```
┌─────────────┐
│    User     │
└─────────────┘
      │
      ├──────────────┬──────────────┬──────────────┐
      ↓              ↓              ↓              ↓
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐
│ Member  │    │Financial│    │Activity │    │ Product  │
└─────────┘    │Transaction    │  Log    │    └──────────┘
                └─────────┘    └─────────┘          │
                                                     ↓
                                               ┌──────────┐
                                               │  Stock   │
                                               │Movement  │
                                               └──────────┘
```

## Tables

### 1. User

**Purpose**: Authentication dan user management

| Field      | Type            | Description           |
| ---------- | --------------- | --------------------- |
| id         | String (CUID)   | Primary key           |
| email      | String (unique) | Login email           |
| password   | String (hashed) | Bcrypt hash           |
| name       | String          | Full name             |
| role       | Enum (Role)     | User role             |
| created_at | DateTime        | Creation timestamp    |
| updated_at | DateTime        | Last update timestamp |

**Enums**:

```prisma
enum Role {
  SUPER_ADMIN
  KOPERASI
  KASIR
  ANGGOTA
}
```

### 2. Member

**Purpose**: Data anggota koperasi

| Field       | Type                | Description                   |
| ----------- | ------------------- | ----------------------------- |
| id          | String (CUID)       | Primary key                   |
| user_id     | String (FK)         | Reference to User             |
| member_code | String (unique)     | Kode anggota (e.g., "ANT001") |
| phone       | String              | Phone number                  |
| address     | String              | Address                       |
| balance     | Decimal             | Saldo simpanan                |
| status      | Enum (MemberStatus) | ACTIVE/INACTIVE               |
| created_at  | DateTime            | Registration date             |

**Enums**:

```prisma
enum MemberStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

### 3. FinancialTransaction

**Purpose**: Track semua transaksi keuangan

| Field          | Type                   | Description                      |
| -------------- | ---------------------- | -------------------------------- |
| id             | String (CUID)          | Primary key                      |
| user_id        | String (FK)            | Who created this transaction     |
| type           | Enum (TransactionType) | PEMASUKAN/PENGELUARAN            |
| category       | String                 | e.g., "Penjualan", "Operasional" |
| amount         | Decimal                | Transaction amount               |
| description    | String                 | Transaction notes                |
| payment_method | Enum (PaymentMethod)   | CASH/TRANSFER                    |
| reference_id   | String?                | Optional reference to Order/etc  |
| created_at     | DateTime               | Transaction timestamp            |

**Enums**:

```prisma
enum TransactionType {
  PEMASUKAN
  PENGELUARAN
}

enum PaymentMethod {
  CASH
  TRANSFER
  EWALLET
}
```

### 4. Product

**Purpose**: Master data produk

| Field          | Type            | Description                   |
| -------------- | --------------- | ----------------------------- |
| id             | String (CUID)   | Primary key                   |
| sku            | String (unique) | Product SKU                   |
| name           | String          | Product name                  |
| category       | String          | Product category              |
| unit           | String          | e.g., "pcs", "kg", "liter"    |
| purchase_price | Decimal         | Harga beli                    |
| selling_price  | Decimal         | Harga jual                    |
| stock_quantity | Int             | Current stock                 |
| min_stock      | Int             | Minimum stock alert threshold |
| supplier_id    | String? (FK)    | Optional supplier reference   |
| is_active      | Boolean         | Product active status         |
| created_at     | DateTime        | Creation timestamp            |
| updated_at     | DateTime        | Last update                   |

### 5. StockMovement

**Purpose**: Track semua pergerakan stok (in/out)

| Field        | Type                     | Description                 |
| ------------ | ------------------------ | --------------------------- |
| id           | String (CUID)            | Primary key                 |
| product_id   | String (FK)              | Reference to Product        |
| user_id      | String (FK)              | Who made the movement       |
| type         | Enum (StockMovementType) | IN/OUT/ADJUSTMENT           |
| quantity     | Int                      | Quantity moved              |
| notes        | String?                  | Optional notes              |
| reference_id | String?                  | Reference to Order/Purchase |
| created_at   | DateTime                 | Movement timestamp          |

**Enums**:

```prisma
enum StockMovementType {
  IN        // Stock masuk (pembelian)
  OUT       // Stock keluar (penjualan)
  ADJUSTMENT // Adjustment (koreksi)
}
```

### 6. Order

**Purpose**: POS orders

| Field          | Type                 | Description               |
| -------------- | -------------------- | ------------------------- |
| id             | String (CUID)        | Primary key               |
| order_number   | String (unique)      | e.g., "ORD-20250123-001"  |
| cashier_id     | String (FK)          | Reference to User (KASIR) |
| member_id      | String? (FK)         | Optional member           |
| total_amount   | Decimal              | Total before discount     |
| discount       | Decimal              | Discount amount           |
| final_amount   | Decimal              | Total after discount      |
| payment_method | Enum (PaymentMethod) | Payment method            |
| payment_status | Enum (PaymentStatus) | PAID/PENDING/CANCELLED    |
| created_at     | DateTime             | Order timestamp           |

**Enums**:

```prisma
enum PaymentStatus {
  PENDING
  PAID
  CANCELLED
  REFUNDED
}
```

### 7. OrderItem

**Purpose**: Line items dalam Order

| Field      | Type          | Description            |
| ---------- | ------------- | ---------------------- |
| id         | String (CUID) | Primary key            |
| order_id   | String (FK)   | Reference to Order     |
| product_id | String (FK)   | Reference to Product   |
| quantity   | Int           | Quantity ordered       |
| unit_price | Decimal       | Price at time of order |
| subtotal   | Decimal       | quantity × unit_price  |

### 8. Supplier

**Purpose**: Data supplier

| Field          | Type                  | Description               |
| -------------- | --------------------- | ------------------------- |
| id             | String (CUID)         | Primary key               |
| business_name  | String                | Nama usaha supplier       |
| contact_person | String                | Contact person name       |
| phone          | String                | Phone number              |
| email          | String?               | Optional email            |
| address        | String                | Address                   |
| status         | Enum (SupplierStatus) | PENDING/APPROVED/REJECTED |
| created_at     | DateTime              | Registration date         |

**Enums**:

```prisma
enum SupplierStatus {
  PENDING
  APPROVED
  REJECTED
  INACTIVE
}
```

### 9. ActivityLog

**Purpose**: Audit trail untuk semua actions

| Field       | Type          | Description                    |
| ----------- | ------------- | ------------------------------ |
| id          | String (CUID) | Primary key                    |
| user_id     | String (FK)   | Who performed the action       |
| action      | String        | e.g., "CREATE_TRANSACTION"     |
| module      | String        | e.g., "FINANCIAL", "INVENTORY" |
| description | String        | Human-readable description     |
| metadata    | Json?         | Optional additional data       |
| created_at  | DateTime      | Action timestamp               |

## Indexes

```prisma
// Important indexes for performance
@@index([user_id])
@@index([created_at])
@@index([type])
@@index([status])
@@index([order_number])
@@index([member_code])
@@index([sku])
```

## Migration Workflow

### 1. Create Migration

```bash
# After modifying schema.prisma
npx prisma migrate dev --name descriptive_name

# Example:
npx prisma migrate dev --name add_supplier_email_field
```

### 2. Apply Migration (Production)

```bash
npx prisma migrate deploy
```

### 3. Reset Database (Development Only!)

```bash
npx prisma migrate reset
```

## Seeding Data

File: `prisma/seed.ts`

```typescript
// Default users
- Super Admin (superadmin@umb.ac.id)
- Koperasi Admin (koperasi@umb.ac.id)
- Kasir (kasir@umb.ac.id)
- Anggota (anggota@umb.ac.id)

// Sample products
- 10 sample products with stock

// Sample members
- 5 sample members
```

Run seed:

```bash
npx prisma db seed
```

## Common Queries

### Get transactions with user info

```typescript
const transactions = await prisma.financialTransaction.findMany({
  include: {
    user: {
      select: { name: true, role: true },
    },
  },
  orderBy: { created_at: 'desc' },
})
```

### Get products with low stock

```typescript
const lowStock = await prisma.product.findMany({
  where: {
    stock_quantity: { lte: prisma.product.fields.min_stock },
  },
})
```

### Get order with items

```typescript
const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    order_items: {
      include: { product: true },
    },
    cashier: {
      select: { name: true },
    },
  },
})
```

## Backup & Restore

### Backup

```bash
pg_dump -U postgres -d koperasi_umb > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
psql -U postgres -d koperasi_umb < backup_20250123.sql
```

---

**Related Documentation:**

- [API Reference](./API-REFERENCE.md) - See how to interact with this data
- [Getting Started](./GETTING-STARTED.md) - Setup database locally
