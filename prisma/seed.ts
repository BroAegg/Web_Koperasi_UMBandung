import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Enums
const Role = {
  DEVELOPER: 'DEVELOPER',
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  KASIR: 'KASIR',
  STAFF: 'STAFF',
  SUPPLIER: 'SUPPLIER',
} as const

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (in development only!)
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Clearing existing data...')
    await prisma.activityLog.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.stockMovement.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.supplier.deleteMany()
    await prisma.user.deleteMany()
  }

  // Create users
  console.log('👥 Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.create({
    data: {
      username: 'developer',
      email: 'developer@umbandung.com',
      password: hashedPassword,
      full_name: 'Developer Account',
      phone: '08123456789',
      role: Role.DEVELOPER,
    },
  })

  await prisma.user.create({
    data: {
      username: 'superadmin',
      email: 'superadmin@umbandung.com',
      password: hashedPassword,
      full_name: 'Super Administrator',
      phone: '08123456790',
      role: Role.SUPER_ADMIN,
    },
  })

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@umbandung.com',
      password: hashedPassword,
      full_name: 'Administrator',
      phone: '08123456791',
      role: Role.ADMIN,
    },
  })

  const kasir = await prisma.user.create({
    data: {
      username: 'kasir',
      email: 'kasir@umbandung.com',
      password: hashedPassword,
      full_name: 'Kasir Toko',
      phone: '08123456792',
      role: Role.KASIR,
    },
  })

  console.log(`✅ Created ${4} users`)

  // Create categories
  console.log('📦 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Makanan', description: 'Produk makanan' } }),
    prisma.category.create({ data: { name: 'Minuman', description: 'Produk minuman' } }),
    prisma.category.create({ data: { name: 'Alat Tulis', description: 'Perlengkapan sekolah' } }),
    prisma.category.create({ data: { name: 'Elektronik', description: 'Barang elektronik' } }),
  ])
  console.log(`✅ Created ${categories.length} categories`)

  // Create suppliers
  console.log('🏢 Creating suppliers...')
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        business_name: 'PT Sumber Rezeki',
        contact_person: 'Budi Santoso',
        phone: '0221234567',
        email: 'sumberrezeki@email.com',
        address: 'Jl. Raya Bandung No. 123',
      },
    }),
    prisma.supplier.create({
      data: {
        business_name: 'CV Jaya Abadi',
        contact_person: 'Siti Rahayu',
        phone: '0221234568',
        email: 'jayaabadi@email.com',
        address: 'Jl. Soekarno Hatta No. 456',
      },
    }),
  ])
  console.log(`✅ Created ${suppliers.length} suppliers`)

  // Create products
  console.log('🛍️  Creating products...')
  const products = await Promise.all([
    // Makanan
    prisma.product.create({
      data: {
        sku: 'MKN001',
        name: 'Indomie Goreng',
        description: 'Mie instan rasa goreng',
        category_id: categories[0].id,
        supplier_id: suppliers[0].id,
        purchase_price: 2500,
        selling_price: 3500,
        stock: 100,
        min_stock: 20,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'MKN002',
        name: 'Biskuit Roma',
        description: 'Biskuit kelapa',
        category_id: categories[0].id,
        supplier_id: suppliers[0].id,
        purchase_price: 3000,
        selling_price: 4000,
        stock: 75,
        min_stock: 15,
      },
    }),
    // Minuman
    prisma.product.create({
      data: {
        sku: 'MNM001',
        name: 'Teh Botol Sosro',
        description: 'Teh dalam kemasan botol',
        category_id: categories[1].id,
        supplier_id: suppliers[0].id,
        purchase_price: 3500,
        selling_price: 5000,
        stock: 120,
        min_stock: 30,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'MNM002',
        name: 'Aqua 600ml',
        description: 'Air mineral dalam kemasan',
        category_id: categories[1].id,
        supplier_id: suppliers[1].id,
        purchase_price: 2000,
        selling_price: 3000,
        stock: 200,
        min_stock: 50,
      },
    }),
    // Alat Tulis
    prisma.product.create({
      data: {
        sku: 'ATS001',
        name: 'Pulpen Standard AE',
        description: 'Pulpen tinta biru/hitam',
        category_id: categories[2].id,
        supplier_id: suppliers[1].id,
        purchase_price: 1500,
        selling_price: 2500,
        stock: 150,
        min_stock: 40,
      },
    }),
    prisma.product.create({
      data: {
        sku: 'ATS002',
        name: 'Buku Tulis 38 Lembar',
        description: 'Buku tulis sinar dunia',
        category_id: categories[2].id,
        supplier_id: suppliers[1].id,
        purchase_price: 3500,
        selling_price: 5000,
        stock: 80,
        min_stock: 20,
      },
    }),
  ])
  console.log(`✅ Created ${products.length} products`)

  // Create transactions
  console.log('💰 Creating transactions...')
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 150000,
        payment_method: 'CASH',
        description: 'Penjualan ATK ke pelanggan',
        notes: 'Penjualan tunai di toko',
        created_by_id: kasir.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'CASH_OUT',
        category: 'PURCHASE',
        amount: 75000,
        payment_method: 'CASH',
        description: 'Pembelian alat tulis dari supplier',
        supplier_id: suppliers[0].id,
        notes: 'Restok barang',
        created_by_id: admin.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'CASH_IN',
        category: 'SALES',
        amount: 50000,
        payment_method: 'BANK_TRANSFER',
        description: 'Penjualan pulpen',
        notes: 'Transfer dari Bu Siti',
        created_by_id: kasir.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'CASH_OUT',
        category: 'OPERATIONAL',
        amount: 25000,
        payment_method: 'CASH',
        description: 'Biaya listrik toko',
        notes: 'Bulan Oktober 2025',
        created_by_id: admin.id,
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'CASH_IN',
        category: 'MEMBER_DEPOSIT',
        amount: 100000,
        payment_method: 'CASH',
        description: 'Simpanan pokok anggota',
        notes: 'Anggota baru: Pak Ahmad',
        created_by_id: kasir.id,
      },
    }),
  ])
  console.log(`✅ Created ${transactions.length} transactions`)

  console.log('✨ Seed completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`   Users: 4 (developer, superadmin, admin, kasir)`)
  console.log(`   Categories: ${categories.length}`)
  console.log(`   Suppliers: ${suppliers.length}`)
  console.log(`   Products: ${products.length}`)
  console.log(`   Transactions: ${transactions.length}`)
  console.log('\n🔑 Default credentials:')
  console.log(`   Username: developer | Password: password123`)
  console.log(`   Username: superadmin | Password: password123`)
  console.log(`   Username: admin | Password: password123`)
  console.log(`   Username: kasir | Password: password123`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
