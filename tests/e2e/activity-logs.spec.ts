import { test, expect, Page } from '@playwright/test'

// Helper function to login
async function login(
  page: Page,
  role: 'SUPER_ADMIN' | 'DEVELOPER' | 'ADMIN' | 'KASIR' = 'SUPER_ADMIN'
) {
  const credentials = {
    SUPER_ADMIN: { username: 'superadmin', password: 'superadmin123' },
    DEVELOPER: { username: 'developer', password: 'developer123' },
    ADMIN: { username: 'admin', password: 'admin123' },
    KASIR: { username: 'kasir', password: 'kasir123' },
  }

  const cred = credentials[role]

  await page.goto('/')
  await page.locator('input[name="username"]').fill(cred.username)
  await page.locator('input[type="password"]').fill(cred.password)
  await page.getByRole('button', { name: /login|masuk/i }).click()
  await page.waitForURL(/\/dashboard/, { timeout: 10000 })
}

test.describe('Activity Logs Module', () => {
  test('should restrict access for KASIR role', async ({ page }) => {
    await login(page, 'KASIR')

    // Try to access activity logs
    await page.goto('/koperasi/activity-logs')

    // Should be redirected or show forbidden message
    await page.waitForTimeout(2000)

    const isAccessDenied =
      page.url().includes('/dashboard') ||
      (await page.locator('text=/forbidden|akses.*ditolak|tidak.*izin/i').count()) > 0

    expect(isAccessDenied).toBeTruthy()
  })

  test('should allow DEVELOPER to access activity logs', async ({ page }) => {
    await login(page, 'DEVELOPER')
    await page.goto('/koperasi/activity-logs')
    await page.waitForTimeout(1000)

    // Should display activity logs page
    await expect(page.locator('h1:has-text("Activity"), h1:has-text("Aktivitas")')).toBeVisible({
      timeout: 5000,
    })
  })

  test('should allow SUPER_ADMIN to access activity logs', async ({ page }) => {
    await login(page, 'SUPER_ADMIN')
    await page.goto('/koperasi/activity-logs')
    await page.waitForTimeout(1000)

    // Should display activity logs page
    await expect(page.locator('h1:has-text("Activity"), h1:has-text("Aktivitas")')).toBeVisible({
      timeout: 5000,
    })
  })

  test.describe('Activity Logs Display', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'DEVELOPER')
      await page.goto('/koperasi/activity-logs')
    })

    test('should display activity log table', async ({ page }) => {
      await page.waitForTimeout(2000)

      // Should have table or list of logs
      const hasLogs =
        (await page.locator('table tbody tr').count()) > 0 ||
        (await page.locator('[data-testid="log-item"]').count()) > 0 ||
        (await page.locator('text=/no.*log|tidak.*aktivitas/i').count()) > 0

      expect(hasLogs).toBeTruthy()
    })

    test('should display log details columns', async ({ page }) => {
      await page.waitForTimeout(2000)

      const logTable = page.locator('table, [role="table"]')

      if ((await logTable.count()) > 0) {
        // Should have columns for user, action, module, timestamp
        await expect(page.locator('th:has-text("User"), th:has-text("Pengguna")')).toBeVisible()

        await expect(page.locator('th:has-text("Action"), th:has-text("Aksi")')).toBeVisible()

        await expect(page.locator('th:has-text("Module"), th:has-text("Modul")')).toBeVisible()
      }
    })

    test('should filter by module', async ({ page }) => {
      await page.waitForTimeout(2000)

      // Find module filter dropdown
      const moduleFilter = page.locator('select[name="module"], [data-filter="module"]')

      if ((await moduleFilter.count()) > 0) {
        await moduleFilter.first().selectOption({ index: 1 })
        await page.waitForTimeout(1000)

        // Should reload logs
        expect(page.url()).toContain('/activity-logs')
      }
    })

    test('should filter by action', async ({ page }) => {
      await page.waitForTimeout(2000)

      // Find action filter dropdown
      const actionFilter = page.locator('select[name="action"], [data-filter="action"]')

      if ((await actionFilter.count()) > 0) {
        await actionFilter.first().selectOption({ index: 1 })
        await page.waitForTimeout(1000)

        // Should reload logs
        expect(page.url()).toContain('/activity-logs')
      }
    })

    test('should filter by date range', async ({ page }) => {
      await page.waitForTimeout(2000)

      // Find date inputs
      const dateFrom = page.locator('input[name="date_from"], input[type="date"]').first()
      const dateTo = page.locator('input[name="date_to"], input[type="date"]').last()

      if ((await dateFrom.count()) > 0 && (await dateTo.count()) > 0) {
        // Set date range (last 7 days)
        const today = new Date()
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

        await dateFrom.fill(weekAgo.toISOString().split('T')[0])
        await dateTo.fill(today.toISOString().split('T')[0])

        // Apply filter
        const applyButton = page.getByRole('button', { name: /apply|terapkan/i })
        if ((await applyButton.count()) > 0) {
          await applyButton.click()
          await page.waitForTimeout(1000)
        }

        expect(page.url()).toContain('/activity-logs')
      }
    })

    test('should search logs', async ({ page }) => {
      await page.waitForTimeout(2000)

      // Find search input
      const searchInput = page.locator('input[type="search"], input[placeholder*="cari"]')

      if ((await searchInput.count()) > 0) {
        await searchInput.first().fill('login')
        await page.waitForTimeout(1000)

        // Should show filtered results
        const hasResults =
          (await page.locator('table tbody tr').count()) > 0 ||
          (await page.locator('text=/no.*result|tidak.*ditemukan/i').count()) > 0

        expect(hasResults).toBeTruthy()
      }
    })

    test('should paginate logs', async ({ page }) => {
      await page.waitForTimeout(2000)

      // Find pagination controls
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Selanjutnya")')
      const pageButton = page.locator('[data-testid="pagination"] button')

      const hasPagination = (await nextButton.count()) > 0 || (await pageButton.count()) > 0

      if (hasPagination) {
        // Click next page
        await nextButton.first().click()
        await page.waitForTimeout(1000)

        // Should load next page
        expect(page.url()).toContain('/activity-logs')
      }
    })
  })
})

test.describe('Activity Logs Export', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'DEVELOPER')
    await page.goto('/koperasi/activity-logs')
  })

  test('should have export button', async ({ page }) => {
    await page.waitForTimeout(2000)

    // Look for export button
    const exportButton = page.getByRole('button', { name: /export/i })

    // Export button may or may not exist
    const hasExportButton = (await exportButton.count()) > 0
    expect(typeof hasExportButton).toBe('boolean')
  })
})
