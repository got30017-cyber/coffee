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

        await page.locator('[data-reveal]').evaluateAll((elements) => {
          elements.forEach((element) => element.classList.add('is-revealed'));
        });

        await page.screenshot({
          path: `test-results/screenshots/${screenshotPhase}/${route.name}-${viewport.width}.png`,
          fullPage: true,
          animations: 'disabled',
        });
      });
    }
  });
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
]) {
  test(`article filters keep one real selected state at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/articles/');

    const filters = page.locator('.article-filters');
    const all = filters.getByRole('button', { name: 'Все' });
    const brewing = filters.getByRole('button', { name: 'Заваривание' });
    const grain = filters.getByRole('button', { name: 'Зерно' });

    await expect(all).toHaveAttribute('aria-pressed', 'true');
    await expect(filters.locator('.is-active')).toHaveCount(1);

    await brewing.click();
    await expect(brewing).toHaveAttribute('aria-pressed', 'true');
    await expect(all).toHaveAttribute('aria-pressed', 'false');
    await expect(filters.locator('.is-active')).toHaveCount(1);
    await expect(page.locator('.articles-grid .editorial-card')).toHaveCount(2);
    await expect(
      page.locator('.articles-grid .editorial-card').first(),
    ).toContainText('Заваривание');

    await grain.click();
    await expect(grain).toHaveAttribute('aria-pressed', 'true');
    await expect(brewing).toHaveAttribute('aria-pressed', 'false');
    await expect(filters.locator('.is-active')).toHaveCount(1);
    await expect(page.locator('.articles-grid .editorial-card')).toHaveCount(2);
  });

  test(`scroll reveal runs once without changing geometry at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const banner = page.locator('.story-banner').first();
    await expect(page.locator('html')).toHaveClass(/reveal-ready/);
    await expect(banner).not.toHaveClass(/is-revealed/);
    const before = await banner.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });

    await banner.scrollIntoViewIfNeeded();
    await expect(banner).toHaveClass(/is-revealed/);
    await expect(banner).toHaveCSS('opacity', '1');
    const after = await banner.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    expect(after).toEqual(before);

    await page.evaluate(() => window.scrollTo(0, 0));
    await banner.scrollIntoViewIfNeeded();
    await expect(banner).toHaveClass(/is-revealed/);
  });
}

test('reduced motion keeps reveal content immediately visible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const banner = page.locator('.story-banner').first();
  await expect(page.locator('html')).toHaveClass(/reveal-ready/);
  await expect(banner).toHaveCSS('opacity', '1');
  await expect(banner).toHaveCSS('transform', 'none');
});

test('flow C: mobile menu and filter drawer are keyboard-safe', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menuTrigger = page.getByRole('button', { name: 'Открыть меню' });
  const menu = page.getByRole('dialog', { name: 'Мобильное меню' });

  await menuTrigger.click();
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole('button', { name: 'Закрыть меню' }).last(),
  ).toBeFocused();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(menuTrigger).toBeFocused();

  await menuTrigger.click();
  await menu.getByRole('link', { name: /Каталог/ }).click();
  await expect(page).toHaveURL(/\/catalog\/$/);

  const filterTrigger = page.getByRole('button', { name: 'Фильтры' });
  const drawer = page.getByRole('dialog', { name: 'Фильтры каталога' });
  await filterTrigger.click();
  await expect(drawer).toBeVisible();
  await expect(
    drawer.getByRole('button', { name: 'Закрыть фильтры' }).last(),
  ).toBeFocused();
  await drawer.getByLabel('Для фильтра').check();
  await drawer.getByRole('button', { name: /Показать/ }).click();
  await expect(drawer).toBeHidden();
  await expect(page.locator('.catalog-grid .product-card')).toHaveCount(4);

  await filterTrigger.click();
  await expect(drawer.getByLabel('Для фильтра')).toBeChecked();
  await drawer.getByRole('button', { name: 'Сбросить фильтры' }).click();
  await expect(drawer.getByLabel('Для фильтра')).not.toBeChecked();
  await expect(page.locator('.catalog-grid .product-card')).toHaveCount(8);
  await drawer
    .locator('.filter-drawer__backdrop')
    .click({ position: { x: 5, y: 5 } });
  await expect(drawer).toBeHidden();
  await expect(filterTrigger).toBeFocused();
});

test('flow A: home to filtered product updates the cart badge', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('.cart-button span')).toHaveText('2');
  await page.getByRole('link', { name: /В каталог/ }).click();
  await page.locator('.catalog-sidebar').getByLabel('Для фильтра').check();
  await expect(page.locator('.catalog-grid .product-card')).toHaveCount(4);
  await page.locator('.sort-select select').selectOption('price-desc');
  await expect(page.locator('.sort-select select')).toHaveValue('price-desc');
  await expect(
    page.locator('.catalog-grid .product-card').first(),
  ).toContainText('1 390 ₽');
  await page.locator('.catalog-grid .product-card h3 a').first().click();
  await page
    .getByRole('button', { name: /В корзину/ })
    .first()
    .click();
  await expect(page.getByRole('button', { name: /Добавлено/ })).toBeVisible();
  await expect(page.locator('.cart-button span')).toHaveText('3');
});

test('flow B: favorite state persists in frontend storage', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/catalog/');
  const firstFavorite = page
    .locator('.catalog-grid .product-card')
    .first()
    .locator('.favorite-button');
  await expect(firstFavorite).toHaveAttribute('aria-pressed', 'false');
  await firstFavorite.click();
  await expect(firstFavorite).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(
    page
      .locator('.catalog-grid .product-card')
      .first()
      .getByRole('button', { name: 'Убрать из избранного' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('flow D: product options, quantity and add-to-cart work', async ({
  page,
}) => {
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
  await expect(page.locator('.cart-button span')).toHaveText('4');
});

test('flow E: checkout quantity, total and form submission work', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/checkout/');
  await page
    .locator('.order-line')
    .first()
    .getByRole('button', { name: 'Увеличить количество' })
    .click();
  await expect(page.locator('.order-totals__grand')).toContainText('3 670 ₽');
  await page.getByText('Пункт выдачи', { exact: true }).click();
  await expect(
    page.getByRole('button', { name: /Оформить заказ/ }),
  ).toContainText('3 470 ₽');
  await page.getByLabel('Имя *').fill('Анна');
  await page.getByLabel('Телефон *').fill('+7 999 555-44-33');
  await page.getByLabel('E-mail *').fill('anna@example.ru');
  await page.getByLabel('Адрес *').fill('ул. Тверская, д. 10');
  await page.getByRole('button', { name: /Оформить заказ/ }).click();
  await expect(page.getByRole('heading', { name: 'Спасибо!' })).toBeVisible();
});

test('mobile header compacts by scroll direction without hiding actions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const header = page.locator('.site-header');
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(header).toHaveClass(/is-compact/);
  await expect(header.locator('.brand')).toBeVisible();
  await expect(page.locator('.cart-button')).toBeVisible();
  await expect(page.locator('.mobile-menu-button')).toBeVisible();
  await expect(page.locator('.benefit-bar')).not.toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(header).not.toHaveClass(/is-compact/);
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

  const editorialCard = page.locator('.editorial-card').first();
  await editorialCard.scrollIntoViewIfNeeded();
  await editorialCard.hover();
  await page.waitForTimeout(200);
  const editorialImageTransform = await editorialCard
    .locator('img')
    .evaluate((element) => getComputedStyle(element).transform);
  expect(editorialImageTransform).not.toBe('none');

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
