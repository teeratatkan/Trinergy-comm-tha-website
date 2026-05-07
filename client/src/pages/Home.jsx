import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { slugify } from '../utils/slugify';

const NEWS_CATEGORY_COLORS = {
  event: '#fb923c',
  news: '#4ade80',
};

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
  'Nokia', 'Open5GS', 'TOT 5G', 'NI USRP', 'Thingsboard',
  'OpenAirInterface', 'Docker', 'Kubernetes', 'Nokia', 'Open5GS',
  'TOT 5G', 'NI USRP', 'Thingsboard', 'OpenAirInterface', 'Docker', 'Kubernetes',
];

const STATS = [
  { value: 10, suffix: '+', label: 'Universities Deployed' },
  { value: 5, suffix: 'G', label: 'Private 5G Networks' },
  { value: 12, suffix: '+', label: 'IoT & AI Products' },
  { value: 3, suffix: ' yrs', label: 'In Operation' },
];

/* ── Animated counter hook ── */
function useCountUp(target, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ── Scroll-reveal hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Single stat counter ── */
function StatItem({ value, suffix, label, inView }) {
  const count = useCountUp(value, 1400, inView);
  return (
    <div style={{ textAlign: 'center', padding: '0 24px' }}>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontStyle: 'italic',
        fontWeight: 800,
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        color: '#4ade80',
        lineHeight: 1,
        marginBottom: 6,
      }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '0.78rem', color: '#737373', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
    </div>
  );
}

/* ── Typewriter component ── */
const PHRASES = [
  'Private 5G Networks',
  'Smart IoT Labs',
  'AI-Driven Platforms',
  'Telecom Infrastructure',
];

function Typewriter() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    let timeout;
    if (!deleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 70);
    } else if (!deleting && displayed.length === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length - 1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIdx((phraseIdx + 1) % PHRASES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIdx]);

  return (
    <span style={{ color: '#4ade80' }}>
      {displayed}
      <span style={{ borderRight: '2px solid #4ade80', marginLeft: 2, animation: 'blink 0.7s step-end infinite' }} />
    </span>
  );
}

/* ── Floating orbs background ── */
function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[
        { top: '15%', left: '8%', size: 320, color: 'rgba(74,222,128,0.06)', dur: 8 },
        { top: '55%', right: '5%', size: 420, color: 'rgba(34,211,238,0.04)', dur: 11 },
        { top: '70%', left: '35%', size: 200, color: 'rgba(167,139,250,0.05)', dur: 9 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: orb.top,
          left: orb.left,
          right: orb.right,
          width: orb.size,
          height: orb.size,
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: `float ${orb.dur}s ease-in-out infinite alternate`,
        }} />
      ))}
    </div>
  );
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestNews, setLatestNews] = useState([]);

  const [statsRef, statsInView] = useInView(0.2);
  const [newsRef, newsInView] = useInView(0.1);
  const [productsRef, productsInView] = useInView(0.1);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setFeaturedProducts(res.data.slice(0, 3)))
      .catch(() => {});
    axios.get('/api/news')
      .then(res => setLatestNews(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      <style>{`
        @keyframes blink { 50% { border-color: transparent; } }
        @keyframes float { from { transform: translateY(0px); } to { transform: translateY(-24px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); } 70% { box-shadow: 0 0 0 10px rgba(74,222,128,0); } 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); } }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .card-hover:hover { border-color: var(--card-accent) !important; transform: translateY(-4px) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
        .btn-primary:hover { background: #22c55e !important; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(74,222,128,0.3); }
        .btn-outline:hover { background: rgba(74,222,128,0.08) !important; border-color: #4ade80 !important; color: #4ade80 !important; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0f 50%, #0a0a0a 100%)',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <FloatingOrbs />

        {/* Animated scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)',
          animation: 'float 4s ease-in-out infinite alternate',
          top: '40%',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 820, animation: 'slideUp 0.8s ease both' }}>
            {/* Live badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: 100, padding: '6px 16px',
              marginBottom: 32,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#4ade80',
                display: 'inline-block',
                animation: 'pulse-ring 2s ease-out infinite',
              }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', letterSpacing: '0.05em' }}>
                THAILAND'S FIRST OPEN-SOURCE 5G CORE — VALIDATED
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', marginBottom: 24, lineHeight: 1.1, animation: 'slideUp 0.8s 0.1s ease both', opacity: 0, animationFillMode: 'forwards' }}>
              Powering Thailand's
              <br />
              <Typewriter />
            </h1>

            <p style={{
              fontSize: '1.05rem', color: '#a3a3a3', maxWidth: 560, lineHeight: 1.85, marginBottom: 44,
              animation: 'slideUp 0.8s 0.2s ease both', opacity: 0, animationFillMode: 'forwards',
            }}>
              Trinergy Comm-THA delivers enterprise-grade 5G cores, intelligent IoT platforms, and AI-driven telecom solutions for Thailand's digital transformation.
            </p>

            <div style={{
              display: 'flex', gap: 16, flexWrap: 'wrap',
              animation: 'slideUp 0.8s 0.3s ease both', opacity: 0, animationFillMode: 'forwards',
            }}>
              <Link to="/products" className="btn-primary" style={{
                backgroundColor: '#4ade80', color: '#0a0a0a',
                padding: '14px 34px', borderRadius: 8,
                fontWeight: 700, fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                textTransform: 'uppercase', fontSize: '0.88rem', letterSpacing: '0.05em',
                transition: 'all 0.2s', display: 'inline-block', textDecoration: 'none',
              }}>
                Explore Products
              </Link>
              <Link to="/5g" className="btn-outline" style={{
                backgroundColor: 'transparent', color: '#f5f5f5',
                padding: '14px 34px', borderRadius: 8,
                fontWeight: 600, fontSize: '0.88rem',
                border: '1px solid #303030', transition: 'all 0.2s',
                display: 'inline-block', textDecoration: 'none',
              }}>
                View 5G Specs →
              </Link>
            </div>
          </div>

          {/* Floating spec cards */}
          <div style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: 12, opacity: 0,
            animation: 'fadeIn 1s 0.6s ease both', animationFillMode: 'forwards',
          }} className="hero-spec-cards">
            {[
              { label: '5G Standard', value: '3GPP R15/16', color: '#4ade80' },
              { label: 'Latency', value: '< 1 ms', color: '#22d3ee' },
              { label: 'Core', value: 'Open5GS / OAI', color: '#a78bfa' },
            ].map((s, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(17,17,17,0.9)',
                border: `1px solid ${s.color}22`,
                borderLeft: `3px solid ${s.color}`,
                borderRadius: 8,
                padding: '10px 18px',
                backdropFilter: 'blur(8px)',
                minWidth: 180,
                animation: `slideUp 0.5s ${0.7 + i * 0.12}s ease both`,
                opacity: 0,
                animationFillMode: 'forwards',
              }}>
                <div style={{ fontSize: '0.6rem', color: '#737373', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: '0.88rem', color: s.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          opacity: 0, animation: 'fadeIn 1s 1.2s ease both', animationFillMode: 'forwards',
        }}>
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#404040', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(#404040, transparent)', animation: 'float 1.5s ease-in-out infinite alternate' }} />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div ref={statsRef} style={{
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a',
        background: 'linear-gradient(90deg, #0a0a0a 0%, #0d1a0f 50%, #0a0a0a 100%)',
        padding: '48px 0',
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 32,
          }}>
            {STATS.map((s, i) => (
              <StatItem key={i} {...s} inView={statsInView} />
            ))}
          </div>
        </div>
      </div>

      {/* ── NEWS & EVENTS (moved above products) ── */}
      {latestNews.length > 0 && (
        <section ref={newsRef} style={{ padding: '96px 0', borderBottom: '1px solid #1a1a1a' }}>
          <div className="container">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 52,
              flexWrap: 'wrap',
              gap: 16,
              opacity: newsInView ? 1 : 0,
              transform: newsInView ? 'none' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}>
              <div>
                <p style={{
                  fontSize: '0.72rem', fontFamily: 'var(--font-mono)',
                  color: '#4ade80', textTransform: 'uppercase',
                  letterSpacing: '0.12em', marginBottom: 8,
                }}>
                  LATEST UPDATES
                </p>
                <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', position: 'relative', display: 'inline-block' }}>
                  News &amp; Events
                  <span style={{
                    display: 'block', height: 3, width: '60%',
                    background: 'linear-gradient(90deg, #4ade80, transparent)',
                    borderRadius: 2, marginTop: 6,
                  }} />
                </h2>
              </div>
              <Link to="/news" style={{ color: '#4ade80', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none' }}>
                View all news →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24 }}>
              {latestNews.map((item, i) => (
                <div key={item.id} style={{
                  opacity: newsInView ? 1 : 0,
                  transform: newsInView ? 'none' : 'translateY(32px)',
                  transition: `all 0.6s ${0.1 + i * 0.12}s ease`,
                }}>
                  <HomeNewsCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      <section ref={productsRef} style={{ padding: '96px 0', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: 52,
            flexWrap: 'wrap', gap: 16,
            opacity: productsInView ? 1 : 0,
            transform: productsInView ? 'none' : 'translateY(20px)',
            transition: 'all 0.6s ease',
          }}>
            <div>
              <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                FEATURED SOLUTIONS
              </p>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>Flagship Products</h2>
            </div>
            <Link to="/products" style={{ color: '#4ade80', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none' }}>
              View all products →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {featuredProducts.map((product, i) => (
              <div key={product.id} style={{
                opacity: productsInView ? 1 : 0,
                transform: productsInView ? 'none' : 'translateY(32px)',
                transition: `all 0.6s ${0.1 + i * 0.12}s ease`,
              }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5G CTA ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0d1a0f 0%, #0a0a0a 100%)',
          border: '1px solid #1a2e1f',
          borderRadius: 20,
          padding: '64px 52px',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 1152,
          margin: '0 auto',
        }}>
          {/* Decorative corner */}
          <div style={{
            position: 'absolute', top: -100, right: -100,
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: -60, left: -60,
            width: 240, height: 240,
            background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />

          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
            <div style={{ maxWidth: 560 }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                PRIVATE 5G INFRASTRUCTURE
              </span>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', marginTop: 12, marginBottom: 16 }}>
                Deploy Your Own<br />Private 5G Network
              </h2>
              <p style={{ color: '#a3a3a3', lineHeight: 1.8 }}>
                We offer complete private 5G network solutions — from core network software to RAN hardware integration. Built on Open5GS with Nokia gNB validation.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 200 }}>
              {[
                { label: 'Core Network', val: 'Open5GS + OAI', color: '#4ade80' },
                { label: 'Radio Unit', val: 'Nokia gNB', color: '#22d3ee' },
                { label: 'Standard', val: '3GPP R15/16', color: '#a78bfa' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, padding: '8px 0', borderBottom: '1px solid #1a2e1f' }}>
                  <span style={{ fontSize: '0.75rem', color: '#737373', fontFamily: 'var(--font-mono)' }}>{item.label}</span>
                  <span style={{ fontSize: '0.8rem', color: item.color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.val}</span>
                </div>
              ))}
              <Link to="/5g" className="btn-primary" style={{
                backgroundColor: '#4ade80', color: '#0a0a0a',
                padding: '12px 28px', borderRadius: 8,
                fontWeight: 700, fontFamily: 'var(--font-heading)',
                fontStyle: 'italic', textTransform: 'uppercase',
                fontSize: '0.82rem', display: 'inline-block',
                marginTop: 8, textDecoration: 'none', textAlign: 'center',
                transition: 'all 0.2s',
              }}>
                Explore 5G Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNERS MARQUEE ── */}
      <section style={{ padding: '56px 0', borderTop: '1px solid #1a1a1a', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: 28 }}>
          <p style={{ textAlign: 'center', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#404040', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            TECHNOLOGY PARTNERS & ECOSYSTEM
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          {/* Fade edges */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(90deg, #0a0a0a, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(270deg, #0a0a0a, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', animation: 'marquee 20s linear infinite', width: 'max-content' }}>
            {partners.map((p, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontWeight: 700,
                textTransform: 'uppercase', fontSize: '0.88rem', color: '#303030',
                letterSpacing: '0.06em', padding: '0 40px', whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '100px 0', textAlign: 'center', borderTop: '1px solid #1a1a1a' }}>
        <div className="container" style={{ maxWidth: 620 }}>
          <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
            LET'S BUILD TOGETHER
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', marginBottom: 18, lineHeight: 1.2 }}>
            Ready to Build the Future?
          </h2>
          <p style={{ color: '#a3a3a3', lineHeight: 1.85, marginBottom: 40, fontSize: '1rem' }}>
            Talk to our engineers about your 5G, IoT, or AI infrastructure needs. We work directly with universities, enterprises, and government agencies.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{
              backgroundColor: '#4ade80', color: '#0a0a0a',
              padding: '14px 40px', borderRadius: 8,
              fontWeight: 700, fontFamily: 'var(--font-heading)', fontStyle: 'italic',
              textTransform: 'uppercase', fontSize: '0.88rem',
              display: 'inline-block', transition: 'all 0.2s', textDecoration: 'none',
            }}>
              Get in Touch
            </Link>
            <Link to="/products" className="btn-outline" style={{
              backgroundColor: 'transparent', color: '#a3a3a3',
              padding: '14px 40px', borderRadius: 8,
              fontWeight: 600, fontSize: '0.88rem',
              border: '1px solid #303030', transition: 'all 0.2s',
              display: 'inline-block', textDecoration: 'none',
            }}>
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .hero-spec-cards { display: none !important; } }
      `}</style>
    </div>
  );
}

/* ── News card ── */
function HomeNewsCard({ item }) {
  const isEvent = item.category === 'event';
  const accent = NEWS_CATEGORY_COLORS[item.category] || '#4ade80';

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <Link to={`/news/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <div style={{
        backgroundColor: '#111111',
        border: '1px solid #262626',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '--card-accent': accent,
      }}
      className="card-hover">
        <div style={{ position: 'relative', height: 190, backgroundColor: '#1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
          {item.image_path ? (
            <img
              src={`/uploads/${item.image_path}`}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.target.style.transform = 'none'}
            />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
              {isEvent ? '🎪' : '📰'}
            </div>
          )}
          <span style={{
            position: 'absolute', top: 12, right: 12,
            backgroundColor: accent, color: '#0a0a0a',
            fontSize: '0.6rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: 100,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            fontFamily: 'var(--font-mono)',
          }}>
            {isEvent ? 'Event' : 'News'}
          </span>
        </div>
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontSize: '0.9rem', marginBottom: 10, lineHeight: 1.45,
            fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.6, marginBottom: 14, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.excerpt}
          </p>
          <p style={{ fontSize: '0.7rem', color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
            {formatDate(item.event_date || item.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ── Product card ── */
function ProductCard({ product }) {
  const cat = product.category;
  const color = CATEGORY_COLORS[cat] || '#4ade80';
  const label = CATEGORY_LABELS[cat] || cat;

  return (
    <Link to={`/products/${slugify(product.name)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <div style={{
        backgroundColor: '#111111', border: '1px solid #262626',
        borderRadius: 14, overflow: 'hidden',
        transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
        height: '100%', display: 'flex', flexDirection: 'column',
        '--card-accent': color,
      }}
      className="card-hover">
        <div style={{
          height: 190, backgroundColor: '#1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          {product.image_path ? (
            <img
              src={`/uploads/${product.image_path}`}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.target.style.transform = 'none'}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>
                {cat === '5g' ? '📡' : cat === 'iot' ? '🔌' : cat === 'ai' ? '🤖' : '🔧'}
              </div>
            </div>
          )}
          <span style={{
            position: 'absolute', top: 12, left: 12,
            backgroundColor: 'rgba(0,0,0,0.85)',
            border: `1px solid ${color}`,
            color, fontSize: '0.62rem',
            fontFamily: 'var(--font-mono)',
            padding: '3px 9px', borderRadius: 4,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            {label}
          </span>
        </div>
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.98rem', marginBottom: 8, fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase', color: '#f5f5f5' }}>
            {product.name}
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#a3a3a3', lineHeight: 1.65, marginBottom: 14, flex: 1 }}>
            {(product.short_description || product.description)?.substring(0, 110)}...
          </p>
          {product.tags && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {product.tags.split(',').slice(0, 4).map(tag => (
                <span key={tag} style={{
                  fontSize: '0.62rem', fontFamily: 'var(--font-mono)',
                  color: '#737373', border: '1px solid #2a2a2a',
                  borderRadius: 4, padding: '2px 6px',
                }}>
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          <span style={{ color, fontWeight: 700, fontSize: '0.82rem' }}>View Details →</span>
        </div>
      </div>
    </Link>
  );
}
