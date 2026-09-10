'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BLOG_CATEGORIES, getBlogPosts, type BlogCategory } from '@/content/blog';
import { MarketingFrame } from '@/components/marketing/MarketingFrame';
import b from './blog.module.css';

export function BlogIndex() {
  const posts = getBlogPosts();
  const [filter, setFilter] = useState<(typeof BLOG_CATEGORIES)[number]>('All');

  const visible = useMemo(() => {
    if (filter === 'All') return posts;
    return posts.filter((p) => p.category === (filter as BlogCategory));
  }, [filter, posts]);

  return (
    <MarketingFrame navScrolled>
      <div className={b.page}>
        <header className={b.hero}>
          <p className={b.kicker}>Resources</p>
          <h1 className={b.title}>RunMyPG Blog</h1>
          <p className={b.lead}>
            Guides for Indian PG and hostel owners — occupancy, rent collection, deposits and software
            that stays out of the way.
          </p>
        </header>

        <div className={b.filters} role="tablist" aria-label="Blog categories">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              className={`${b.filter} ${filter === cat ? b.filterOn : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={b.grid}>
          {visible.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={b.card}>
              <div className={b.cardMeta}>
                <span>{post.category}</span>
                <span>{post.readMins} min</span>
              </div>
              <h2 className={b.cardTitle}>{post.title}</h2>
              <p className={b.cardDesc}>{post.description}</p>
              <span className={b.cardMore}>Read guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </MarketingFrame>
  );
}
