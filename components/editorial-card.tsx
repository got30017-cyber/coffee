import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function EditorialCard({
  title,
  category,
  image,
  excerpt,
}: {
  title: string;
  category: string;
  image: string;
  excerpt?: string;
}) {
  return (
    <article className="editorial-card" data-reveal>
      <div className="editorial-card__image">
        <Image src={image} alt="" fill sizes="(max-width: 768px) 82vw, 30vw" />
      </div>
      <div className="editorial-card__body">
        <span>{category}</span>
        <h3>{title}</h3>
        {excerpt && <p>{excerpt}</p>}
        <Link href="/articles">
          Читать <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
