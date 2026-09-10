import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function StoryBanner() {
  return (
    <section className="story-banner" aria-label="История кофе" data-reveal>
      <div className="story-banner__media" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/images/story-mobile.png"
          />
          <img
            src="/images/story-desktop.png"
            alt=""
            width="2172"
            height="724"
            loading="lazy"
          />
        </picture>
      </div>
      <div className="story-banner__wash" aria-hidden="true" />
      <div className="story-banner__content">
        <h2>Кофе с историей</h2>
        <p>Зёрна от фермеров, которые вдохновляют</p>
      </div>
      <Link className="button button--light" href="/articles">
        Узнать больше <ArrowRight size={18} />
      </Link>
    </section>
  );
}
