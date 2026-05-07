import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function News() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'News & Events | Trinergy Comm-THA';
    axios.get('/api/news')
      .then(r => { setItems(r.data); setFiltered(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = items;
    if (activeCategory !== 'all') result = result.filter(i => i.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) || i.excerpt?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeCategory, search, items]);

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  const CATS = [
    { key: 'all', label: 'All' },
    { key: 'news', label: 'News' },
    { key: 'event', label: 'Event' },
  ];

  return (
    <div style={{ paddingTop: 64, background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg,#0d1a0f 0%,#0a0a0a 100%)',
        borderBottom: '1px solid #262626',
        padding: '60px 0 40px',
      }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: '0.75rem', color: '#737373',
            marginBottom: 12, fontFamily: 'var(--font-mono)',
          }}>
            <Link to="/" style={{ color: '#737373', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#4ade80' }}>News &amp; Events</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: 12 }}>
            News &amp; Events
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', maxWidth: 500 }}>
            Latest news, events, and milestones from Trinergy Comm-THA.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 520,
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: 8,
            padding: '10px 16px',
            color: '#f5f5f5',
            fontSize: '0.9rem',
            outline: 'none',
            marginBottom: 24,
            boxSizing: 'border-box',
          }}
        />

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              style={{
                padding: '8px 20px',
                borderRadius: 100,
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: activeCategory === c.key ? '1px solid #4ade80' : '1px solid #262626',
                backgroundColor: activeCategory === c.key ? 'rgba(74,222,128,0.12)' : 'transparent',
                color: activeCategory === c.key ? '#4ade80' : '#a3a3a3',
                transition: 'all 0.2s',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a3a3a3' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#737373' }}>No articles found.</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 28,
          }}>
            {filtered.map(item => (
              <NewsCard key={item.id} item={item} formatDate={formatDate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function NewsCard({ item, formatDate }) {
  const isEvent = item.category === 'event';
  const badgeColor = isEvent ? '#fb923c' : '#4ade80';

  return (
    <Link to={`/news/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'border-color 0.2s, transform 0.2s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = badgeColor;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#262626';
          e.currentTarget.style.transform = 'none';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 200, backgroundColor: '#1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
          {item.image_path ? (
            <img
              src={`/uploads/${item.image_path}`}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
            }}>
              {isEvent ? '🎪' : '📰'}
            </div>
          )}
          <span style={{
            position: 'absolute', top: 12, right: 12,
            backgroundColor: badgeColor,
            color: '#0a0a0a',
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 100,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {isEvent ? 'Event' : 'News'}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontSize: '1rem',
            marginBottom: 10,
            lineHeight: 1.4,
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: '0.83rem',
            color: '#a3a3a3',
            lineHeight: 1.6,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}>
            {item.excerpt}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#737373', fontFamily: 'var(--font-mono)', marginTop: 'auto' }}>
            {formatDate(item.event_date || item.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}
