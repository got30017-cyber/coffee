export type CoffeeTone =
  | 'clay'
  | 'forest'
  | 'gold'
  | 'slate'
  | 'rose'
  | 'moss'
  | 'cocoa'
  | 'sand';

export type CoffeeProduct = {
  slug: string;
  name: string;
  shortName: string;
  country: string;
  method: string;
  notes: string[];
  price: number;
  tone: CoffeeTone;
  roast: number;
  description: string;
};

export const products: CoffeeProduct[] = [
  {
    slug: 'ethiopia-sidamo',
    name: 'Эфиопия Сидамо',
    shortName: 'Сидамо',
    country: 'Эфиопия',
    method: 'Для фильтра',
    notes: ['Ягоды', 'Цветы'],
    price: 1190,
    tone: 'clay',
    roast: 2,
    description:
      'Цветочный кофе с сочной ягодной сладостью и чистой цитрусовой кислотностью.',
  },
  {
    slug: 'brazil-santos',
    name: 'Бразилия Сантос',
    shortName: 'Сантос',
    country: 'Бразилия',
    method: 'Эспрессо',
    notes: ['Шоколад', 'Орехи'],
    price: 1090,
    tone: 'forest',
    roast: 3,
    description:
      'Плотный и сбалансированный кофе с нотами шоколада, пралине и жареного фундука.',
  },
  {
    slug: 'colombia-huila',
    name: 'Колумбия Уила',
    shortName: 'Уила',
    country: 'Колумбия',
    method: 'Для фильтра',
    notes: ['Цитрусы', 'Карамель'],
    price: 1190,
    tone: 'gold',
    roast: 2,
    description:
      'Сладкий кофе с карамельным послевкусием и мягкой апельсиновой кислотностью.',
  },
  {
    slug: 'guatemala-antigua',
    name: 'Гватемала Антигуа',
    shortName: 'Антигуа',
    country: 'Гватемала',
    method: 'Эспрессо',
    notes: ['Какао', 'Красное яблоко'],
    price: 1190,
    tone: 'slate',
    roast: 4,
    description:
      'Объёмный вкус какао, красного яблока и пряностей с долгим сладким послевкусием.',
  },
  {
    slug: 'costa-rica-tarrazu',
    name: 'Коста-Рика Тарразу',
    shortName: 'Тарразу',
    country: 'Коста-Рика',
    method: 'Для фильтра',
    notes: ['Красные ягоды', 'Мёд'],
    price: 1290,
    tone: 'rose',
    roast: 2,
    description:
      'Шёлковистый кофе с медовой сладостью и вкусом спелых красных ягод.',
  },
  {
    slug: 'indonesia-sumatra',
    name: 'Индонезия Суматра',
    shortName: 'Суматра',
    country: 'Индонезия',
    method: 'Эспрессо',
    notes: ['Тёмный шоколад', 'Специи'],
    price: 1190,
    tone: 'moss',
    roast: 4,
    description:
      'Глубокий, пряный кофе с плотным телом и оттенками тёмного шоколада.',
  },
  {
    slug: 'kenya-nyeri',
    name: 'Кения Ньери',
    shortName: 'Ньери',
    country: 'Кения',
    method: 'Для фильтра',
    notes: ['Смородина', 'Грейпфрут'],
    price: 1390,
    tone: 'cocoa',
    roast: 2,
    description:
      'Яркий ягодный кофе с нотами чёрной смородины и сочного грейпфрута.',
  },
  {
    slug: 'peru-cajamarca',
    name: 'Перу Кахамарка',
    shortName: 'Кахамарка',
    country: 'Перу',
    method: 'Для турки',
    notes: ['Курага', 'Миндаль'],
    price: 1090,
    tone: 'sand',
    roast: 3,
    description: 'Мягкий, округлый кофе с нотами сухофруктов и миндаля.',
  },
];

export const articles = [
  {
    slug: 'how-to-choose',
    title: 'Как выбрать кофе под свой вкус',
    category: 'Советы',
    excerpt:
      'Разбираем страну происхождения, обжарку, способ обработки и вкусовой профиль.',
    image: '/images/hero-coffee.png',
  },
  {
    slug: 'what-shapes-taste',
    title: 'Что влияет на вкус',
    category: 'Зерно',
    excerpt:
      'Ключевые факторы — от региона и высоты произрастания до способа обработки.',
    image: '/images/article-beans.jpg',
  },
  {
    slug: 'filter-at-home',
    title: 'Фильтр дома',
    category: 'Заваривание',
    excerpt:
      'Простой гид по завариванию фильтр-кофе дома — с советами и пропорциями.',
    image: '/images/article-pourover.jpg',
  },
  {
    slug: 'how-to-store',
    title: 'Как хранить зерно',
    category: 'Советы',
    excerpt:
      'Несколько простых правил, чтобы кофе дольше оставался свежим и ароматным.',
    image: '/images/article-storage.jpg',
  },
  {
    slug: 'espresso-simple',
    title: 'Эспрессо без сложностей',
    category: 'Заваривание',
    excerpt:
      'Базовые параметры и практичные советы для вкусного эспрессо дома.',
    image: '/images/article-espresso.jpg',
  },
  {
    slug: 'coffee-rituals',
    title: 'Кофейные привычки',
    category: 'Советы',
    excerpt:
      'Небольшие ритуалы, которые помогают внимательнее наслаждаться кофе.',
    image: '/images/article-ritual.jpg',
  },
  {
    slug: 'coffee-origin',
    title: 'Как выбрать кофе',
    category: 'Зерно',
    excerpt:
      'Ориентируемся в сортах, регионах и вкусовых профилях, чтобы найти свой кофе.',
    image: '/images/coffee-farm.png',
  },
];
