import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/')
  })

  test('should display login page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Web Koperasi/)

    // Check login form elements exist
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /login|masuk/i })).toBeVisible()
  })

  test('should show error for empty credentials', async ({ page }) => {
    // Click login without filling form
    await page.getByRole('button', { name: /login|masuk/i }).click()

    // Should show validation errors
    await expect(page.locator('text=/required|wajib/i')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill with wrong credentials
    await page.locator('input[name="username"]').fill('wronguser')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.getByRole('button', { name: /login|masuk/i }).click()

    // Wait for error message
    await expect(page.locator('text=/invalid|salah|tidak ditemukan/i')).toBeVisible({
      timeout: 5000,
    })
  })

  test('should login successfully with valid SUPER_ADMIN credentials', async ({ page }) => {
    // Fill login form
    await page.locator('input[name="username"]').fill('superadmin')
    await page.locator('input[type="password"]').fill('superadmin123')

    // Submit form
    await page.getByRole('button', { name: /login|masuk/i }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })

    // Should show welcome message or user info
    await expect(page.locator('text=/dashboard|beranda/i')).toBeVisible({ timeout: 5000 })
  })

  test('should persist session after page reload', async ({ page }) => {
    // Login first
    await page.locator('input[name="username"]').fill('superadmin')
    await page.locator('input[type="password"]').fill('superadmin123')
    await page.getByRole('button', { name: /login|masuk/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    // Reload page
    await page.reload()

    // Should still be on dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('text=/dashboard|beranda/i')).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.locator('input[name="username"]').fill('superadmin')
    await page.locator('input[type="password"]').fill('superadmin123')
    await page.getByRole('button', { name: /login|masuk/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    // Find and click logout button
    const logoutButton = page.getByRole('button', { name: /logout|keluar/i })
    await logoutButton.click()

    // Should redirect to login page
    await expect(page).toHaveURL('/', { timeout: 5000 })
    await expect(page.locator('input[name="username"]')).toBeVisible()
  })
})

test.describe('Role-based Access', () => {
  test('DEVELOPER should access activity logs', async ({ page }) => {
    await page.goto('/')

    // Login as developer
    await page.locator('input[name="username"]').fill('developer')
    await page.locator('input[type="password"]').fill('developer123')
    await page.getByRole('button', { name: /login|masuk/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 10000 })

    // Navigate to activity logs
    await page.goto('/activity-logs')

    // Should be able to access
    await expect(page).toHaveURL(/\/activity-logs/)
    await expect(page.locator('text=/activity|aktivitas/i')).toBeVisible()
  })

  test('KASIR should not access suppliers', async ({ page }) => {
    await page.goto('/')

    // Login as kasir (if exists)
    await page.locator('input[name="username"]').fill('kasir')
    await page.locator('input[type="password"]').fill('kasir123')
    await page.getByRole('button', { name: /login|masuk/i }).click()

    // Try to access suppliers directly
    await page.goto('/koperasi/suppliers')

    // Should redirect or show forbidden
    const url = page.url()
    expect(url).not.toContain('/suppliers')
  })
})
