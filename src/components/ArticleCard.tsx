import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Article } from '../lib/types';
import { formatDate } from '../lib/format';

export function ArticleArt({
  art,
  label,
  className = '',
}: {
  art: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`art art--${art} ${className}`.trim()}>
      <svg className="art__motif" viewBox="0 0 200 120" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 96 L24 80 L44 88 L66 62 L88 70 L112 44 L136 54 L158 28 L182 36 L200 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M0 96 L24 80 L44 88 L66 62 L88 70 L112 44 L136 54 L158 28 L182 36 L200 16 L200 120 L0 120 Z"
          fill="currentColor"
          opacity="0.12"
        />
        {[40, 80, 120, 160].map((x, i) => (
          <rect
            key={x}
            x={x}
            y={72 - i * 12}
            width="6"
            height={26 + i * 8}
            fill="currentColor"
            opacity="0.16"
          />
        ))}
      </svg>
      {label ? <span className="art__label">{label}</span> : null}
    </div>
  );
}

export function ArticleCard({
  article,
  section = 'news',
  compact = false,
}: {
  article: Article;
  section?: 'news' | 'insights';
  compact?: boolean;
}) {
  const href = `/${section}/${article.slug}`;
  return (
    <article className="article-card">
      <Link to={href} aria-label={article.title}>
        <ArticleArt art={article.art} label={article.category || article.type} className="article-card__media" />
      </Link>
      <div className="article-card__body">
        <div className="article-card__meta">
          <span>{article.category || article.type}</span>
          <span aria-hidden>•</span>
          <span>{formatDate(article.date)}</span>
          {!compact ? (
            <>
              <span aria-hidden>•</span>
              <span>{article.readMinutes} min read</span>
            </>
          ) : null}
        </div>
        <h3 className="article-card__title">
          <Link to={href}>{article.title}</Link>
        </h3>
        {!compact && <p className="article-card__dek">{article.dek}</p>}
        <Link to={href} className="article-card__link">
          Read more <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
