import { expect, test } from '@playwright/test';

const routes = [
  { path: '/', name: 'home' },
  { path: '/catalog/', name: 'catalog' },
  { path: '/product/ethiopia-sidamo/', name: 'product' },
  { path: '/articles/', name: 'articles' },
  { path: '/checkout/', name: 'checkout' },
];

const viewports = [
  { width: 1440, height: 1000 },
  { width: 1024, height: 900 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
];

const screenshotPhase = process.env.VISUAL_PHASE ?? 'current';

for (const viewport of viewports) {
  test.describe(`${viewport.width}px`, () => {
    for (const route of routes) {
      test(`${route.name}: layout, assets and console`, async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (message) => {
          if (message.type() === 'error') errors.push(message.text());
        });
        page.on('pageerror', (error) => errors.push(error.message));
        await page.setViewportSize(viewport);
        await page.goto(route.path, { waitUntil: 'networkidle' });
        await expect(page.locator('header.site-header')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();
        const imagesLoaded = await page
          .locator('img')
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          );
        expect(imagesLoaded).toBe(true);

        const hasOverflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 1,
        );
        expect(hasOverflow).toBe(false);
        expect(errors).toEqual([]);

        await page.screenshot({
          path: `test-results/screenshots/${screenshotPhase}/${route.name}-${viewport.width}.png`,
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  });
}

test('mobile navigation opens and links work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Мобильное меню' }),
  ).toBeVisible();
  await page
    .getByRole('dialog', { name: 'Мобильное меню' })
    .getByRole('link', { name: /Каталог/ })
    .click();
  await expect(page).toHaveURL(/\/catalog\/$/);
});

test('catalog filter drawer and product cards work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/catalog/');
  await page.getByRole('button', { name: 'Фильтры' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Фильтры каталога' }),
  ).toBeVisible();
  await page.getByRole('dialog').getByLabel('Для фильтра').check();
  await page.getByRole('button', { name: /Показать/ }).click();
  await expect(page.locator('.catalog-grid .product-card')).toHaveCount(4);
});

test('product controls and mock add-to-cart work', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/product/ethiopia-sidamo/');
  await page.getByRole('button', { name: '1 кг' }).click();
  await expect(page.locator('.product-info__price-row')).toContainText('4 106');
  await page
    .getByRole('button', { name: 'Увеличить количество' })
    .first()
    .click();
  await page
    .getByRole('button', { name: /В корзину/ })
    .first()
    .click();
  await expect(page.getByRole('button', { name: /Добавлено/ })).toBeVisible();
});

test('checkout fields, choices and submit success work', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/checkout/');
  await expect(page.getByLabel('Имя *')).toHaveValue('Иван');
  await page.getByText('Пункт выдачи', { exact: true }).click();
  await expect(
    page.getByRole('button', { name: /Оформить заказ/ }),
  ).toContainText('2 280 ₽');
  await page.getByRole('button', { name: /Оформить заказ/ }).click();
  await expect(page.getByRole('heading', { name: 'Спасибо!' })).toBeVisible();
});

test('primary links, hover and keyboard focus states work', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  const firstCard = page.locator('.product-card').first();
  await firstCard.hover();
  await page.waitForTimeout(250);
  const cardTransform = await firstCard.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  expect(cardTransform).not.toBe('none');

  await page.locator('body').click({ position: { x: 1, y: 1 } });
  await page.keyboard.press('Tab');
  const focusedOutline = await page.evaluate(() => {
    const element = document.activeElement;
    return element ? getComputedStyle(element).outlineStyle : 'none';
  });
  expect(focusedOutline).not.toBe('none');

  await page.getByRole('link', { name: /В каталог/ }).click();
  await expect(page).toHaveURL(/\/catalog\/$/);
  await page.locator('.product-card h3 a').first().click();
  await expect(page).toHaveURL(/\/product\/ethiopia-sidamo\/$/);
});
