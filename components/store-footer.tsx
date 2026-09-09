import Link from 'next/link';
import { Brand } from '@/components/store-header';

export function StoreFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__main">
        <Brand />
        <nav aria-label="Навигация в подвале">
          <Link href="/catalog">Каталог</Link>
          <a href="#delivery">Доставка</a>
          <Link href="/checkout">Оплата</Link>
          <a href="#about">О нас</a>
          <a href="mailto:hello@svetly-coffee.ru">Контакты</a>
        </nav>
        <div className="footer-social" aria-label="Социальные сети">
          <a href="#vk">VK</a>
          <a href="#telegram">TG</a>
          <a href="#youtube">YT</a>
        </div>
        <p className="footer-motto">
          Хороший кофе
          <br />
          делает мир светлее
        </p>
      </div>
      <div className="container site-footer__bottom">
        <span>© 2026 Светлый Кофе. Все права защищены.</span>
        <span>
          Сделано с <b>♥</b> для любителей кофе
        </span>
      </div>
    </footer>
  );
}
