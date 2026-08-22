'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function CardRow({ card, onSaved, onDeleted }) {
  const [shopName, setShopName] = useState(card.shop_name || '');
  const [reviewLink, setReviewLink] = useState(card.review_link || '');
  const [saving, setSaving] = useState(false);

  const isActive = Boolean(card.review_link);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/cards/${card.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop_name: shopName, review_link: reviewLink }),
    });
    setSaving(false);
    if (res.ok) {
      const { card: updated } = await res.json();
      onSaved(updated);
    }
  }

  async function remove() {
    if (!confirm(`Remove card ${card.id}? This can't be undone.`)) return;
    const res = await fetch(`/api/cards/${card.id}`, { method: 'DELETE' });
    if (res.ok) onDeleted(card.id);
  }

  return (
    <div className="hl-row">
      <div>
        <div className="hl-card-id">#{card.id}</div>
        <span className={`hl-chip ${isActive ? 'active' : 'pending'}`}>
          {isActive ? 'active' : 'pending'}
        </span>
      </div>
      <input
        className="hl-input"
        placeholder="Shop name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
      />
      <input
        className="hl-input"
        placeholder="Google review link"
        value={reviewLink}
        onChange={(e) => setReviewLink(e.target.value)}
      />
      <div className="hl-scan-count">{card.scan_count || 0} scans</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="hl-btn-ghost save" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button className="hl-btn-ghost" onClick={remove}>Remove</button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [cards, setCards] = useState([]);
  const [newId, setNewId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastPing, setLastPing] = useState(null);
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  useEffect(() => {
    fetch('/api/cards')
      .then((r) => r.json())
      .then((d) => {
        setCards(d.cards || []);
        setLoading(false);
      });
    fetch('/api/status')
      .then((r) => r.json())
      .then((d) => setLastPing(d.last_ping));
  }, []);

  async function addCard(e) {
    e.preventDefault();
    if (!newId.trim()) return;
    setError('');
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newId.trim() }),
    });
    if (res.ok) {
      const { card } = await res.json();
      setCards((prev) => [card, ...prev]);
      setNewId('');
    } else {
      const { error } = await res.json();
      setError(error || 'Could not add that card number.');
    }
  }

  const activeCount = cards.filter((c) => c.review_link).length;

  function pingStatus() {
    if (!lastPing) return { label: 'No ping recorded yet', level: 'pending' };
    const hoursAgo = (Date.now() - new Date(lastPing).getTime()) / 3600000;
    const label =
      hoursAgo < 1
        ? 'Checked in less than an hour ago'
        : hoursAgo < 48
        ? `Checked in ${Math.round(hoursAgo)}h ago`
        : `Checked in ${Math.round(hoursAgo / 24)}d ago`;
    return { label, level: hoursAgo < 48 ? 'active' : 'pending' };
  }
  const ping = pingStatus();

  return (
    <main className="hl-shell">
      <div className="hl-header">
        <div>
          <p className="hl-eyebrow">Card Admin</p>
          <h1 className="hl-title">Your QR cards</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className={`hl-chip ${ping.level}`}>DB: {ping.label}</span>
          <div className="hl-count">{activeCount} active · {cards.length} total</div>
          <button className="hl-btn-ghost" onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <form className="hl-add-row" onSubmit={addCard}>
        <input
          className="hl-input"
          placeholder="New card number (e.g. 001)"
          value={newId}
          onChange={(e) => setNewId(e.target.value)}
        />
        <button className="hl-btn" type="submit">Add card</button>
      </form>
      {error && <p className="hl-error">{error}</p>}

      {loading ? (
        <p style={{ color: 'var(--muted)' }}>Loading…</p>
      ) : cards.length === 0 ? (
        <div className="hl-empty">
          No cards yet. Add your first card number above — this is the number
          that goes on the physical card before you assign it to a shop.
        </div>
      ) : (
        <div className="hl-table">
          {cards.map((card) => (
            <CardRow
              key={card.id}
              card={card}
              onSaved={(updated) =>
                setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
              }
              onDeleted={(id) => setCards((prev) => prev.filter((c) => c.id !== id))}
            />
          ))}
        </div>
      )}
    </main>
  );
}
