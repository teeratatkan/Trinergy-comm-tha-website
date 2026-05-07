import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORY_LABELS = {
  iot: 'IoT Lab Kits',
  ai: 'AI & Platforms',
  '5g': 'Private 5G',
  telecom: 'Telecom Tools',
};

const THEME_COLORS = {
  default: '#4ade80',
  green: '#22c55e',
  blue: '#22d3ee',
  purple: '#a78bfa',
  orange: '#fb923c',
  slate: '#64748b',
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Product not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ paddingTop: 64, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a3a3a3' }}>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ paddingTop: 64, minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171' }}>
        {error || 'Product not found'}
      </div>
    );
  }

  const accent = THEME_COLORS[product.theme] || THEME_COLORS[product.category] || THEME_COLORS.default;
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;

  return (
    <div style={{ paddingTop: 64 }}>
      <section style={{ padding: '80px 0', background: '#090b0a' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 18, color: accent, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: accent, boxShadow: `0 0 16px ${accent}` }} />
              {categoryLabel}
            </span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', marginBottom: 24, lineHeight: 1.05 }}>
              {product.name}
            </h1>
            <p style={{ color: '#c7d2d2', fontSize: '1rem', lineHeight: 1.85, maxWidth: 670, marginBottom: 30 }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/products" style={{ color: accent, border: `1px solid ${accent}`, padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Back to Products
              </Link>
              <Link to="/contact" style={{ backgroundColor: accent, color: '#09100d', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                Contact Sales
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative', minHeight: 420, borderRadius: 28, overflow: 'hidden', backgroundColor: '#111111' }}>
            {product.image_path ? (
              <img
                src={`/uploads/${product.image_path}`}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#737373', fontSize: '5rem' }}>
                {product.category === '5g' ? '📡' : product.category === 'iot' ? '🔌' : product.category === 'ai' ? '🤖' : '🔧'}
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45))' }} />
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0', background: '#0b0d0b' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'grid', gap: 18 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                {product.tags?.split(',').map(tag => (
                  <span key={tag} style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid #1f2a23', backgroundColor: '#111111', color: '#9ca3af', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 16 }}>
                <InfoRow label="Theme" value={product.theme || 'default'} accent={accent} />
                <InfoRow label="Category" value={categoryLabel} accent={accent} />
                <InfoRow label="Created" value={product.created_at ? product.created_at.substring(0, 10) : '—'} accent={accent} />
                <InfoRow label="Display order" value={product.display_order || '—'} accent={accent} />
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '#111111', border: '1px solid #1f2a23', borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: 18, color: '#f8fafc' }}>
              Product details
            </h2>
            <p style={{ color: '#c7d2d2', lineHeight: 1.8, marginBottom: 22 }}>
              This page is the full product detail view for each item. It is built to match the product theme while staying consistent with the site style.
            </p>
            <div style={{ display: 'grid', gap: 18 }}>
              <DetailCard title="Description" text={product.description} accent={accent} />
              <DetailCard title="Tags" text={product.tags || 'No tags added.'} accent={accent} />
              <DetailCard title="Recommended action" text="Request a callback to tailor the solution to your use case." accent={accent} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '16px 18px', borderRadius: 14, backgroundColor: '#111111', border: '1px solid #1f2a23' }}>
      <span style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ color: accent, fontWeight: 700, fontSize: '0.95rem' }}>{value}</span>
    </div>
  );
}

function DetailCard({ title, text, accent }) {
  return (
    <div style={{ padding: 22, borderRadius: 18, backgroundColor: '#090b09', border: `1px solid ${accent}22` }}>
      <h3 style={{ fontSize: '1rem', marginBottom: 10, color: '#f8fafc' }}>{title}</h3>
      <p style={{ color: '#c7d2d2', lineHeight: 1.8 }}>{text}</p>
    </div>
  );
}
