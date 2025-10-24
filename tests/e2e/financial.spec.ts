import { test, expect, Page } from '@playwright/test'

// Helper function to login
async function login(page: Page) {
  await page.goto('/')
  await page.locator('input[name="username"]').fill('superadmin')
  await page.locator('input[type="password"]').fill('superadmin123')
  await page.getByRole('button', { name: /login|masuk/i }).click()
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

test.describe('Financial Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    // Navigate to financial page
    await page.goto('/koperasi/financial')
  })

  test('should display financial dashboard', async ({ page }) => {
    // Check page title or heading
    await expect(page.locator('h1:has-text("Financial"), h1:has-text("Keuangan")')).toBeVisible()

    // Check summary cards are visible
    await expect(page.locator('text=/cash in|pemasukan/i')).toBeVisible()
    await expect(page.locator('text=/cash out|pengeluaran/i')).toBeVisible()
  })

  test('should open transaction form modal', async ({ page }) => {
    // Click add transaction button
    await page.getByRole('button', { name: /add|tambah.*transaction|transaksi/i }).click()

    // Modal should appear
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    // Form fields should be visible
    await expect(page.locator('select[name="type"]')).toBeVisible()
    await expect(page.locator('input[name="amount"]')).toBeVisible()
  })

  test('should validate transaction form', async ({ page }) => {
    // Open form
    await page.getByRole('button', { name: /add|tambah.*transaction|transaksi/i }).click()

    // Try to submit empty form
    await page.getByRole('button', { name: /save|simpan/i }).click()

    // Should show validation errors
    await expect(page.locator('text=/required|wajib/i')).toBeVisible()
  })

  test('should create CASH_IN transaction', async ({ page }) => {
    // Open form
    await page.getByRole('button', { name: /add|tambah.*transaction|transaksi/i }).click()
    await page.waitForTimeout(500)

    // Fill form
    await page.locator('select[name="type"]').selectOption('CASH_IN')
    await page.locator('select[name="category"]').selectOption('SALES')
    await page.locator('input[name="amount"]').fill('100000')
    await page.locator('textarea[name="description"]').fill('Test E2E Transaction')

    // Submit
    await page.getByRole('button', { name: /save|simpan/i }).click()

    // Should show success message
    await expect(page.locator('text=/success|berhasil/i')).toBeVisible({ timeout: 5000 })

    // Transaction should appear in table
    await expect(page.locator('text=Test E2E Transaction')).toBeVisible({ timeout: 5000 })
  })

  test('should filter transactions by period', async ({ page }) => {
    // Click period filter
    await page.getByRole('button', { name: /today|hari ini/i }).click()

    // Select week
    await page.getByRole('menuitem', { name: /week|minggu/i }).click()

    // Wait for data to load
    await page.waitForTimeout(1000)

    // Table should update (check loading state disappears)
    await expect(page.locator('text=/loading|memuat/i')).not.toBeVisible({ timeout: 5000 })
  })

  test('should open filter panel', async ({ page }) => {
    // Click filter button
    await page.getByRole('button', { name: /filter/i }).click()

    // Filter panel should appear
    await expect(page.locator('text=/search|cari/i')).toBeVisible()
  })

  test('should display transaction details', async ({ page }) => {
    // Wait for table to load
    await page.waitForTimeout(2000)

    // Get first row
    const firstRow = page.locator('tbody tr').first()
    await expect(firstRow).toBeVisible()

    // Check if row has transaction data
    const rowText = await firstRow.textContent()
    expect(rowText).toBeTruthy()
  })

  test('should calculate totals correctly', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000)

    // Check if summary shows numbers
    const cashInText = await page
      .locator('text=/total.*cash in|pemasukan/i')
      .locator('..')
      .textContent()

    // Should contain "Rp" and numbers
    expect(cashInText).toContain('Rp')
  })
})

test.describe('Financial Export', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/koperasi/financial')
  })

  test('should have export button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
  })
})
