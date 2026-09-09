# Светлый Кофе

Адаптивный frontend-прототип интернет-магазина кофе по предоставленным
референсам. Интерфейс полностью на русском, цены указаны в рублях, а действия
каталога, карточки товара и checkout работают в mock-режиме.

## Стек

- Next.js 16.3 с App Router и TypeScript
- React 19
- CSS без UI-фреймворка: общие токены и адаптивная дизайн-система
- Lucide React для интерфейсных иконок
- Playwright для e2e, responsive и screenshot QA

Демо-данные находятся в `lib/store-data.ts`. Компоненты получают данные через
типизированные props, поэтому на следующем этапе статический массив можно
заменить адаптером WordPress REST API / WooCommerce Store API без переписывания
UI.

## Запуск

```bash
pnpm install
pnpm dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Проверки

```bash
pnpm lint
pnpm build
pnpm test:e2e
```

Production build экспортируется в каталог `out/`.

## Маршруты

- `/` — главная
- `/catalog/` — каталог и фильтры
- `/product/ethiopia-sidamo/` — страница товара
- `/articles/` — статьи
- `/checkout/` — оформление заказа
