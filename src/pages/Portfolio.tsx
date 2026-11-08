import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import type { Asset, Holding, MarketsResponse } from '../lib/types';
import { api } from '../lib/api';
import { useApi } from '../lib/hooks';
import { formatCurrency, formatPct, pctClass } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DashShell } from '../components/DashShell';
import { CoinMark } from '../components/CoinMark';
import { DataBadge } from '../components/DataBadge';
import { EmptyState, ErrorState, Skeleton } from '../components/States';

type Row = {
  holding: Holding;
  asset?: Asset;
  price: number;
  value: number;
  cost: number;
  pnl: number;
  pnlPct: number;
};

export default function Portfolio() {
  const { user } = useAuth();
  const toast = useToast();
  const [params] = useSearchParams();
  const markets = useApi<MarketsResponse>('/markets/cryptos', { refreshMs: 60_000 });
  const portfolio = useApi<{ holdings: Holding[] }>('/me/portfolio');
  const assets = markets.data?.assets || [];

  const [symbol, setSymbol] = useState(params.get('symbol') || 'BTC');
  const [quantity, setQuantity] = useState('');
  const [avgCost, setAvgCost] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [editForm, setEditForm] = useState({ quantity: '', avgCost: '' });

  const currency = user?.baseCurrency || 'USD';

  const rows: Row[] = useMemo(() => {
    const holdings = portfolio.data?.holdings || [];
    return holdings.map((holding) => {
      const asset = assets.find((item) => item.symbol === holding.symbol);
      const price = asset?.price ?? 0;
      const value = price * holding.quantity;
      const cost = holding.avgCost * holding.quantity;
      return {
        holding,
        asset,
        price,
        value,
        cost,
        pnl: value - cost,
        pnlPct: cost > 0 ? ((value - cost) / cost) * 100 : 0,
      };
    });
  }, [portfolio.data, assets]);

  const totalValue = rows.reduce((sum, row) => sum + row.value, 0);
  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
  const pnl = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  const dayPnl = rows.reduce((sum, row) => sum + (row.value * (row.asset?.change24h || 0)) / 100, 0);

  const selectedAsset = assets.find((asset) => asset.symbol === symbol);

  const addHolding = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const qty = Number(quantity);
    const cost = Number(avgCost);
    if (!Number.isFinite(qty) || qty <= 0) {
      setFormError('Quantity must be greater than zero.');
      return;
    }
    if (!Number.isFinite(cost) || cost < 0) {
      setFormError('Average cost must be zero or greater.');
      return;
    }
    setSaving(true);
    try {
      await api('/me/portfolio', { method: 'POST', body: { symbol, quantity: qty, avgCost: cost } });
      setQuantity('');
      setAvgCost('');
      portfolio.reload();
      toast.success(`${qty} ${symbol} added to your portfolio.`, 'Holding saved');
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    setEditForm({ quantity: String(row.holding.quantity), avgCost: String(row.holding.avgCost) });
  };

  const saveEdit = async () => {
    if (!editing) return;
    const qty = Number(editForm.quantity);
    const cost = Number(editForm.avgCost);
    if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(cost) || cost < 0) {
      toast.error('Enter a positive quantity and a valid average cost.');
      return;
    }
    try {
      await api(`/me/portfolio/${editing.holding.id}`, {
        method: 'PATCH',
        body: { quantity: qty, avgCost: cost },
      });
      setEditing(null);
      portfolio.reload();
      toast.success('Holding updated.', 'Saved');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const removeHolding = async (row: Row) => {
    try {
      await api(`/me/portfolio/${row.holding.id}`, { method: 'DELETE' });
      portfolio.reload();
      toast.success(`${row.holding.symbol} removed from your portfolio.`, 'Holding deleted');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <DashShell
      eyebrow="Portfolio tracker"
      title={
        <>
          Your <span className="serif-italic gold-text">positions</span>, marked to market
        </>
      }
      lede="Values update against the live market feed. Average cost is what you tell us — nothing is inferred."
      actions={<DataBadge source={markets.data?.source} provider={markets.data?.provider} updatedAt={markets.data?.updatedAt} />}
    >
      <div className="dash-cards">
        <div className="mini-stat">
          <label>Market value</label>
          <b>{formatCurrency(totalValue, currency)}</b>
          <span>
            {rows.length} {rows.length === 1 ? 'position' : 'positions'}
          </span>
        </div>
        <div className="mini-stat">
          <label>Cost basis</label>
          <b>{formatCurrency(totalCost, currency)}</b>
          <span>Weighted average</span>
        </div>
        <div className="mini-stat">
          <label>Unrealised P&amp;L</label>
          <b className={pctClass(pnl)}>{formatCurrency(pnl, currency)}</b>
          <span className={pctClass(pnlPct)}>{formatPct(pnlPct)}</span>
        </div>
        <div className="mini-stat">
          <label>Today</label>
          <b className={pctClass(dayPnl)}>{formatCurrency(dayPnl, currency)}</b>
          <span>From 24h moves</span>
        </div>
      </div>

      <div className="card card--pad stack stack-16">
        <div className="row row--between row--wrap">
          <div className="stack stack-4">
            <span className="panel-label">Add or top up a holding</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Buying more of the same asset blends your average cost automatically.
            </span>
          </div>
          {selectedAsset ? (
            <span className="badge">
              {selectedAsset.symbol} · {formatCurrency(selectedAsset.price)}
            </span>
          ) : null}
        </div>

        <form onSubmit={addHolding} className="stack stack-12">
          <div className="form-grid" style={{ gridTemplateColumns: '1.2fr 1fr 1fr auto', alignItems: 'end' }}>
            <div className="field">
              <label className="field__label" htmlFor="holding-asset">Asset</label>
              <select
                id="holding-asset"
                className="select"
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
              >
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.symbol}>
                    {asset.symbol} — {asset.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="holding-qty">Quantity</label>
              <input
                id="holding-qty"
                className="input"
                inputMode="decimal"
                placeholder="0.25"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="holding-cost">Average cost (USD)</label>
              <input
                id="holding-cost"
                className="input"
                inputMode="decimal"
                placeholder={selectedAsset ? String(selectedAsset.price) : '0.00'}
                value={avgCost}
                onChange={(event) => setAvgCost(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn--gold" disabled={saving}>
              <Plus size={15} /> {saving ? 'Saving…' : 'Add'}
            </button>
          </div>
          {formError && <span className="field__error">{formError}</span>}
        </form>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card__hairline" />
        <div className="row row--between" style={{ padding: '16px 18px' }}>
          <span className="panel-label">Holdings</span>
          {totalValue > 0 ? (
            <span style={{ fontSize: '0.76rem', color: 'var(--text-faint)' }}>Allocation by market value</span>
          ) : null}
        </div>

        {portfolio.error ? (
          <div style={{ padding: 20 }}>
            <ErrorState message={portfolio.error} onRetry={portfolio.reload} />
          </div>
        ) : portfolio.loading && !portfolio.data ? (
          <div className="stack stack-8" style={{ padding: 20 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="skeleton--text" style={{ height: 46 }} />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 20 }}>
            <EmptyState
              title="Your portfolio is empty"
              body="Add a position above to start tracking value, cost basis and unrealised P&L. Prices come from the live market feed."
              action={
                <Link to="/markets" className="btn btn--ghost btn--sm">
                  Browse markets first
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {rows.map((row) => (
              <div className="holding-row" key={row.holding.id}>
                <div className="holding-row__asset">
                  <Link to={`/markets/${row.asset?.id || ''}`} className="asset-cell">
                    <CoinMark symbol={row.holding.symbol} color={row.asset?.color} size="sm" />
                    <span>
                      <span className="asset-cell__name">{row.asset?.name || row.holding.symbol}</span>
                      <span className="asset-cell__ticker">{row.holding.symbol}</span>
                    </span>
                  </Link>
                </div>
                <div>
                  <span className="holding-row__label">Quantity</span>
                  <span className="mono">{row.holding.quantity}</span>
                </div>
                <div>
                  <span className="holding-row__label">Avg cost</span>
                  <span className="mono">{formatCurrency(row.holding.avgCost, currency)}</span>
                </div>
                <div>
                  <span className="holding-row__label">Price</span>
                  <span className="mono">{formatCurrency(row.price, currency)}</span>
                </div>
                <div>
                  <span className="holding-row__label">Value</span>
                  <span className="mono" style={{ fontWeight: 600 }}>{formatCurrency(row.value, currency)}</span>
                </div>
                <div>
                  <span className="holding-row__label">P&amp;L</span>
                  <span className={pctClass(row.pnlPct)} style={{ fontSize: '0.82rem' }}>
                    {formatCurrency(row.pnl, currency)} ({formatPct(row.pnlPct)})
                  </span>
                </div>
                <div className="holding-row__actions row" style={{ gap: 6 }}>
                  <button type="button" className="icon-btn" onClick={() => openEdit(row)} aria-label="Edit holding">
                    <Pencil size={14} />
                  </button>
                  <button type="button" className="icon-btn" onClick={() => removeHolding(row)} aria-label="Delete holding">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <div className="stack stack-8" style={{ padding: '16px 18px' }}>
              {rows
                .slice()
                .sort((a, b) => b.value - a.value)
                .map((row) => (
                  <div key={`alloc-${row.holding.id}`} className="stack stack-4">
                    <div className="row row--between" style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <span>{row.holding.symbol}</span>
                      <span>{totalValue > 0 ? `${((row.value / totalValue) * 100).toFixed(1)}%` : '—'}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: 'rgba(176,187,214,0.12)' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${totalValue > 0 ? (row.value / totalValue) * 100 : 0}%`,
                          borderRadius: 999,
                          background: 'var(--grad-gold)',
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      {editing ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setEditing(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Edit holding" onClick={(event) => event.stopPropagation()}>
            <div className="modal__head">
              <div>
                <span className="panel-label">Edit position</span>
                <h3 className="h3" style={{ marginTop: 4 }}>{editing.asset?.name || editing.holding.symbol}</h3>
              </div>
              <button type="button" className="icon-btn" onClick={() => setEditing(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="modal__body">
              <div className="field">
                <label className="field__label" htmlFor="edit-qty">Quantity</label>
                <input
                  id="edit-qty"
                  className="input"
                  inputMode="decimal"
                  value={editForm.quantity}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, quantity: event.target.value }))}
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="edit-cost">Average cost (USD)</label>
                <input
                  id="edit-cost"
                  className="input"
                  inputMode="decimal"
                  value={editForm.avgCost}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, avgCost: event.target.value }))}
                />
              </div>
            </div>
            <div className="modal__foot">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn--gold btn--sm" onClick={saveEdit}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashShell>
  );
}
