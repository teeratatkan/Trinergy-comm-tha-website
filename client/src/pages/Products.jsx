import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'iot', label: 'IoT Lab Kits' },
  { key: 'ai', label: 'AI & Platforms' },
  { key: '5g', label: 'Private 5G' },
  { key: 'telecom', label: 'Telecom Tools' },
];

const CATEGORY_COLORS = {
  iot: '#22d3ee',
  ai: '#a78bfa',
  '5g': '#4ade80',
  telecom: '#fb923c',
};

const CATEGORY_LABELS = {
  iot: 'IoT Lab Kits',
  ai: 'AI & Platforms',
  '5g': 'Private 5G',
  telecom: 'Telecom Tools',
};

const CATEGORY_ICONS = {
  '5g': '📡',
  iot: '🔌',
  ai: '🤖',
  telecom: '🔧',
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [activeCategory, search, products]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0d1a0f 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #262626',
        padding: '60px 0 40px',
      }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            PRODUCT MARKETPLACE
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>
            All Solutions
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', maxWidth: 480 }}>
            Explore our complete range of 5G, IoT, AI, and telecom solutions.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Filter tabs + search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 100,
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: activeCategory === cat.key ? '1px solid #4ade80' : '1px solid #262626',
                  backgroundColor: activeCategory === cat.key ? 'rgba(74,222,128,0.12)' : 'transparent',
                  color: activeCategory === cat.key ? '#4ade80' : '#a3a3a3',
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: 8,
              padding: '8px 16px',
              color: '#f5f5f5',
              fontSize: '0.875rem',
              width: 240,
              outline: 'none',
            }}
          />
        </div>

        {/* Product count */}
        <p style={{ fontSize: '0.8rem', color: '#737373', marginBottom: 24 }}>
          Showing {filtered.length} of {products.length} products
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a3a3a3' }}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a3a3a3' }}>No products found.</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {filtered.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function ProductCard({ product, onViewDetails }) {
  const cat = product.category;
  const color = CATEGORY_COLORS[cat] || '#4ade80';
  const label = CATEGORY_LABELS[cat] || cat;
  const icon = CATEGORY_ICONS[cat] || '🔧';

  return (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #262626',
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'border-color 0.2s, transform 0.2s',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#262626'; e.currentTarget.style.transform = 'none'; }}>
      <div style={{
        height: 200,
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {product.image_path ? (
          <img
            src={`/uploads/${product.image_path}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>{icon}</div>
          </div>
        )}
        <span style={{
          position: 'absolute', top: 12, left: 12,
          backgroundColor: 'rgba(0,0,0,0.85)',
          border: `1px solid ${color}`,
          color,
          fontSize: '0.65rem',
          fontFamily: 'var(--font-mono)',
          padding: '3px 8px',
          borderRadius: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
      </div>
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 8, fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase' }}>
          {product.name}
        </h3>
        <p style={{ fontSize: '0.83rem', color: '#a3a3a3', lineHeight: 1.65, marginBottom: 16, flex: 1 }}>
          {product.short_description || product.description}
        </p>
        {product.tags && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {product.tags.split(',').map(tag => (
              <span key={tag} style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                color: '#737373',
                border: '1px solid #2a2a2a',
                borderRadius: 4,
                padding: '2px 6px',
              }}>
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={onViewDetails}
          style={{
            marginTop: 'auto',
            alignSelf: 'flex-start',
            backgroundColor: 'transparent',
            color,
            padding: '8px 0',
            border: 'none',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
}

function ProductDetailModal({ product, onClose }) {
  const cat = product.category;
  const color = CATEGORY_COLORS[cat] || '#4ade80';
  const label = CATEGORY_LABELS[cat] || cat;
  const icon = CATEGORY_ICONS[cat] || '🔧';

  let specs = null;
  if (product.specs) {
    try {
      specs = JSON.parse(product.specs);
    } catch (e) {
      specs = null;
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: 16,
          width: '100%',
          maxWidth: 760,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid #2a2a2a',
            borderRadius: 8,
            color: '#a3a3a3',
            width: 36,
            height: 36,
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            lineHeight: 1,
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Image / placeholder header */}
        <div style={{
          height: 220,
          backgroundColor: '#1a1a1a',
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {product.image_path ? (
            <img
              src={`/uploads/${product.image_path}`}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: 8, opacity: 0.5 }}>{icon}</div>
              <p style={{ color: '#404040', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>NO IMAGE</p>
            </div>
          )}
          {/* Category badge */}
          <span style={{
            position: 'absolute',
            bottom: 16,
            left: 20,
            backgroundColor: 'rgba(0,0,0,0.85)',
            border: `1px solid ${color}`,
            color,
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            padding: '4px 10px',
            borderRadius: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {label}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px 32px' }}>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            marginBottom: 10,
            paddingRight: 40,
          }}>
            {product.name}
          </h2>

          {product.short_description && (
            <p style={{
              fontSize: '0.93rem',
              color,
              fontFamily: 'var(--font-mono)',
              marginBottom: 20,
              lineHeight: 1.6,
            }}>
              {product.short_description}
            </p>
          )}

          {product.description && (
            <p style={{
              fontSize: '0.88rem',
              color: '#a3a3a3',
              lineHeight: 1.75,
              marginBottom: 28,
            }}>
              {product.description}
            </p>
          )}

          {/* Specs table */}
          {specs && Object.keys(specs).length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <p style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: '#737373',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 12,
              }}>
                SPECIFICATIONS
              </p>
              <div style={{
                border: `1px solid ${color}20`,
                borderRadius: 10,
                overflow: 'hidden',
                fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
              }}>
                {Object.entries(specs).map(([key, value], idx) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      borderBottom: idx < Object.entries(specs).length - 1 ? '1px solid #1a1a1a' : 'none',
                      backgroundColor: idx % 2 === 0 ? '#0d0d0d' : '#111111',
                    }}
                  >
                    <div style={{
                      padding: '10px 16px',
                      fontSize: '0.72rem',
                      color: '#737373',
                      minWidth: 180,
                      flexShrink: 0,
                      borderRight: '1px solid #1a1a1a',
                    }}>
                      {key}
                    </div>
                    <div style={{
                      padding: '10px 16px',
                      fontSize: '0.72rem',
                      color: '#e5e5e5',
                      flex: 1,
                    }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && (
            <div style={{ marginBottom: 28 }}>
              <p style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: '#737373',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 10,
              }}>
                TAGS
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.tags.split(',').map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: color,
                    border: `1px solid ${color}40`,
                    borderRadius: 4,
                    padding: '3px 10px',
                    backgroundColor: `${color}0d`,
                  }}>
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <Link
            to="/contact"
            onClick={onClose}
            style={{
              display: 'inline-block',
              backgroundColor: color,
              color: '#0a0a0a',
              padding: '12px 28px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Contact Us About This Product
          </Link>
        </div>
      </div>
    </div>
  );
}
