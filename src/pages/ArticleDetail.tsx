import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, UserRound } from 'lucide-react';
import type { Article } from '../lib/types';
import { useApi } from '../lib/hooks';
import { ArticleArt, ArticleCard } from '../components/ArticleCard';
import { ErrorState, Skeleton } from '../components/States';
import { formatDate } from '../lib/format';

export default function ArticleDetail() {
  const { slug = '' } = useParams();
  const { data, loading, error, reload } = useApi<{ article: Article }>(`/content/news/${slug}`);
  const article = data?.article;
  const isInsight = Boolean(article?.type);
  const section = isInsight ? 'insights' : 'news';

  const related = useApi<{ articles: Article[] }>(article ? `/content/${section}` : null);

  if (error) {
    return (
      <div className="container" style={{ paddingTop: 160, paddingBottom: 120 }}>
        <ErrorState title="We could not find that article" message={error} onRetry={reload} />
        <div style={{ marginTop: 20 }}>
          <Link to="/news" className="btn btn--ghost">
            <ArrowLeft size={15} /> Back to the newsroom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="page-head" style={{ paddingTop: 'clamp(120px, 14vh, 160px)' }}>
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner" style={{ maxWidth: 860 }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden>/</span>
            <Link to={isInsight ? '/insights' : '/news'}>{isInsight ? 'Insights' : 'News'}</Link>
            <span aria-hidden>/</span>
            <span style={{ color: 'var(--gold-200)' }}>{article?.category || article?.type || 'Article'}</span>
          </div>

          {loading && !article ? (
            <div className="stack stack-16">
              <Skeleton className="skeleton--title" style={{ width: '80%', height: 44 }} />
              <Skeleton className="skeleton--text" style={{ width: '60%' }} />
            </div>
          ) : article ? (
            <>
              <span className="badge badge--gold">{article.category || article.type}</span>
              <h1 className="h1" style={{ fontSize: 'clamp(2rem, 4vw, 3.3rem)' }}>
                {article.title}
              </h1>
              <p className="lede" style={{ maxWidth: '64ch' }}>{article.dek}</p>
              <div className="row row--wrap" style={{ gap: 18, fontSize: '0.8rem', color: 'var(--text-faint)' }}>
                <span className="row" style={{ gap: 6 }}>
                  <UserRound size={14} /> {article.author} · {article.role}
                </span>
                <span>{formatDate(article.date, 'long')}</span>
                <span className="row" style={{ gap: 6 }}>
                  <Clock3 size={14} /> {article.readMinutes} min read
                </span>
              </div>
            </>
          ) : null}
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          {article ? (
            <>
              <ArticleArt art={article.art} label={article.category || article.type} className="article-hero" />
              <div className="article-layout">
                <article className="article-body">
                  {(article.body || []).map((block, index) => {
                    const key = `${block.type}-${index}`;
                    if (block.type === 'h2') return <h2 key={key}>{block.text}</h2>;
                    if (block.type === 'quote') return <blockquote key={key}>{block.text}</blockquote>;
                    return <p key={key}>{block.text}</p>;
                  })}

                  <div className="divider" style={{ marginBlock: 12 }} />
                  <div className="card card--pad" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <span className="avatar avatar--lg" aria-hidden>
                      {article.author
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <div className="stack stack-4">
                      <strong>{article.author}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{article.role}</span>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-faint)', lineHeight: 1.65 }}>
                        Writes for the Aurum research desk. Views are the author&apos;s own and do not constitute
                        investment advice.
                      </p>
                    </div>
                  </div>

                  <Link to={isInsight ? '/insights' : '/news'} className="btn btn--ghost btn--sm" style={{ width: 'fit-content' }}>
                    <ArrowLeft size={14} /> {isInsight ? 'All insights' : 'Back to the newsroom'}
                  </Link>
                </article>

                <aside className="stack stack-16">
                  <div className="side-card">
                    <span className="side-card__title">Keep reading</span>
                    <div className="stack stack-12">
                      {(related.data?.articles || [])
                        .filter((item) => item.slug !== article.slug)
                        .slice(0, 3)
                        .map((item) => (
                          <Link key={item.slug} to={`/${section}/${item.slug}`} className="stack stack-4">
                            <strong style={{ fontSize: '0.86rem', lineHeight: 1.4 }}>{item.title}</strong>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                              {formatDate(item.date)} · {item.readMinutes} min
                            </span>
                          </Link>
                        ))}
                    </div>
                  </div>
                  <div className="side-card">
                    <span className="side-card__title">Put it to work</span>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                      Track the assets discussed here in your watchlist, or model a position in the portfolio
                      tracker.
                    </p>
                    <Link to="/markets" className="btn btn--gold btn--sm btn--block">
                      Explore markets
                    </Link>
                  </div>
                </aside>
              </div>

              {(related.data?.articles || []).length > 0 ? (
                <div style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
                  <div className="section-head" style={{ marginBottom: 20 }}>
                    <div className="section-head__text">
                      <span className="eyebrow">More from the desk</span>
                    </div>
                  </div>
                  <div className="grid grid--3">
                    {(related.data?.articles || [])
                      .filter((item) => item.slug !== article.slug)
                      .slice(0, 3)
                      .map((item) => (
                        <ArticleCard key={item.slug} article={item} section={section as 'news' | 'insights'} />
                      ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <Skeleton className="skeleton--block" style={{ height: 400 }} />
          )}
        </div>
      </section>
    </>
  );
}
