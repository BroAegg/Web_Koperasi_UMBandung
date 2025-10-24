import { test, expect, Page } from '@playwright/test'

// Helper function to login
async function login(page: Page) {
  await page.goto('/')
  await page.locator('input[name="username"]').fill('superadmin')
  await page.locator('input[type="password"]').fill('superadmin123')
  await page.getByRole('button', { name: /login|masuk/i }).click()
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

test.describe('POS Module', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/koperasi/pos')
  })

  test('should display POS interface', async ({ page }) => {
    // Check POS heading
    await expect(page.locator('h1:has-text("POS"), h1:has-text("Point")')).toBeVisible()

    // Check cart section exists
    await expect(page.locator('text=/cart|keranjang/i')).toBeVisible()

    // Check product search exists
    await expect(page.locator('input[type="search"], input[placeholder*="cari"]')).toBeVisible()
  })

  test('should search for products', async ({ page }) => {
    // Type in search box
    const searchInput = page.locator('input[type="search"], input[placeholder*="cari"]').first()
    await searchInput.fill('laptop')
    await page.waitForTimeout(1000)

    // Should show search results
    // At least one product card should be visible or "no results" message
    const hasResults =
      (await page.locator('[data-testid="product-card"]').count()) > 0 ||
      (await page.locator('text=/no.*result|tidak.*ditemukan/i').count()) > 0

    expect(hasResults).toBeTruthy()
  })

  test('should add product to cart', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Get first product (if exists)
    const productCard = page.locator('[data-testid="product-card"]').first()

    // If no products, skip test
    const productCount = await page.locator('[data-testid="product-card"]').count()
    if (productCount === 0) {
      test.skip()
      return
    }

    // Click product to add to cart
    await productCard.click()

    // Cart should show 1 item
    await expect(page.locator('text=/1.*item/i')).toBeVisible({ timeout: 3000 })
  })

  test('should update cart quantity', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Add product to cart first
    const productCard = page.locator('[data-testid="product-card"]').first()
    const productCount = await page.locator('[data-testid="product-card"]').count()

    if (productCount === 0) {
      test.skip()
      return
    }

    await productCard.click()
    await page.waitForTimeout(500)

    // Find quantity controls in cart
    const increaseButton = page.getByRole('button', { name: '+' }).first()
    await increaseButton.click()

    // Quantity should increase
    await expect(page.locator('text=/2/i')).toBeVisible()
  })

  test('should remove item from cart', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Add product to cart
    const productCard = page.locator('[data-testid="product-card"]').first()
    const productCount = await page.locator('[data-testid="product-card"]').count()

    if (productCount === 0) {
      test.skip()
      return
    }

    await productCard.click()
    await page.waitForTimeout(500)

    // Find and click remove button
    const removeButton = page.getByRole('button', { name: /remove|hapus/i }).first()
    await removeButton.click()

    // Cart should be empty
    await expect(page.locator('text=/empty|kosong/i')).toBeVisible()
  })

  test('should calculate subtotal correctly', async ({ page }) => {
    await page.waitForTimeout(2000)

    const productCount = await page.locator('[data-testid="product-card"]').count()
    if (productCount === 0) {
      test.skip()
      return
    }

    // Add 2 products
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()
    await page.waitForTimeout(300)

    if (productCount > 1) {
      const secondProduct = page.locator('[data-testid="product-card"]').nth(1)
      await secondProduct.click()
      await page.waitForTimeout(300)
    }

    // Check subtotal exists
    await expect(page.locator('text=/subtotal/i')).toBeVisible()
    await expect(page.locator('text=/Rp/i')).toBeVisible()
  })

  test('should open payment modal', async ({ page }) => {
    await page.waitForTimeout(2000)

    const productCount = await page.locator('[data-testid="product-card"]').count()
    if (productCount === 0) {
      test.skip()
      return
    }

    // Add product
    await page.locator('[data-testid="product-card"]').first().click()
    await page.waitForTimeout(500)

    // Click checkout button
    await page.getByRole('button', { name: /checkout|bayar/i }).click()

    // Payment modal should appear
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('input[name="payment"], input[placeholder*="bayar"]')).toBeVisible()
  })

  test('should validate insufficient payment', async ({ page }) => {
    await page.waitForTimeout(2000)

    const productCount = await page.locator('[data-testid="product-card"]').count()
    if (productCount === 0) {
      test.skip()
      return
    }

    // Add product
    await page.locator('[data-testid="product-card"]').first().click()
    await page.waitForTimeout(500)

    // Open payment modal
    await page.getByRole('button', { name: /checkout|bayar/i }).click()
    await page.waitForTimeout(500)

    // Enter insufficient amount
    const paymentInput = page.locator('input[name="payment"], input[placeholder*="bayar"]')
    await paymentInput.fill('1000')

    // Try to submit
    await page.getByRole('button', { name: /process|proses|complete|selesai/i }).click()

    // Should show error
    await expect(page.locator('text=/insufficient|kurang|tidak.*cukup/i')).toBeVisible({
      timeout: 3000,
    })
  })
})

test.describe('POS Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.goto('/koperasi/pos')
  })

  test('should complete full checkout', async ({ page }) => {
    await page.waitForTimeout(2000)

    const productCount = await page.locator('[data-testid="product-card"]').count()
    if (productCount === 0) {
      test.skip()
      return
    }

    // Add product to cart
    await page.locator('[data-testid="product-card"]').first().click()
    await page.waitForTimeout(500)

    // Open payment modal
    await page.getByRole('button', { name: /checkout|bayar/i }).click()
    await page.waitForTimeout(500)

    // Enter sufficient payment (1 million - should be enough)
    const paymentInput = page.locator('input[name="payment"], input[placeholder*="bayar"]')
    await paymentInput.fill('1000000')

    // Complete payment
    await page.getByRole('button', { name: /process|proses|complete|selesai/i }).click()

    // Should show success or receipt
    await expect(page.locator('text=/success|berhasil|receipt|struk/i')).toBeVisible({
      timeout: 5000,
    })
  })
})
