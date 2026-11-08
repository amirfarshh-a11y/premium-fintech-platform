import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Article } from '../lib/types';
import { useApi } from '../lib/hooks';
import { NewsExplorer } from '../components/NewsExplorer';
import { formatDate } from '../lib/format';

export default function News() {
  const insights = useApi<{ articles: Article[] }>('/content/insights');

  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">Financial news</span>
          <h1 className="h1">
            The newsroom, <span className="serif-italic gold-text">filtered</span>
          </h1>
          <p className="lede">
            Digital assets, global markets, regulation and blockchain infrastructure — reported by the Aurum desk.
            Search the archive or narrow by category.
          </p>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="news-layout">
            <NewsExplorer variant="list" />

            <aside className="stack stack-16">
              <div className="side-card">
                <span className="side-card__title">Desk note</span>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Aurum publishes editorial analysis only. We do not publish sponsored price predictions, and no
                  story on this page is investment advice.
                </p>
                <Link to="/about" className="article-card__link">
                  Our editorial standards <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="side-card">
                <span className="side-card__title">Latest research</span>
                <div className="stack stack-12">
                  {(insights.data?.articles || []).slice(0, 4).map((article) => (
                    <Link key={article.slug} to={`/insights/${article.slug}`} className="stack stack-4">
                      <strong style={{ fontSize: '0.86rem', lineHeight: 1.4 }}>{article.title}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                        {article.type} · {formatDate(article.date)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="side-card">
                <span className="side-card__title">Need the data?</span>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  Pair the newsroom with live pricing and range analytics.
                </p>
                <Link to="/markets" className="btn btn--ghost btn--sm btn--block">
                  Browse markets
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
