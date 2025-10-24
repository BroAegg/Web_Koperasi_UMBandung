# 📡 API Reference

> Complete tRPC API documentation for Web Koperasi UM Bandung

---

## 🔧 tRPC Configuration

**Base URL**: `/api/trpc`  
**Protocol**: HTTP/HTTPS  
**Serialization**: SuperJSON (supports Date, Map, Set, BigInt, etc.)  
**Authentication**: JWT via httpOnly cookies

### Client Setup

```typescript
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { type AppRouter } from '@/server/api/root'
import superjson from 'superjson'

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
    }),
  ],
})
```

---

## 🔐 Authentication

### Procedures

All API routes use one of these procedure types:

- **`publicProcedure`** - No authentication required
- **`protectedProcedure`** - Requires authenticated user
- **`adminProcedure`** - Requires ADMIN or SUPER_ADMIN role
- **`superAdminProcedure`** - Requires SUPER_ADMIN role only
- **`developerProcedure`** - Requires DEVELOPER role
- **`requirePermission(permission)`** - Requires specific permission

### Error Codes

| Code                    | Description              |
| ----------------------- | ------------------------ |
| `UNAUTHORIZED`          | Not authenticated        |
| `FORBIDDEN`             | Insufficient permissions |
| `NOT_FOUND`             | Resource not found       |
| `BAD_REQUEST`           | Invalid input            |
| `INTERNAL_SERVER_ERROR` | Server error             |

---

## 💰 Financial Router

### `getDailySummary`

Get daily financial summary (income, expense, balance).

**Type**: `protectedProcedure`  
**Input**: None  
**Output**:

```typescript
{
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
}
```

**Example**:

```typescript
const summary = await trpc.financial.getDailySummary.query()
// { totalIncome: 5000000, totalExpense: 2000000, balance: 3000000, ... }
```

---

### `getTransactions`

Get paginated transaction list with filters.

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  page?: number          // Default: 1
  limit?: number         // Default: 10
  type?: 'INCOME' | 'EXPENSE'
  category?: string
  search?: string
  startDate?: Date
  endDate?: Date
}
```

**Output**:

```typescript
{
  transactions: Array<{
    id: string
    type: 'INCOME' | 'EXPENSE'
    category: string
    amount: number
    description: string
    createdAt: Date
    user: { fullName: string }
  }>
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

**Example**:

```typescript
const { transactions, pagination } = await trpc.financial.getTransactions.query({
  page: 1,
  limit: 20,
  type: 'INCOME',
  startDate: new Date('2025-10-01'),
})
```

---

### `getChartData`

Get chart data for financial visualization.

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  period: 'day' | 'week' | 'month'
  startDate?: Date
  endDate?: Date
}
```

**Output**:

```typescript
{
  labels: string[]       // ['Oct 1', 'Oct 2', ...]
  income: number[]       // [100000, 150000, ...]
  expense: number[]      // [50000, 75000, ...]
}
```

---

### `createTransaction`

Create a new financial transaction.

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  type: 'INCOME' | 'EXPENSE'
  category: string
  amount: number
  description?: string
  date?: Date           // Default: now
}
```

**Output**: Created transaction object

**Example**:

```typescript
const transaction = await trpc.financial.createTransaction.mutate({
  type: 'INCOME',
  category: 'Penjualan',
  amount: 500000,
  description: 'Penjualan produk tanggal 25 Oktober',
})
```

---

### `updateTransaction`

Update existing transaction.

**Type**: `protectedProcedure`  
**Input**: Same as create + `id: string`  
**Output**: Updated transaction object

---

### `deleteTransaction`

Soft delete a transaction.

**Type**: `protectedProcedure`  
**Input**: `{ id: string }`  
**Output**: Deleted transaction object

---

## 🛒 POS Router

### `getProducts`

Get products for POS (active only).

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  page?: number
  limit?: number
  search?: string
  category_id?: string
}
```

**Output**:

```typescript
{
  products: Array<{
    id: string
    sku: string
    name: string
    selling_price: number
    stock: number
    category: { name: string }
    supplier: { business_name: string }
  }>
  pagination: { ... }
}
```

---

### `createOrder`

Create POS order (checkout).

**Type**: `protectedProcedure` (KASIR role minimum)  
**Input**:

```typescript
{
  customer_name?: string
  items: Array<{
    product_id: string
    quantity: number
    price: number      // Selling price at time of sale
  }>
  payment_method: 'CASH' | 'TRANSFER' | 'EWALLET'
  payment_amount: number
  discount?: number   // Default: 0
  tax?: number        // Default: 0
}
```

**Output**:

```typescript
{
  id: string
  order_code: string  // e.g., "ORD-2025-001"
  total_amount: number
  grand_total: number
  payment_method: string
  change_amount: number
  status: 'COMPLETED' | 'CANCELLED'
  items: Array<{ ... }>
}
```

**Validation**:

- ✅ Checks product stock availability
- ✅ Validates payment amount ≥ grand total
- ✅ Creates order in transaction (rollback on error)
- ✅ Updates product stock
- ✅ Logs activity

---

### `getOrders`

Get order history with pagination.

**Type**: `protectedProcedure`  
**Input**: Standard pagination + `status`, `startDate`, `endDate`, `search`  
**Output**: Paginated orders list

---

### `getOrder`

Get single order details.

**Type**: `protectedProcedure`  
**Input**: `{ id: string }`  
**Output**: Order with items and product details

---

### `cancelOrder`

Cancel an order (ADMIN only).

**Type**: `protectedProcedure` (requires ADMIN)  
**Input**:

```typescript
{
  id: string
  reason: string
}
```

**Output**: Cancelled order object

**Validation**:

- ✅ Only ADMIN/SUPER_ADMIN can cancel
- ✅ Can only cancel COMPLETED orders
- ✅ Restores product stock
- ✅ Logs cancellation activity

---

### `getSalesStats`

Get sales statistics.

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  period: 'today' | 'week' | 'month' | 'year'
}
```

**Output**:

```typescript
{
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topProducts: Array<{
    product_id: string
    product_name: string
    quantity_sold: number
    revenue: number
  }>
}
```

---

## 📦 Inventory Router

### `getProducts`

Get all products with relations.

**Type**: `protectedProcedure`  
**Input**: Standard pagination + `search`, `category_id`, `supplier_id`, `is_active`  
**Output**: Paginated products with category and supplier

---

### `getProduct`

Get single product details.

**Type**: `protectedProcedure`  
**Input**: `{ id: string }`  
**Output**: Product with full relations and stock movements

---

### `createProduct`

Create new product.

**Type**: `protectedProcedure` (requires ADMIN)  
**Input**:

```typescript
{
  sku: string           // Unique SKU
  name: string
  description?: string
  category_id: string
  supplier_id: string
  unit: string          // 'pcs', 'box', 'kg', etc.
  buying_price: number
  selling_price: number
  stock: number
  min_stock: number     // For low stock alerts
  is_active?: boolean   // Default: true
}
```

**Output**: Created product object

**Validation**:

- ✅ SKU must be unique
- ✅ Selling price ≥ buying price
- ✅ Stock ≥ 0
- ✅ Logs creation activity

---

### `updateProduct`

Update product.

**Type**: `protectedProcedure` (requires ADMIN)  
**Input**: Same as create + `id: string`  
**Output**: Updated product

**Note**: Stock updates should use `recordStockMovement` instead.

---

### `deleteProduct`

Soft delete product.

**Type**: `protectedProcedure` (requires ADMIN)  
**Input**: `{ id: string }`  
**Output**: Deleted product

---

### `recordStockMovement`

Record stock movement (in/out/adjustment).

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  product_id: string
  type: 'IN' | 'OUT' | 'ADJUSTMENT'
  quantity: number
  reason: string
  reference_code?: string  // e.g., PO number
}
```

**Output**: Stock movement record

**Validation**:

- ✅ Updates product stock
- ✅ Prevents negative stock for OUT
- ✅ Logs activity

---

### `getLowStockAlerts`

Get products below minimum stock.

**Type**: `protectedProcedure`  
**Input**: None  
**Output**:

```typescript
Array<{
  id: string
  name: string
  sku: string
  stock: number
  min_stock: number
  category: { name: string }
}>
```

---

### `getInventoryStats`

Get inventory statistics.

**Type**: `protectedProcedure`  
**Input**: None  
**Output**:

```typescript
{
  totalProducts: number
  activeProducts: number
  totalValue: number // Sum of (stock × buying_price)
  lowStockCount: number
}
```

---

## 🏢 Supplier Router

### `getSuppliers`

Get all suppliers.

**Type**: `protectedProcedure`  
**Input**: Standard pagination + `search`, `is_active`  
**Output**: Paginated suppliers with product count

---

### `getSupplier`

Get single supplier details.

**Type**: `protectedProcedure`  
**Input**: `{ id: string }`  
**Output**: Supplier with products list

---

### `createSupplier`

Create new supplier.

**Type**: `protectedProcedure` (requires ADMIN)  
**Input**:

```typescript
{
  business_name: string  // Must be unique
  contact_person: string
  phone: string
  email?: string
  address?: string
  is_active?: boolean    // Default: true
}
```

**Output**: Created supplier

**Validation**:

- ✅ Business name must be unique
- ✅ Phone number format validation
- ✅ Logs activity

---

### `updateSupplier`

Update supplier.

**Type**: `protectedProcedure` (requires ADMIN)  
**Input**: Same as create + `id: string`  
**Output**: Updated supplier

---

### `deleteSupplier`

Soft delete supplier.

**Type**: `protectedProcedure` (requires ADMIN)  
**Input**: `{ id: string }`  
**Output**: Deleted supplier

**Validation**:

- ✅ Cannot delete if supplier has active products

---

### `getSupplierStats`

Get supplier statistics.

**Type**: `protectedProcedure`  
**Input**: None  
**Output**:

```typescript
{
  totalSuppliers: number
  activeSuppliers: number
  topSuppliers: Array<{
    id: string
    business_name: string
    product_count: number
  }>
}
```

---

## 👥 Member Router

### `getMembers`

Get all members.

**Type**: `protectedProcedure`  
**Input**: Standard pagination + `search`  
**Output**: Paginated members with balance

---

### `getMember`

Get single member details.

**Type**: `protectedProcedure`  
**Input**: `{ id: string }`  
**Output**: Member with transaction history

---

### `recordDeposit`

Record member deposit (setoran).

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  member_id: string
  amount: number
  description?: string
}
```

**Output**: Deposit transaction

---

### `recordWithdrawal`

Record member withdrawal (penarikan).

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  member_id: string
  amount: number
  description?: string
}
```

**Output**: Withdrawal transaction

**Validation**:

- ✅ Cannot withdraw more than balance
- ✅ Logs activity

---

### `getMemberTransactions`

Get member transaction history.

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  member_id: string
  page?: number
  limit?: number
  type?: 'DEPOSIT' | 'WITHDRAWAL'
}
```

**Output**: Paginated transactions

---

### `getMemberStats`

Get member statistics.

**Type**: `protectedProcedure`  
**Input**: None  
**Output**:

```typescript
{
  totalMembers: number
  totalDeposits: number
  totalWithdrawals: number
  totalBalance: number
}
```

---

## 📋 Activity Log Router

### `getActivityLogs`

Get activity logs with filters.

**Type**: `developerProcedure` (DEVELOPER only)  
**Input**:

```typescript
{
  page?: number
  limit?: number
  module?: 'PRODUCT' | 'SUPPLIER' | 'MEMBER' | 'TRANSACTION' | 'ORDER'
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
  role?: Role
  user_id?: string
  startDate?: Date
  endDate?: Date
}
```

**Output**:

```typescript
{
  logs: Array<{
    id: string
    user: { fullName: string, role: string }
    action: string
    module: string
    description: string
    createdAt: Date
  }>
  pagination: { ... }
}
```

---

### `getActivityStats`

Get activity statistics.

**Type**: `developerProcedure`  
**Input**: None  
**Output**:

```typescript
{
  totalLogs: number
  byAction: Record<string, number>
  byModule: Record<string, number>
  byRole: Record<string, number>
}
```

---

## 📊 Report Router

### `getDashboardReport`

Get comprehensive dashboard data.

**Type**: `protectedProcedure`  
**Input**:

```typescript
{
  period?: 'day' | 'week' | 'month' | 'year'  // Default: 'day'
}
```

**Output**:

```typescript
{
  financial: {
    totalIncome: number
    totalExpense: number
    balance: number
  }
  sales: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
  }
  inventory: {
    totalProducts: number
    totalValue: number
    lowStockCount: number
  }
  members: {
    totalMembers: number
    totalBalance: number
  }
  charts: {
    revenue: { labels: string[], data: number[] }
    expense: { labels: string[], data: number[] }
  }
}
```

---

## 🔒 Permission System

### Available Permissions

```typescript
enum Permission {
  // Financial
  FINANCIAL_VIEW = 'financial:view',
  FINANCIAL_CREATE = 'financial:create',
  FINANCIAL_UPDATE = 'financial:update',
  FINANCIAL_DELETE = 'financial:delete',

  // Inventory
  INVENTORY_VIEW = 'inventory:view',
  INVENTORY_MANAGE = 'inventory:manage',

  // POS
  POS_ACCESS = 'pos:access',
  POS_CANCEL_ORDER = 'pos:cancel',

  // Reports
  REPORTS_VIEW = 'reports:view',
  REPORTS_EXPORT = 'reports:export',

  // Activity Logs
  LOGS_VIEW = 'logs:view',
}
```

### Role Permissions

| Role            | Permissions                                |
| --------------- | ------------------------------------------ |
| **SUPER_ADMIN** | All permissions                            |
| **ADMIN**       | All except activity logs                   |
| **KASIR**       | POS access, view inventory, view financial |
| **STAFF**       | View only (inventory, financial)           |
| **DEVELOPER**   | Activity logs, system settings             |

---

## 🚀 Rate Limiting

**Default**: 100 requests per 15 minutes per IP

For higher limits, contact system administrator.

---

## 📝 Change Log

### Version 1.0 (October 2025)

- Initial API release
- 40+ tRPC procedures
- Full CRUD for all modules
- Role-based access control
- Activity logging

---

## 🤝 Support

For API questions or issues:

- GitHub Issues: [Create Issue](https://github.com/BroAegg/Web_Koperasi_UMBandung/issues)
- Email: ti@umb.ac.id

---

**Built with tRPC v11 for type-safety and developer experience ✨**

_Last Updated: October 25, 2025_
