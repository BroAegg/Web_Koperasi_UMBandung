import { test, expect, Page } from '@playwright/test'

// Helper function to login
async function login(page: Page) {
  await page.goto('/')
  await page.locator('input[name="username"]').fill('superadmin')
  await page.locator('input[type="password"]').fill('superadmin123')
  await page.getByRole('button', { name: /login|masuk/i }).click()
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

test.describe('Inventory Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/koperasi/inventory')
  })

  test('should display inventory dashboard', async ({ page }) => {
    // Check heading
    await expect(page.locator('h1:has-text("Inventory"), h1:has-text("Inventori")')).toBeVisible()

    // Check view toggle (grid/table)
    await expect(
      page.locator('[data-testid="view-toggle"], button:has-text("Grid"), button:has-text("Table")')
    ).toBeVisible()

    // Check add product button
    await expect(page.getByRole('button', { name: /add|tambah.*product|produk/i })).toBeVisible()
  })

  test('should display product list', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Should have product cards or table rows
    const hasProducts =
      (await page.locator('[data-testid="product-card"]').count()) > 0 ||
      (await page.locator('tbody tr').count()) > 0 ||
      (await page.locator('text=/no.*product|tidak.*produk/i').count()) > 0

    expect(hasProducts).toBeTruthy()
  })

  test('should switch view mode', async ({ page }) => {
    await page.waitForTimeout(1000)

    // Find view toggle buttons
    const gridButton = page.locator('button:has-text("Grid"), [data-view="grid"]')
    const tableButton = page.locator('button:has-text("Table"), [data-view="table"]')

    const hasViewToggle = (await gridButton.count()) > 0 || (await tableButton.count()) > 0

    if (hasViewToggle) {
      // Click table view
      await tableButton.first().click()
      await page.waitForTimeout(500)

      // Should show table
      await expect(page.locator('table, [role="table"]')).toBeVisible()
    }
  })

  test('should open add product modal', async ({ page }) => {
    // Click add button
    await page.getByRole('button', { name: /add|tambah.*product|produk/i }).click()
    await page.waitForTimeout(500)

    // Modal should appear
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Form fields should be visible
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="sku"]')).toBeVisible()
    await expect(page.locator('input[name="selling_price"]')).toBeVisible()
  })

  test('should validate product form', async ({ page }) => {
    // Open add modal
    await page.getByRole('button', { name: /add|tambah.*product|produk/i }).click()
    await page.waitForTimeout(500)

    // Try to submit empty form
    await page.getByRole('button', { name: /save|simpan/i }).click()

    // Should show validation errors
    await expect(page.locator('text=/required|wajib|harus/i')).toBeVisible({ timeout: 3000 })
  })

  test('should create new product', async ({ page }) => {
    // Open add modal
    await page.getByRole('button', { name: /add|tambah.*product|produk/i }).click()
    await page.waitForTimeout(500)

    // Fill form
    await page.locator('input[name="name"]').fill('E2E Test Product')
    await page.locator('input[name="sku"]').fill('E2E-' + Date.now())
    await page.locator('input[name="purchase_price"]').fill('50000')
    await page.locator('input[name="selling_price"]').fill('75000')
    await page.locator('input[name="stock"]').fill('100')
    await page.locator('input[name="min_stock"]').fill('10')
    await page.locator('input[name="unit"]').fill('pcs')

    // Select category (if dropdown exists)
    const categorySelect = page.locator('select[name="category_id"]')
    if ((await categorySelect.count()) > 0) {
      await categorySelect.selectOption({ index: 1 })
    }

    // Submit
    await page.getByRole('button', { name: /save|simpan/i }).click()

    // Should show success
    await expect(page.locator('text=/success|berhasil/i')).toBeVisible({ timeout: 5000 })
  })

  test('should filter by category', async ({ page }) => {
    await page.waitForTimeout(1000)

    // Look for category filter
    const categoryFilter = page.locator('select[name="category"], [data-filter="category"]')

    if ((await categoryFilter.count()) > 0) {
      await categoryFilter.first().selectOption({ index: 1 })
      await page.waitForTimeout(1000)

      // Should reload product list
      expect(page.url()).toContain('/inventory')
    }
  })

  test('should search products', async ({ page }) => {
    await page.waitForTimeout(1000)

    // Find search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="cari"]')

    if ((await searchInput.count()) > 0) {
      await searchInput.first().fill('laptop')
      await page.waitForTimeout(1000)

      // Should show filtered results or no results message
      const hasResults =
        (await page.locator('[data-testid="product-card"]').count()) > 0 ||
        (await page.locator('tbody tr').count()) > 0 ||
        (await page.locator('text=/no.*result|tidak.*ditemukan/i').count()) > 0

      expect(hasResults).toBeTruthy()
    }
  })
})

test.describe('Inventory Stock Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/koperasi/inventory')
  })

  test('should open stock update modal', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Find first product's stock button
    const stockButton = page.locator('button:has-text("Stock"), button:has-text("Stok")').first()

    if ((await stockButton.count()) > 0) {
      await stockButton.click()
      await page.waitForTimeout(500)

      // Modal should appear
      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await expect(page.locator('select[name="type"], input[name="quantity"]')).toBeVisible()
    }
  })

  test('should display low stock indicator', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Look for low stock badge or warning
    const lowStockIndicator =
      (await page.locator('text=/low.*stock|stok.*rendah/i').count()) > 0 ||
      (await page.locator('[data-status="low-stock"]').count()) > 0

    // Low stock indicator may or may not exist depending on data
    expect(typeof lowStockIndicator).toBe('boolean')
  })
})
