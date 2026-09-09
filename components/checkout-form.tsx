'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import {
  Banknote,
  Check,
  CreditCard,
  Heart,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react';

type CartLine = {
  name: string;
  price: number;
  tone: string;
  quantity: number;
};

const initialLines: CartLine[] = [
  { name: 'Эфиопия Сидамо', price: 1190, tone: 'clay', quantity: 1 },
  { name: 'Бразилия Сантос', price: 1090, tone: 'forest', quantity: 1 },
];

export function CheckoutForm() {
  const [delivery, setDelivery] = useState<'courier' | 'pickup'>('courier');
  const [payment, setPayment] = useState<'online' | 'cash'>('online');
  const [lines, setLines] = useState(initialLines);
  const [submitted, setSubmitted] = useState(false);

  const deliveryPrice = delivery === 'courier' ? 200 : 0;
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  );
  const total = subtotal + deliveryPrice;

  const updateQuantity = (index: number, delta: number) => {
    setLines((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index
          ? { ...line, quantity: Math.max(1, line.quantity + delta) }
          : line,
      ),
    );
  };

  const removeLine = (index: number) =>
    setLines((current) =>
      current.filter((_, lineIndex) => lineIndex !== index),
    );

  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <section className="checkout-success">
        <span>
          <Check size={32} />
        </span>
        <p className="eyebrow">Заказ принят</p>
        <h1>Спасибо!</h1>
        <p>
          Мы подготовим кофе и скоро уточним детали доставки. Это
          демонстрационный checkout — оплата не списывалась.
        </p>
        <button
          className="button button--dark"
          onClick={() => setSubmitted(false)}
        >
          Вернуться к оформлению
        </button>
      </section>
    );
  }

  return (
    <form className="checkout-grid" onSubmit={submit}>
      <div className="checkout-steps">
        <CheckoutSection number="1" title="Контакты">
          <label className="field field--wide">
            <span>Имя *</span>
            <input
              name="name"
              autoComplete="name"
              defaultValue="Иван"
              required
            />
          </label>
          <label className="field">
            <span>Телефон *</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue="+7 (915) 123-45-67"
              required
            />
          </label>
          <label className="field">
            <span>E-mail *</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              defaultValue="ivan@pochta.ru"
              required
            />
          </label>
        </CheckoutSection>

        <CheckoutSection number="2" title="Доставка">
          <ChoiceCard
            checked={delivery === 'courier'}
            onChange={() => setDelivery('courier')}
            icon={<Truck />}
            title="Курьером"
            note="Доставим домой или в офис"
            name="delivery"
          />
          <ChoiceCard
            checked={delivery === 'pickup'}
            onChange={() => setDelivery('pickup')}
            icon={<MapPin />}
            title="Пункт выдачи"
            note="Заберите в удобное время"
            name="delivery"
          />
        </CheckoutSection>

        <CheckoutSection number="3" title="Адрес">
          <label className="field field--wide">
            <span>Город *</span>
            <select name="city" defaultValue="Москва" required>
              <option>Москва</option>
              <option>Санкт-Петербург</option>
              <option>Казань</option>
              <option>Екатеринбург</option>
            </select>
          </label>
          <label className="field field--wide">
            <span>Адрес *</span>
            <input
              name="address"
              autoComplete="street-address"
              defaultValue="ул. Ленинская, д. 12, кв. 34"
              required
            />
          </label>
          <label className="field field--third">
            <span>Подъезд</span>
            <input name="entrance" defaultValue="1" />
          </label>
          <label className="field field--third">
            <span>Этаж</span>
            <input name="floor" defaultValue="4" />
          </label>
          <label className="field field--third">
            <span>Квартира</span>
            <input name="flat" defaultValue="34" />
          </label>
          <label className="field field--wide">
            <span>Комментарий к заказу</span>
            <textarea
              name="comment"
              placeholder="Например, код домофона или удобное время доставки"
            />
          </label>
        </CheckoutSection>

        <CheckoutSection number="4" title="Оплата">
          <ChoiceCard
            checked={payment === 'online'}
            onChange={() => setPayment('online')}
            icon={<CreditCard />}
            title="Онлайн-оплата"
            note="Картой на сайте"
            name="payment"
          />
          <ChoiceCard
            checked={payment === 'cash'}
            onChange={() => setPayment('cash')}
            icon={<Banknote />}
            title="При получении"
            note="Картой или наличными"
            name="payment"
          />
          <button
            className="button button--dark checkout-submit"
            type="submit"
            disabled={!lines.length}
          >
            Оформить заказ · {total.toLocaleString('ru-RU')} ₽
          </button>
          <p className="checkout-security">
            <ShieldCheck size={15} /> Ваши данные защищены. Оплата на этом этапе
            не списывается.
          </p>
        </CheckoutSection>
      </div>

      <div className="checkout-aside">
        <aside className="order-summary">
          <div className="order-summary__header">
            <h2>Ваш заказ</h2>
            <span>{lines.length} товара</span>
          </div>
          <div className="order-lines">
            {lines.map((line, index) => (
              <article className="order-line" key={line.name}>
                <div className={`order-line__image tone-${line.tone}`}>
                  <Image
                    src="/images/coffee-bag.png"
                    alt=""
                    width={90}
                    height={90}
                    loading="eager"
                  />
                </div>
                <div className="order-line__content">
                  <strong>{line.name}</strong>
                  <small>250 г · Зерно</small>
                  <b>{line.price.toLocaleString('ru-RU')} ₽</b>
                </div>
                <button
                  className="order-line__remove"
                  type="button"
                  aria-label={`Удалить ${line.name}`}
                  onClick={() => removeLine(index)}
                >
                  <X size={17} />
                </button>
                <div className="quantity-control quantity-control--small">
                  <button
                    type="button"
                    onClick={() => updateQuantity(index, -1)}
                    aria-label="Уменьшить количество"
                  >
                    <Minus size={15} />
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(index, 1)}
                    aria-label="Увеличить количество"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <strong className="order-line__total">
                  {(line.price * line.quantity).toLocaleString('ru-RU')} ₽
                </strong>
              </article>
            ))}
          </div>
          {lines.length ? (
            <>
              <dl className="order-totals">
                <div>
                  <dt>Товары ({lines.length})</dt>
                  <dd>{subtotal.toLocaleString('ru-RU')} ₽</dd>
                </div>
                <div>
                  <dt>Доставка</dt>
                  <dd>{deliveryPrice ? `${deliveryPrice} ₽` : 'Бесплатно'}</dd>
                </div>
                <div className="order-totals__grand">
                  <dt>Итого</dt>
                  <dd>{total.toLocaleString('ru-RU')} ₽</dd>
                </div>
              </dl>
              <div className="order-thanks">
                <Heart size={28} />
                <p>
                  <strong>Спасибо, что выбираете Светлый Кофе!</strong>
                  <span>
                    Вы поддерживаете небольших фермеров и вдохновляете нас
                    делать кофе ещё лучше.
                  </span>
                </p>
              </div>
              <div className="order-image">
                <Image
                  src="/images/coffee-farm.png"
                  alt="Кофейная плантация"
                  fill
                  loading="eager"
                  sizes="500px"
                />
                <p className="order-image__handwritten" aria-hidden="true">
                  Хороший день
                  <br />
                  начинается
                  <br />
                  с хорошего кофе
                </p>
              </div>
            </>
          ) : (
            <div className="empty-state empty-state--small">
              <h2>Корзина пуста</h2>
              <p>Вернитесь в каталог и добавьте кофе.</p>
            </div>
          )}
        </aside>

        <div className="checkout-benefits">
          <span>
            <PackageCheck size={27} />
            <strong>Свежая обжарка</strong>
            <small>Каждую неделю</small>
          </span>
          <span>
            <Truck size={27} />
            <strong>Надёжная доставка</strong>
            <small>По всей России</small>
          </span>
          <span>
            <Heart size={27} />
            <strong>Забота в деталях</strong>
            <small>Всегда поможем</small>
          </span>
        </div>
      </div>
    </form>
  );
}

function CheckoutSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="checkout-section">
      <div className="checkout-section__title">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      <div className="checkout-section__content">{children}</div>
    </section>
  );
}

function ChoiceCard({
  checked,
  onChange,
  icon,
  title,
  note,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
  title: string;
  note: string;
  name: string;
}) {
  return (
    <label className={`choice-card ${checked ? 'is-active' : ''}`}>
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span className="choice-card__icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        <strong>{title}</strong>
        <small>{note}</small>
      </span>
      <i aria-hidden="true" />
    </label>
  );
}
