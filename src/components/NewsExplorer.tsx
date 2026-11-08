import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { Article } from '../lib/types';
import { useApi } from '../lib/hooks';
import { ArticleCard } from './ArticleCard';
import { EmptyState, ErrorState, Skeleton } from './States';

type NewsResponse = { articles: Article[]; categories: string[] };

export function NewsExplorer({
  variant = 'grid',
  limit,
}: {
  variant?: 'grid' | 'list';
  limit?: number;
}) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 240);
    return () => window.clearTimeout(timer);
  }, [query]);

  const { data, loading, error, reload } = useApi<NewsResponse>(
    `/content/news?category=${encodeURIComponent(category)}&q=${encodeURIComponent(debounced.trim())}`,
  );

  const categories = data?.categories || ['All', 'Crypto', 'Global Markets', 'Market Updates', 'Blockchain', 'Regulation'];
  const articles = (data?.articles || []).slice(0, limit ?? 99);

  return (
    <div className="stack stack-24">
      <div className="row row--between row--wrap" style={{ gap: 16 }}>
        <div className="chip-row" role="group" aria-label="Filter news by category">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className="chip"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="search" style={{ minWidth: 240, flex: '0 1 300px' }}>
          <span className="search__icon">
            <Search size={15} />
          </span>
          <span className="visually-hidden">Search news</span>
          <input
            className="input"
            type="search"
            placeholder="Search headlines, topics…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={reload} title="Newsroom unavailable" />
      ) : loading && !data ? (
        <div className={variant === 'grid' ? 'grid grid--3' : 'news-list'}>
          {Array.from({ length: variant === 'grid' ? 3 : 4 }).map((_, index) => (
            <div className="card card--pad stack stack-12" key={index}>
              <Skeleton className="skeleton--block" style={{ height: variant === 'grid' ? 132 : 84 }} />
              <Skeleton className="skeleton--title" style={{ width: '82%' }} />
              <Skeleton className="skeleton--text" style={{ width: '64%' }} />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          title="No stories match that search"
          body={
            debounced
              ? `We could not find coverage for “${debounced}”. Try a broader term or another category.`
              : 'There are no stories in this category yet.'
          }
          icon={<Search size={20} />}
          action={
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Clear filters
            </button>
          }
        />
      ) : variant === 'list' ? (
        <div className="news-list">
          {articles.map((article) => (
            <article className="news-row" key={article.slug}>
              <Link to={`/news/${article.slug}`} className="news-row__media art art--gold" aria-label={article.title}>
                <ArticleArtForRow art={article.art} />
              </Link>
              <div className="news-row__body">
                <div className="article-card__meta">
                  <span>{article.category}</span>
                  <span aria-hidden>•</span>
                  <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3>
                  <Link to={`/news/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="article-card__dek" style={{ WebkitLineClamp: 2 }}>
                  {article.dek}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid--3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      {variant === 'grid' && articles.length > 0 ? (
        <div className="row row--between row--wrap" style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
          <span>
            {articles.length} {articles.length === 1 ? 'story' : 'stories'}
            {debounced ? ` matching “${debounced}”` : ''}
          </span>
          <Link to="/news" className="btn btn--ghost btn--sm">
            Open the newsroom
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function ArticleArtForRow({ art }: { art: string }) {
  return (
    <div className={`art art--${art}`} style={{ height: '100%', borderRadius: 'var(--r-md)' }} aria-hidden>
      <svg className="art__motif" viewBox="0 0 200 120" preserveAspectRatio="none">
        <path
          d="M0 96 L24 80 L44 88 L66 62 L88 70 L112 44 L136 54 L158 28 L182 36 L200 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}
