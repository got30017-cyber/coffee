import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ProductCard } from '@/components/product-card';
import { ProductDetail } from '@/components/product-detail';
import { products } from '@/lib/store-data';

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/product/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  return {
    title: product?.name ?? 'Кофе',
    description: product?.description,
  };
}

export default async function ProductPage({
  params,
}: PageProps<'/product/[slug]'>) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const related = products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <main className="container product-page">
      <Breadcrumbs
        items={[
          { label: 'Каталог', href: '/catalog' },
          { label: 'Кофе', href: '/catalog' },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />
      <section className="section-block related-products">
        <div className="section-heading" data-reveal>
          <h2>Похожие товары</h2>
        </div>
        <div className="product-row" data-reveal>
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
