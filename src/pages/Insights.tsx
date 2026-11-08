import { useState } from 'react';
import type { Article } from '../lib/types';
import { useApi } from '../lib/hooks';
import { ArticleCard } from '../components/ArticleCard';
import { EmptyState, ErrorState, Skeleton } from '../components/States';

export default function Insights() {
  const { data, loading, error, reload } = useApi<{ articles: Article[]; types: string[] }>(
    '/content/insights',
  );
  const [type, setType] = useState('All');

  const types = data?.types || ['All'];
  const articles = (data?.articles || []).filter((article) => type === 'All' || article.type === type);

  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">Market insights &amp; analysis</span>
          <h1 className="h1">
            Conviction needs a <span className="serif-italic gold-text">method</span>
          </h1>
          <p className="lede">
            Technical and fundamental analysis, positioning work and macro commentary from the Aurum research desk.
            Every piece states its framework and its invalidation.
          </p>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="chip-row" role="group" aria-label="Filter insight type" style={{ marginBottom: 24 }}>
            {types.map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                aria-pressed={type === item}
                onClick={() => setType(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {error ? (
            <ErrorState message={error} onRetry={reload} title="Research unavailable" />
          ) : loading && !data ? (
            <div className="grid grid--3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="skeleton--block" style={{ height: 340 }} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <EmptyState
              title="No research in this category yet"
              body="Try another analysis type — technical and macro pieces are published most weeks."
            />
          ) : (
            <div className="grid grid--3">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} section="insights" />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
