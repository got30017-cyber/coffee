import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { CheckoutForm } from '@/components/checkout-form';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Оформление демонстрационного заказа в магазине Светлый Кофе.',
};

export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Оформление заказа' }]} />
        <header className="checkout-header">
          <h1>Оформление заказа</h1>
          <p>Ещё немного — и вкусный кофе будет у вас!</p>
        </header>
        <CheckoutForm />
      </div>
    </main>
  );
}
