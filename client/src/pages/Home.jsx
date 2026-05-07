import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORY_LABELS = {
  iot: 'IoT Lab Kits',
  ai: 'AI & Platforms',
  '5g': 'Private 5G',
  telecom: 'Telecom Tools',
};

const CATEGORY_COLORS = {
  iot: '#22d3ee',
  ai: '#a78bfa',
  '5g': '#4ade80',
  telecom: '#fb923c',
};

const partners = [
  'Nokia', 'Open5GS', 'TOT 5G', 'NI USRP', 'Thingsboard', 'OpenAirInterface', 'Docker', 'Kubernetes',
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setFeaturedProducts(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0f 50%, #0a0a0a 100%)',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '20%', right: '10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.25)',
              borderRadius: 100, padding: '6px 16px',
              marginBottom: 32,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 8px #4ade80' }} />
              <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#4ade80', letterSpacing: '0.05em' }}>
                THAILAND'S FIRST OPEN-SOURCE 5G CORE — VALIDATED
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', marginBottom: 24, lineHeight: 1.1 }}>
              Powering Thailand's{' '}
              <span style={{ color: '#4ade80' }}>Private 5G</span>
              {' '}& IoT Infrastructure
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#a3a3a3', maxWidth: 580, lineHeight: 1.8, marginBottom: 40 }}>
              Trinergy Comm-THA delivers enterprise-grade 5G cores, intelligent IoT platforms, and AI-driven telecom solutions for Thailand's digital transformation.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/products" style={{
                backgroundColor: '#4ade80',
                color: '#0a0a0a',
                padding: '14px 32px',
                borderRadius: 8,
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}>
                Explore Products
              </Link>
              <Link to="/5g" style={{
                backgroundColor: 'transparent',
                color: '#f5f5f5',
                padding: '14px 32px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '0.9rem',
                border: '1px solid #262626',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}>
                View 5G Specs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                FEATURED SOLUTIONS
              </p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>Flagship Products</h2>
            </div>
            <Link to="/products" style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 500 }}>
              View all products →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5G CTA Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0d1a0f 0%, #0a0a0a 100%)',
        border: '1px solid #1a2e1f',
        borderRadius: 16,
        margin: '0 24px 80px',
        padding: '60px 48px',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: 1152,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            PRIVATE 5G INFRASTRUCTURE
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginTop: 12, marginBottom: 16 }}>
            Deploy Your Own Private 5G Network
          </h2>
          <p style={{ color: '#a3a3a3', lineHeight: 1.8, marginBottom: 32 }}>
            We offer complete private 5G network solutions — from core network software to RAN hardware integration. Built on Open5GS with Nokia gNB validation.
          </p>
          <Link to="/5g" style={{
            backgroundColor: '#4ade80',
            color: '#0a0a0a',
            padding: '12px 28px',
            borderRadius: 8,
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            display: 'inline-block',
          }}>
            Explore 5G Details
          </Link>
        </div>
      </section>

      {/* Partners Strip */}
      <section style={{ padding: '60px 0', borderTop: '1px solid #1a1a1a' }}>
        <div className="container">
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 32 }}>
            TECHNOLOGY PARTNERS & ECOSYSTEM
          </p>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {partners.map(p => (
              <span key={p} style={{
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                color: '#404040',
                letterSpacing: '0.05em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#737373'}
              onMouseLeave={e => e.target.style.color = '#404040'}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA to contact */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginBottom: 16 }}>
            Ready to Build the Future?
          </h2>
          <p style={{ color: '#a3a3a3', lineHeight: 1.8, marginBottom: 32 }}>
            Talk to our engineers about your 5G, IoT, or AI infrastructure needs.
          </p>
          <Link to="/contact" style={{
            backgroundColor: 'transparent',
            color: '#4ade80',
            padding: '14px 40px',
            borderRadius: 8,
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            border: '1px solid #4ade80',
            display: 'inline-block',
            transition: 'all 0.2s',
          }}>
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }) {
  const cat = product.category;
  const color = CATEGORY_COLORS[cat] || '#4ade80';
  const label = CATEGORY_LABELS[cat] || cat;

  return (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #262626',
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'border-color 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#262626'; e.currentTarget.style.transform = 'none'; }}>
      <div style={{
        height: 180,
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {product.image_path ? (
          <img
            src={`/uploads/${product.image_path}`}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
              {cat === '5g' ? '📡' : cat === 'iot' ? '🔌' : cat === 'ai' ? '🤖' : '🔧'}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#404040' }}>{label}</span>
          </div>
        )}
        <span style={{
          position: 'absolute', top: 12, left: 12,
          backgroundColor: `rgba(0,0,0,0.8)`,
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
      <div style={{ padding: 20 }}>
        <h3 style={{ fontSize: '1rem', marginBottom: 8, fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase' }}>
          {product.name}
        </h3>
        <p style={{ fontSize: '0.83rem', color: '#a3a3a3', lineHeight: 1.6, marginBottom: 12 }}>
          {product.description?.substring(0, 100)}...
        </p>
        {product.tags && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
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
      </div>
    </div>
  );
}
