import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display homepage correctly', async ({ page }) => {
    await page.goto('/')

    // Check title
    await expect(page).toHaveTitle(/Web Koperasi UM Bandung/)

    // Check main heading
    await expect(page.getByText('Web Koperasi UM Bandung')).toBeVisible()

    // Check status cards are present
    await expect(page.getByText('Next.js 16')).toBeVisible()
    await expect(page.getByText('Tailwind CSS 4')).toBeVisible()
    await expect(page.getByText('shadcn/ui')).toBeVisible()
    await expect(page.getByText('Prisma ORM')).toBeVisible()
    await expect(page.getByText('tRPC + Zod')).toBeVisible()
  })

  test('should have working login button', async ({ page }) => {
    await page.goto('/')

    // Find and click login button
    const loginButton = page.getByRole('link', { name: /test login system/i })
    await expect(loginButton).toBeVisible()

    await loginButton.click()

    // Should navigate to login page
    await expect(page).toHaveURL('/login')
    await expect(page.getByText('Login')).toBeVisible()
  })

  test('should have working products test button', async ({ page }) => {
    await page.goto('/')

    // Find and click products button
    const productsButton = page.getByRole('link', { name: /test products api/i })
    await expect(productsButton).toBeVisible()

    await productsButton.click()

    // Should navigate to products test page
    await expect(page).toHaveURL('/test/products')
  })
})

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    // Check form elements
    await expect(page.getByLabel(/username/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  test('should show demo credentials', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText(/demo credentials/i)).toBeVisible()
    await expect(page.getByText(/developer.*password123/i)).toBeVisible()
  })
})
