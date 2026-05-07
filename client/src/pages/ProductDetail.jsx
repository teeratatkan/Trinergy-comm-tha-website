import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { slugify } from '../utils/slugify';

const CATEGORY_LABELS = {
  iot: 'IoT Lab Kits',
  ai: 'AI & Platforms',
  '5g': 'Private 5G',
  telecom: 'Telecom Tools',
};

const ACCENT_COLORS = {
  iot: '#22d3ee',
  ai: '#a78bfa',
  '5g': '#4ade80',
  telecom: '#fb923c',
};

function getAccent(category) {
  return ACCENT_COLORS[category] || '#4ade80';
}

function safeParseSpecs(raw) {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setLoading(true);
    setError('');
    setProduct(null);
    // Fetch all products and resolve by slug
    axios.get('/api/products')
      .then(res => {
        const all = res.data;
        const found = all.find(p => slugify(p.name) === slug);
        if (!found) {
          setError('Product not found');
          setLoading(false);
          return;
        }
        setProduct(found);
        const rel = all.filter(p => p.category === found.category && p.id !== found.id);
        setRelated(rel.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    document.title = product.name + ' | Trinergy Comm-THA';
    axios.get('/api/products')
      .then(res => {
        const rel = res.data.filter(p => p.category === product.category && p.id !== product.id);
        setRelated(rel.slice(0, 3));
      })
      .catch(() => {});
  }, [product, id]);

  if (loading) {
    return (
      <div style={{
        paddingTop: 64,
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a3a3a3',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{
        paddingTop: 64,
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f87171',
        fontFamily: 'Inter, sans-serif',
      }}>
        {error || 'Product not found'}
      </div>
    );
  }

  const accent = getAccent(product.category);
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const specs = safeParseSpecs(product.specs);
  const specEntries = Object.entries(specs);
  const quickSpecs = specEntries.slice(0, 4);
  const tags = product.tags ? product.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  return (
    <div style={{ paddingTop: 64, background: '#0a0a0a', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#f5f5f5' }}>

      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid #262626', background: '#111111' }}>
        <div className="container" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#737373' }}>
          <Link to="/" style={{ color: '#737373', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = accent}
            onMouseLeave={e => e.currentTarget.style.color = '#737373'}
          >Home</Link>
          <span style={{ color: '#404040' }}>/</span>
          <Link to="/products" style={{ color: '#737373', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = accent}
            onMouseLeave={e => e.currentTarget.style.color = '#737373'}
          >Products</Link>
          <span style={{ color: '#404040' }}>/</span>
          <span style={{ color: '#a3a3a3' }}>{product.name}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{ padding: '60px 0 48px', background: '#0a0a0a' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 55%) minmax(0, 45%)',
            gap: 48,
            alignItems: 'start',
          }}
          className="product-detail-hero"
          >
            {/* Left: Product Image */}
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              minHeight: 480,
              backgroundColor: '#111111',
              border: '1px solid #262626',
              position: 'relative',
            }}>
              {product.image_path ? (
                <img
                  src={`/uploads/${product.image_path}`}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 480, display: 'block' }}
                />
              ) : (
                <div style={{
                  minHeight: 480,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#404040',
                }}>
                  <div style={{ fontSize: '5rem', marginBottom: 16, opacity: 0.4 }}>
                    {product.category === '5g' ? '📡' : product.category === 'iot' ? '🔌' : product.category === 'ai' ? '🤖' : '🔧'}
                  </div>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    NO IMAGE
                  </span>
                </div>
              )}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Right: Sticky Info Panel */}
            <div style={{ position: 'sticky', top: 84 }}>
              {/* Category Badge */}
              <div style={{ marginBottom: 20 }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: `1px solid ${accent}`,
                  backgroundColor: `${accent}12`,
                  color: accent,
                  fontSize: '0.72rem',
                  fontFamily: '"JetBrains Mono", monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}>
                  <span style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: accent,
                    boxShadow: `0 0 8px ${accent}`,
                    flexShrink: 0,
                  }} />
                  {categoryLabel}
                </span>
              </div>

              {/* H1 Product Name */}
              <h1 style={{
                fontSize: 'clamp(1.7rem, 3vw, 2.6rem)',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                lineHeight: 1.1,
                marginBottom: 20,
                color: '#f5f5f5',
                letterSpacing: '-0.01em',
              }}>
                {product.name}
              </h1>

              {/* Short description */}
              {(product.short_description || product.description) && (
                <p style={{ color: '#a3a3a3', fontSize: '1rem', lineHeight: 1.7, marginBottom: 24 }}>
                  {product.short_description || product.description}
                </p>
              )}

              {/* Divider */}
              <div style={{ borderTop: '1px solid #262626', marginBottom: 20 }} />

              {/* Tags */}
              {tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                  {tags.map(tag => (
                    <span key={tag} style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      border: `1px solid ${accent}40`,
                      color: accent,
                      fontSize: '0.7rem',
                      fontFamily: '"JetBrains Mono", monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      backgroundColor: `${accent}0d`,
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div style={{ borderTop: '1px solid #262626', marginBottom: 20 }} />

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                <Link
                  to="/contact"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: accent,
                    color: '#0a0a0a',
                    padding: '14px 24px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    fontFamily: 'Outfit, sans-serif',
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Contact for Quote →
                </Link>
                <Link
                  to="/products"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    color: accent,
                    padding: '13px 24px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    fontFamily: 'Outfit, sans-serif',
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    border: `1px solid ${accent}`,
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${accent}12`; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  ← Back to Products
                </Link>
              </div>

              {/* Divider */}
              {quickSpecs.length > 0 && (
                <>
                  <div style={{ borderTop: '1px solid #262626', marginBottom: 20 }} />
                  {/* Quick Specs mini grid */}
                  <div>
                    <p style={{
                      fontSize: '0.65rem',
                      fontFamily: '"JetBrains Mono", monospace',
                      color: '#737373',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      marginBottom: 12,
                    }}>
                      Quick Specs
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 8,
                    }}>
                      {quickSpecs.map(([key, value]) => (
                        <div key={key} style={{
                          background: '#111111',
                          border: '1px solid #262626',
                          borderRadius: 8,
                          padding: '10px 12px',
                        }}>
                          <div style={{
                            fontSize: '0.65rem',
                            fontFamily: '"JetBrains Mono", monospace',
                            color: '#737373',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            marginBottom: 4,
                          }}>
                            {key}
                          </div>
                          <div style={{
                            fontSize: '0.82rem',
                            color: '#f5f5f5',
                            fontWeight: 600,
                            wordBreak: 'break-word',
                          }}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section style={{ borderTop: '1px solid #262626', background: '#0a0a0a' }}>
        <div className="container" style={{ padding: '0 24px' }}>
          {/* Tab Bar */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #262626',
            gap: 0,
          }}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'specs', label: 'Specifications' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? `2px solid ${accent}` : '2px solid transparent',
                  color: activeTab === tab.key ? accent : '#737373',
                  padding: '18px 24px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  marginBottom: -1,
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { if (activeTab !== tab.key) e.currentTarget.style.color = '#d4d4d4'; }}
                onMouseLeave={e => { if (activeTab !== tab.key) e.currentTarget.style.color = '#737373'; }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: '48px 0 64px' }}>
            {activeTab === 'overview' && (
              <div style={{ maxWidth: 800 }}>
                <p style={{
                  color: '#c7d2d2',
                  fontSize: '1rem',
                  lineHeight: 1.85,
                  whiteSpace: 'pre-wrap',
                }}>
                  {product.description || 'No description available.'}
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ maxWidth: 800 }}>
                {specEntries.length === 0 ? (
                  <p style={{ color: '#737373', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
                    No specifications available for this product.
                  </p>
                ) : (
                  <div style={{
                    border: '1px solid #262626',
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}>
                    {specEntries.map(([key, value], idx) => {
                      const isGroupHeading = typeof value === 'string' && value.includes(':');
                      return (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'stretch',
                            borderBottom: idx < specEntries.length - 1 ? '1px solid #1f1f1f' : 'none',
                            backgroundColor: idx % 2 === 0 ? '#0d0d0d' : '#111111',
                          }}
                        >
                          <div style={{
                            padding: '12px 20px',
                            fontSize: '0.78rem',
                            fontFamily: '"JetBrains Mono", monospace',
                            color: '#737373',
                            minWidth: 200,
                            flexShrink: 0,
                            borderRight: '1px solid #1f1f1f',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                            {key}
                          </div>
                          <div style={{
                            padding: '12px 20px',
                            fontSize: '0.88rem',
                            color: isGroupHeading ? accent : '#f5f5f5',
                            fontWeight: isGroupHeading ? 700 : 500,
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: isGroupHeading ? 'Outfit, sans-serif' : 'Inter, sans-serif',
                          }}>
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ borderTop: '1px solid #262626', background: '#111111', padding: '60px 0' }}>
          <div className="container" style={{ padding: '0 24px' }}>
            <p style={{
              fontSize: '0.65rem',
              fontFamily: '"JetBrains Mono", monospace',
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 8,
            }}>
              Same Category
            </p>
            <h2 style={{
              fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              marginBottom: 32,
              color: '#f5f5f5',
            }}>
              Related Products
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 24,
            }}>
              {related.map(p => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .product-detail-hero {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function RelatedCard({ product }) {
  const accent = getAccent(product.category);
  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;

  return (
    <Link
      to={`/products/${slugify(product.name)}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div
        style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #262626',
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'border-color 0.2s, transform 0.2s',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = accent;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#262626';
          e.currentTarget.style.transform = 'none';
        }}
      >
        <div style={{
          height: 160,
          backgroundColor: '#1a1a1a',
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
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#404040',
              fontSize: '2.5rem',
            }}>
              {product.category === '5g' ? '📡' : product.category === 'iot' ? '🔌' : product.category === 'ai' ? '🤖' : '🔧'}
            </div>
          )}
          <span style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'rgba(0,0,0,0.85)',
            border: `1px solid ${accent}`,
            color: accent,
            fontSize: '0.62rem',
            fontFamily: '"JetBrains Mono", monospace',
            padding: '3px 8px',
            borderRadius: 4,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {categoryLabel}
          </span>
        </div>
        <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontSize: '0.95rem',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            marginBottom: 8,
            color: '#f5f5f5',
          }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '0.8rem',
            color: '#737373',
            lineHeight: 1.6,
            flex: 1,
          }}>
            {product.short_description || product.description}
          </p>
          <span style={{
            display: 'inline-block',
            marginTop: 14,
            color: accent,
            fontSize: '0.8rem',
            fontWeight: 700,
          }}>
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
