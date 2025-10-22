# Web Koperasi UM Bandung 🏪

**Modern Cooperative Management System** - Sistem Informasi Manajemen Koperasi berbasis web untuk UM Bandung

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748)](https://www.prisma.io/)
[![tRPC](https://img.shields.io/badge/tRPC-11.x-398CCB)](https://trpc.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-316192)](https://www.postgresql.org/)

## 🚀 Fitur Utama

### 💰 **Manajemen Keuangan**

- Pencatatan transaksi masuk/keluar dengan kategori lengkap
- Visualisasi grafik keuangan interaktif (Recharts)
- Filter berdasarkan periode (hari, minggu, bulan)
- Export data ke CSV
- Ringkasan saldo harian real-time

### 🛒 **Point of Sale (POS)**

- Pencarian produk real-time
- Keranjang belanja interaktif
- Proses pembayaran lengkap (tunai, transfer, e-wallet)
- Cetak struk pembelian
- Riwayat penjualan
- Statistik penjualan (revenue, AOV, top products)

### 📦 **Manajemen Inventori**

- CRUD produk lengkap
- Manajemen stok (masuk/keluar/penyesuaian)
- Peringatan stok menipis otomatis
- Kategori dan supplier produk
- Nilai total inventori
- Stock movement tracking

### 🏢 **Manajemen Supplier**

- CRUD data supplier
- Tracking produk per supplier
- Top supplier ranking
- Informasi kontak lengkap

### 👥 **Simpanan Anggota**

- Pencatatan setoran anggota
- Pencatatan penarikan
- Riwayat transaksi lengkap
- Saldo simpanan real-time

### 📋 **Activity Logging**

- Log semua aktivitas pengguna
- Filter berdasarkan modul dan aksi
- Tracking perubahan data
- Audit trail lengkap

### 📊 **Reporting & Analytics**

- Dashboard komprehensif
- Laporan keuangan
- Laporan penjualan
- Laporan inventori
- Laporan simpanan anggota
- Filter berdasarkan periode custom

## 🛠️ Tech Stack

### Frontend

- Next.js 16.0 (App Router)
- React 19.2
- Tailwind CSS 4
- shadcn/ui
- Recharts
- TypeScript (strict mode)

### Backend

- tRPC 11.x (Type-safe API)
- PostgreSQL 17
- Prisma ORM 6.17.1
- Zod (validation)
- Custom JWT Auth (jose)

### Development

- ESLint + Prettier
- Husky + lint-staged
- Vitest (unit tests)
- Playwright (E2E tests)

## 📦 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm/yarn/pnpm
- Git

## 🔧 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/BroAegg/Web_Koperasi_UMBandung.git
cd Web_Koperasi_UMBandung
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Buat file `.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/web_koperasi_umb?schema=public"
JWT_SECRET="your-secret-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate JWT Secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Setup Database

```bash
# Create database
createdb web_koperasi_umb

# Run migrations
npx prisma migrate dev

# Seed data (optional)
npx prisma db seed

# Generate Prisma Client
npx prisma generate
```

**Default Users After Seed:**

- Admin: `admin` / `admin123`
- Kasir: `kasir` / `kasir123`

### 5. Run Development Server

```bash
npm run dev
```

Buka `http://localhost:3000`

## 📁 Struktur Proyek

```
src/
├── app/
│   ├── (auth)/              # Login, Register
│   ├── (roles)/koperasi/    # Dashboard & Features
│   │   ├── financial/       # 💰 Keuangan
│   │   ├── pos/             # 🛒 Point of Sale
│   │   ├── inventory/       # 📦 Inventori
│   │   ├── suppliers/       # 🏢 Supplier
│   │   ├── members/         # 👥 Anggota
│   │   ├── activity/        # 📋 Activity Log
│   │   └── reports/         # 📊 Laporan
│   └── api/trpc/            # tRPC endpoint
├── components/
│   ├── ui/                  # shadcn/ui
│   └── features/            # Feature components
├── lib/
│   ├── auth.ts              # JWT utilities
│   ├── db.ts                # Prisma client
│   └── trpc.ts              # tRPC client
├── server/
│   ├── routers/             # tRPC routers
│   ├── context.ts           # Request context
│   └── index.ts             # Main router
└── types/                   # TypeScript types
```

## 🔐 Authentication

Custom JWT dengan httpOnly cookies (7 hari expire). Semua route di `/koperasi/*` dilindungi middleware.

**Roles:**

- SUPER_ADMIN - Full access
- ADMIN - Management
- KASIR - POS & Financial
- DEVELOPER - System

## 📚 API Documentation

### Financial Module

- `financial.getDailySummary` - Saldo & ringkasan
- `financial.getTransactions` - List transaksi
- `financial.getChartData` - Data grafik
- `financial.createTransaction` - Buat transaksi
- `financial.updateTransaction` - Update transaksi
- `financial.deleteTransaction` - Hapus transaksi

### POS Module

- `pos.getProducts` - Cari produk
- `pos.createOrder` - Checkout order
- `pos.getOrders` - Riwayat penjualan
- `pos.getSalesStats` - Statistik
- `pos.cancelOrder` - Cancel order

### Inventory Module

- `inventory.getProducts` - List produk
- `inventory.createProduct` - Buat produk
- `inventory.updateProduct` - Update produk
- `inventory.deleteProduct` - Hapus produk
- `inventory.recordStockMovement` - Mutasi stok
- `inventory.getLowStockAlerts` - Alert stok

### Supplier Module

- `supplier.getSuppliers` - List supplier
- `supplier.createSupplier` - Buat supplier
- `supplier.updateSupplier` - Update supplier
- `supplier.deleteSupplier` - Hapus supplier
- `supplier.getSupplierStats` - Statistik

### Member Module

- `member.recordDeposit` - Setoran
- `member.recordWithdrawal` - Penarikan
- `member.getMemberTransactions` - Riwayat
- `member.getMemberStats` - Statistik

### Activity Module

- `activity.getActivityLogs` - Log aktivitas
- `activity.getActivityStats` - Statistik

### Report Module

- `report.getDashboardReport` - Dashboard lengkap

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Import di Vercel
3. Set environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

Setup PostgreSQL di server dan jalankan migrations:

```bash
npx prisma migrate deploy
```

## 🎨 Code Quality

- **Auto-format**: Prettier on commit
- **Auto-lint**: ESLint on commit
- **Git hooks**: Husky + lint-staged
- **Type-safe**: Full TypeScript coverage

## 📊 Database Schema

9 Models:

- User
- Transaction
- Order & OrderItem
- Product
- Category
- Supplier
- StockMovement
- ActivityLog

Semua dengan soft deletes (`deleted_at`), timestamps, dan proper relations.

## 🤝 Contributing

1. Fork repo
2. Create branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Private & Proprietary. All rights reserved.

## 👨‍💻 Team

- **Developer**: [@BroAegg](https://github.com/BroAegg)
- **Organization**: UM Bandung

## 📞 Support

- Email: support@umbandung.ac.id
- GitHub Issues: [Create Issue](https://github.com/BroAegg/Web_Koperasi_UMBandung/issues)

---

**Built with ❤️ for UM Bandung Cooperative**

🌟 Star this repo if you find it helpful!
