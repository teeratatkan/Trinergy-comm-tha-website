import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { slugify } from '../utils/slugify';

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
  const [searchFocused, setSearchFocused] = useState(false);

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
      const tokens = search.toLowerCase().trim().split(/\s+/);
      result = result.filter(p => {
        const name = p.name.toLowerCase();
        const tags = (p.tags || '').toLowerCase().split(',').map(t => t.trim());
        const shortDesc = (p.short_description || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return tokens.every(token =>
          name.includes(token) ||
          tags.some(tag => tag.includes(token)) ||
          shortDesc.includes(token) ||
          desc.includes(token)
        );
      });
    }
    setFiltered(result);
  }, [activeCategory, search, products]);

  const activeCategoryColor = activeCategory !== 'all' ? CATEGORY_COLORS[activeCategory] : '#4ade80';
  const searchBorderColor = searchFocused ? activeCategoryColor : '#262626';

  return (
    <div style={{ paddingTop: 64, background: '#0a0a0a', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#f5f5f5' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0d1a0f 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #262626',
        padding: '60px 0 40px',
      }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <p style={{
            fontSize: '0.72rem',
            fontFamily: '"JetBrains Mono", monospace',
            color: '#4ade80',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: 12,
          }}>
            PRODUCT MARKETPLACE
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            marginBottom: 16,
            color: '#f5f5f5',
          }}>
            All Solutions
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', maxWidth: 480, lineHeight: 1.6 }}>
            Explore our complete range of 5G, IoT, AI, and telecom solutions.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Filter tabs + search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.key;
              const catColor = cat.key === 'all' ? '#4ade80' : CATEGORY_COLORS[cat.key] || '#4ade80';
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 100,
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: isActive ? `1px solid ${catColor}` : '1px solid #262626',
                    backgroundColor: isActive ? `${catColor}18` : 'transparent',
                    color: isActive ? catColor : '#a3a3a3',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#404040';
                      e.currentTarget.style.color = '#d4d4d4';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#262626';
                      e.currentTarget.style.color = '#a3a3a3';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              backgroundColor: '#111111',
              border: `1px solid ${searchBorderColor}`,
              borderRadius: 8,
              padding: '8px 16px',
              color: '#f5f5f5',
              fontSize: '0.875rem',
              width: 240,
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              transition: 'border-color 0.2s',
            }}
          />
        </div>

        {/* Product count */}
        <p style={{ fontSize: '0.8rem', color: '#737373', marginBottom: 24, fontFamily: '"JetBrains Mono", monospace' }}>
          Showing {filtered.length} of {products.length} products
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#a3a3a3' }}>
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#a3a3a3', marginBottom: 12, fontSize: '1rem' }}>
              {search.trim()
                ? `No results for "${search.trim()}".`
                : 'No products found.'}
            </p>
            {search.trim() && (
              <p style={{ color: '#737373', fontSize: '0.85rem', fontFamily: '"JetBrains Mono", monospace' }}>
                Try: ESP32, 5G, IoT, PLC
              </p>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const cat = product.category;
  const color = CATEGORY_COLORS[cat] || '#4ade80';
  const label = CATEGORY_LABELS[cat] || cat;
  const icon = CATEGORY_ICONS[cat] || '🔧';

  return (
    <Link
      to={`/products/${slugify(product.name)}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'border-color 0.2s, transform 0.2s',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#262626';
          e.currentTarget.style.transform = 'none';
        }}
      >
        {/* Image */}
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
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>{icon}</div>
            </div>
          )}
          <span style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'rgba(0,0,0,0.85)',
            border: `1px solid ${color}`,
            color,
            fontSize: '0.65rem',
            fontFamily: '"JetBrains Mono", monospace',
            padding: '3px 8px',
            borderRadius: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {label}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontSize: '1rem',
            marginBottom: 8,
            fontFamily: 'Outfit, sans-serif',
            fontStyle: 'italic',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#f5f5f5',
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '0.83rem',
            color: '#a3a3a3',
            lineHeight: 1.65,
            marginBottom: 16,
            flex: 1,
          }}>
            {product.short_description || product.description}
          </p>
          {product.tags && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {product.tags.split(',').map(tag => (
                <span key={tag} style={{
                  fontSize: '0.65rem',
                  fontFamily: '"JetBrains Mono", monospace',
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
          <span style={{
            marginTop: 'auto',
            alignSelf: 'flex-start',
            color,
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}>
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
