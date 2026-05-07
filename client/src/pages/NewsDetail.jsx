import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

export default function NewsDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/news/${id}`)
      .then(r => {
        setItem(r.data);
        document.title = r.data.title + ' | Trinergy Comm-THA';
        setLoading(false);
      })
      .catch(() => {
        setError('Article not found');
        setLoading(false);
      });
  }, [id]);

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div style={{
        paddingTop: 64, minHeight: '60vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#a3a3a3', background: '#0a0a0a',
      }}>
        Loading...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{
        paddingTop: 64, minHeight: '60vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#f87171', background: '#0a0a0a',
      }}>
        {error || 'Article not found'}
      </div>
    );
  }

  const isEvent = item.category === 'event';
  const accent = isEvent ? '#fb923c' : '#4ade80';

  return (
    <div style={{ paddingTop: 64, background: '#0a0a0a', minHeight: '100vh', color: '#f5f5f5' }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #262626', background: '#111111' }}>
        <div className="container" style={{
          padding: '12px 24px',
          display: 'flex',
          gap: 8,
          fontSize: '0.8rem',
          color: '#737373',
          fontFamily: 'var(--font-mono)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <Link to="/" style={{ color: '#737373', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/news" style={{ color: '#737373', textDecoration: 'none' }}>News &amp; Events</Link>
          <span>/</span>
          <span style={{ color: accent }}>
            {item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title}
          </span>
        </div>
      </div>

      {/* Hero — image left, info right */}
      <div className="container" style={{ padding: '48px 24px' }}>
        <div
          className="news-hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            alignItems: 'start',
            marginBottom: 48,
          }}
        >
          {/* Image */}
          <div style={{
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#111111',
            minHeight: 320,
          }}>
            {item.image_path ? (
              <img
                src={`/uploads/${item.image_path}`}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 320 }}
              />
            ) : (
              <div style={{
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
              }}>
                {isEvent ? '🎪' : '📰'}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ paddingTop: 8 }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: accent,
              color: '#0a0a0a',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 100,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              {isEvent ? 'Event' : 'News'}
            </span>

            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              lineHeight: 1.25,
              marginBottom: 16,
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              textTransform: 'uppercase',
            }}>
              {item.title}
            </h1>

            <p style={{
              color: '#737373',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}>
              Date: {formatDate(item.event_date || item.created_at)}
            </p>

            {item.excerpt && (
              <p style={{
                color: '#a3a3a3',
                lineHeight: 1.75,
                fontSize: '0.95rem',
                marginBottom: 28,
              }}>
                {item.excerpt}
              </p>
            )}

            <Link
              to="/news"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: accent,
                border: `1px solid ${accent}`,
                padding: '10px 20px',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              ← Back to News &amp; Events
            </Link>
          </div>
        </div>

        {/* Full content */}
        {item.content && (
          <div style={{
            maxWidth: 800,
            margin: '0 auto',
            borderTop: '1px solid #262626',
            paddingTop: 40,
          }}>
            {item.content.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} style={{
                color: '#c7d2d2',
                lineHeight: 1.85,
                marginBottom: 18,
                fontSize: '1rem',
              }}>
                {para}
              </p>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .news-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
