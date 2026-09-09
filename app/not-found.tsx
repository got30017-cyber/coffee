import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="container not-found">
      <p className="eyebrow">Ошибка 404</p>
      <h1>Такой страницы нет</h1>
      <p>Зато в каталоге есть свежий кофе.</p>
      <Link className="button button--dark" href="/catalog">
        Перейти в каталог <ArrowRight size={18} />
      </Link>
    </main>
  );
}
