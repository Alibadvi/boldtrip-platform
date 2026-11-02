import { syntheticPdf } from '../fixtures/pdf'
import { expect, test, type APIRequestContext } from '@playwright/test'

const password = 'Synthetic-test-password-42'
const origin = 'http://localhost:3000'
function identity() {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`
  return { name: 'کاربر آزمایشی', email: `e2e-${unique}@example.test`, mobile: `09${unique.slice(-9)}`, password }
}
async function register(request: APIRequestContext) {
  const user = identity()
  const response = await request.post('/api/customer/customers', { headers: { origin }, data: user })
  expect(response.ok(), await response.text()).toBeTruthy()
  const login = await request.post('/api/customer/customers/login', { headers: { origin }, data: { email: user.email, password } })
  expect(login.ok()).toBeTruthy()
  return user
}

test('guest signup and later login both return to the chosen embassy form', async ({ page }) => {
  const user = identity()
  await page.goto('/services/boldtrip-pricing')
  await page.locator('article').filter({ hasText: 'E2E Embassy France' }).getByRole('link', { name: 'ثبت درخواست', exact: true }).click()
  await expect(page).toHaveURL(/sign-in\?next=%2Fembassy-appointments%2Fe2e-france%2Fapply/)
  await page.getByRole('link', { name: 'ثبت‌نام کنید' }).click()
  await page.getByLabel('نام و نام خانوادگی').fill(user.name)
  await page.getByLabel('شماره موبایل').fill(user.mobile)
  await page.getByLabel('ایمیل', { exact: true }).fill(user.email)
  await page.getByLabel('رمز عبور', { exact: true }).fill(password)
  await page.getByLabel('تکرار رمز عبور').fill(password)
  await page.getByRole('button', { name: 'ایجاد حساب', exact: true }).click()
  await expect(page).toHaveURL(/embassy-appointments\/e2e-france\/apply$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('فرانسه آزمایشی')
  await page.request.post('/api/customer/customers/logout', { headers: { origin } })
  await page.goto('/embassy-appointments/e2e-france/apply')
  await page.getByLabel('ایمیل', { exact: true }).fill(user.email)
  await page.getByLabel('رمز عبور', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'ورود به حساب', exact: true }).click()
  await expect(page).toHaveURL(/embassy-appointments\/e2e-france\/apply$/)
})

test('signed-in users open the service and consultation with country preserved', async ({ page }) => {
  await register(page.request)
  await page.goto('/services/boldtrip-pricing')
  await page.locator('article').filter({ hasText: 'E2E Visa France' }).getByRole('link', { name: 'ثبت درخواست', exact: true }).click()
  await expect(page).toHaveURL(/services\/e2e-visa-review\/apply\?country=e2e-france/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('فرانسه آزمایشی')
  await page.goto('/services/boldtrip-pricing')
  await page.locator('article').filter({ hasText: 'E2E Consultation France' }).getByRole('link', { name: 'ثبت درخواست', exact: true }).click()
  await expect(page).toHaveURL(/consultation\/book\?/)
  await expect(page.getByRole('textbox', { name: 'موضوع مشاوره' })).toHaveValue(/فرانسه آزمایشی/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('assessment submits with a private document and shows its tracking reference', async ({ page }) => {
  await register(page.request)
  await page.goto('/assessment/apply')
  await page.getByLabel('تابعیت', { exact: true }).fill('ایرانی')
  await page.getByLabel('سن', { exact: true }).fill('30')
  await page.getByLabel('وضعیت تأهل').selectOption('single')
  for (const [label, value] of [['تحصیلات', 'کارشناسی'], ['شغل', 'برنامه‌نویس'], ['کشور مقصد', 'کانادا'], ['نوع ویزا', 'توریستی'], ['بودجه تقریبی', '5000 CAD'], ['سابقه سفر', 'ندارم'], ['سابقه ریجکتی', 'ندارم'], ['توضیح شرایط', 'درخواست ارزیابی اولیه شرایط سفر']] as const) await page.getByLabel(label, { exact: true }).fill(value)
  await page.locator('input[name="documents"]').setInputFiles({ name: 'synthetic.pdf', mimeType: 'application/pdf', buffer: syntheticPdf() })
  await page.locator('input[name="consent"]').check()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'ثبت ارزیابی رایگان و دریافت شماره پیگیری' }).click()
  await expect(page).toHaveURL(/account\/requests\/\d+$/)
  await expect(page.getByText(/^BT-\d{8}-[A-F0-9]+$/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'ارزیابی رایگان شرایط و مدارک', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'پرداخت و ارسال رسید', exact: true })).toHaveCount(0)
  await page.getByRole('link', { name: 'مدیریت مدارک', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'synthetic.pdf', exact: true })).toBeVisible()
})

test('private pages are protected and noindexed while public content and brand data remain available', async ({ page, request }) => {
  for (const path of ['/sign-in', '/sign-up', '/forgot-password', '/reset-password']) {
    const response = await page.goto(path)
    expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  }
  await page.goto('/account')
  await expect(page).toHaveURL(/sign-in\?next=%2Faccount/)
  await expect(page.getByRole('navigation', { name: 'منوی حساب کاربری' })).toHaveCount(0)
  const documents = await request.get('/api/customer/customer-documents')
  expect(documents.status()).toBe(401)
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBeTruthy()
  const xml = await sitemap.text()
  expect(xml).toContain('/countries/e2e-france')
  expect(xml).not.toMatch(/sign-in|sign-up|account|admin|\/apply/)
  await page.goto('/')
  const organization = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(organization.map((item) => JSON.parse(item))).toContainEqual(expect.objectContaining({ '@type': 'Organization', name: 'BoldTrip', url: 'https://boldtrip.ir' }))
})
