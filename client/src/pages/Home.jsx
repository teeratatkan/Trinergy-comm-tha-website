import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { slugify } from '../utils/slugify';

const NEWS_CATEGORY_COLORS = { event: '#fb923c', news: '#4ade80' };
const CATEGORY_LABELS = { iot: 'IoT Lab Kits', ai: 'AI & Platforms', '5g': 'Private 5G', telecom: 'Telecom Tools' };
const CATEGORY_COLORS = { iot: '#22d3ee', ai: '#a78bfa', '5g': '#4ade80', telecom: '#fb923c' };

const partners = [
  'Nokia', 'Open5GS', 'TOT 5G', 'NI USRP', 'Thingsboard',
  'OpenAirInterface', 'Docker', 'Kubernetes',
  'Nokia', 'Open5GS', 'TOT 5G', 'NI USRP', 'Thingsboard',
  'OpenAirInterface', 'Docker', 'Kubernetes',
];

const STATS = [
  { value: 10, suffix: '+', label: 'Universities Deployed' },
  { value: 5,  suffix: 'G', label: 'Private 5G Networks' },
  { value: 12, suffix: '+', label: 'IoT & AI Products' },
  { value: 3,  suffix: ' yrs', label: 'In Operation' },
];

/* ── Typewriter ── */
const PHRASES = ['Private 5G Networks', 'Smart IoT Labs', 'AI-Driven Platforms', 'Telecom Infrastructure'];

function Typewriter() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const phrase = PHRASES[phraseIdx];
    let t;
    if (!deleting && displayed.length < phrase.length) {
      t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 70);
    } else if (!deleting && displayed.length === phrase.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length - 1)), 38);
    } else {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % PHRASES.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, phraseIdx]);
  return (
    <span style={{ color: '#4ade80' }}>
      {displayed}
      <span className="cursor-blink" />
    </span>
  );
}

/* ── Count-up ── */
function useCountUp(target, duration = 1500, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

/* ── IntersectionObserver ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Stat item ── */
function StatItem({ value, suffix, label, inView }) {
  const count = useCountUp(value, 1400, inView);
  return (
    <div style={{ textAlign: 'center', padding: '0 20px' }}>
      <div style={{
        fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontWeight: 800,
        fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#4ade80', lineHeight: 1, marginBottom: 6,
      }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: '0.72rem', color: '#737373', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </div>
    </div>
  );
}

/* ── Reveal wrapper ── */
function Reveal({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`,
      ...style,
    }}>
      {children}
    </div>
  );
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestNews, setLatestNews]   = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [statsRef, statsInView]       = useInView(0.2);

  useEffect(() => {
    axios.get('/api/products').then(r => setFeaturedProducts(r.data.slice(0, 3))).catch(() => {});
    axios.get('/api/news')
      .then(r => { setLatestNews(r.data.slice(0, 3)); setNewsLoading(false); })
      .catch(() => setNewsLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes heroIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatY { from { transform: translateY(0); } to { transform: translateY(-20px); } }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.45); }
          70%  { box-shadow: 0 0 0 10px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
        .cursor-blink {
          display: inline-block; width: 2px; height: 1em;
          background: #4ade80; vertical-align: text-bottom;
          margin-left: 3px; animation: blink 0.75s step-end infinite;
        }
        .hero-line1 { animation: heroIn 0.8s 0.05s both ease; }
        .hero-line2 { animation: heroIn 0.8s 0.18s both ease; }
        .hero-line3 { animation: heroIn 0.8s 0.30s both ease; }
        .hero-line4 { animation: heroIn 0.8s 0.44s both ease; }
        .btn-green  { transition: all 0.2s; }
        .btn-green:hover  { background: #22c55e !important; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(74,222,128,0.3); }
        .btn-ghost:hover  { background: rgba(74,222,128,0.08) !important; border-color: #4ade80 !important; color: #4ade80 !important; }
        .news-card  { transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s; }
        .news-card:hover  { border-color: var(--accent) !important; transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .prod-card  { transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s; }
        .prod-card:hover  { border-color: var(--accent) !important; transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .card-img   { transition: transform 0.4s ease; }
        .news-card:hover .card-img, .prod-card:hover .card-img { transform: scale(1.05); }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0f 55%, #0a0a0a 100%)',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)',
          backgroundSize: '48px 48px', pointerEvents: 'none',
        }} />
        {/* Orbs */}
        {[
          { top: '18%', left: '6%',  size: 360, color: 'rgba(74,222,128,0.07)',  dur: 8 },
          { top: '55%', right: '4%', size: 440, color: 'rgba(34,211,238,0.04)',  dur: 11 },
          { top: '72%', left: '38%', size: 220, color: 'rgba(167,139,250,0.05)', dur: 9 },
        ].map((o, i) => (
          <div key={i} style={{
            position: 'absolute', top: o.top, left: o.left, right: o.right,
            width: o.size, height: o.size,
            background: `radial-gradient(circle,${o.color} 0%,transparent 70%)`,
            borderRadius: '50%', pointerEvents: 'none',
            animation: `floatY ${o.dur}s ease-in-out infinite alternate`,
          }} />
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800 }}>
            {/* Badge */}
            <div className="hero-line1" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.22)',
              borderRadius: 100, padding: '6px 16px', marginBottom: 32,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
                display: 'inline-block', animation: 'pulseRing 2s ease-out infinite',
              }} />
              <span style={{ fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: '#4ade80', letterSpacing: '0.06em' }}>
                THAILAND'S FIRST OPEN-SOURCE 5G CORE — VALIDATED
              </span>
            </div>

            <h1 className="hero-line2" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', marginBottom: 24, lineHeight: 1.1 }}>
              Powering Thailand's<br />
              <Typewriter />
            </h1>

            <p className="hero-line3" style={{ fontSize: '1.05rem', color: '#a3a3a3', maxWidth: 560, lineHeight: 1.85, marginBottom: 44 }}>
              Trinergy Comm-THA delivers enterprise-grade 5G cores, intelligent IoT platforms, and AI-driven telecom solutions for Thailand's digital transformation.
            </p>

            <div className="hero-line4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/products" className="btn-green" style={{
                backgroundColor: '#4ade80', color: '#0a0a0a',
                padding: '14px 34px', borderRadius: 8,
                fontWeight: 700, fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                textTransform: 'uppercase', fontSize: '0.88rem', letterSpacing: '0.05em',
                display: 'inline-block', textDecoration: 'none',
              }}>Explore Products</Link>
              <Link to="/5g" className="btn-ghost" style={{
                backgroundColor: 'transparent', color: '#d4d4d4',
                padding: '14px 34px', borderRadius: 8, fontWeight: 600,
                fontSize: '0.88rem', border: '1px solid #303030',
                display: 'inline-block', textDecoration: 'none', transition: 'all 0.2s',
              }}>View 5G Specs →</Link>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          animation: 'heroIn 0.8s 1.1s both ease',
        }}>
          <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: '#404040', letterSpacing: '0.1em' }}>SCROLL</span>
          <div style={{ width: 1, height: 30, background: 'linear-gradient(#4ade80, transparent)', animation: 'floatY 1.6s ease-in-out infinite alternate' }} />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div ref={statsRef} style={{
        borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a',
        background: 'linear-gradient(90deg, #0a0a0a 0%, #0d1a0f 50%, #0a0a0a 100%)',
        padding: '52px 0',
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: 36 }}>
            {STATS.map((s, i) => <StatItem key={i} {...s} inView={statsInView} />)}
          </div>
        </div>
      </div>

      {/* ── NEWS & EVENTS ── */}
      <section style={{ padding: '96px 0', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container">
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                  LATEST UPDATES
                </p>
                <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', display: 'inline-block' }}>
                  News &amp; Events
                  <span style={{ display: 'block', height: 3, width: '60%', background: 'linear-gradient(90deg,#4ade80,transparent)', borderRadius: 2, marginTop: 6 }} />
                </h2>
              </div>
              <Link to="/news" style={{ color: '#4ade80', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none' }}>View all news →</Link>
            </div>
          </Reveal>

          {newsLoading ? (
            /* Skeleton */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 24 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ backgroundColor: '#111', border: '1px solid #1e1e1e', borderRadius: 14, overflow: 'hidden', height: 340 }}>
                  <div style={{ height: 190, backgroundColor: '#1a1a1a' }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 14, width: '80%', backgroundColor: '#1e1e1e', borderRadius: 4, marginBottom: 10 }} />
                    <div style={{ height: 12, width: '60%', backgroundColor: '#1a1a1a', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : latestNews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#525252', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              No news yet — check back soon.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 24 }}>
              {latestNews.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.12}>
                  <HomeNewsCard item={item} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ padding: '96px 0', borderBottom: '1px solid #1a1a1a' }}>
        <div className="container">
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                  FEATURED SOLUTIONS
                </p>
                <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>Flagship Products</h2>
              </div>
              <Link to="/products" style={{ color: '#4ade80', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none' }}>View all products →</Link>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
            {featuredProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.12}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5G CTA ── */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{
          background: 'linear-gradient(135deg,#0d1a0f 0%,#0a0a0a 100%)',
          border: '1px solid #1a2e1f', borderRadius: 20,
          padding: '64px 52px', position: 'relative', overflow: 'hidden',
          maxWidth: 1152, margin: '0 auto',
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle,rgba(74,222,128,0.1) 0%,transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, background: 'radial-gradient(circle,rgba(34,211,238,0.06) 0%,transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(#4ade80 1px,transparent 1px),linear-gradient(90deg,#4ade80 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 40 }}>
            <div style={{ maxWidth: 520 }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em' }}>PRIVATE 5G INFRASTRUCTURE</span>
              <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', marginTop: 12, marginBottom: 16 }}>Deploy Your Own<br />Private 5G Network</h2>
              <p style={{ color: '#a3a3a3', lineHeight: 1.85 }}>
                Complete private 5G solutions — from core network software to RAN hardware integration. Built on Open5GS with Nokia gNB validation.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 210 }}>
              {[
                { label: 'Core Network', val: 'Open5GS / OAI', color: '#4ade80' },
                { label: 'Radio Unit',   val: 'Nokia gNB',     color: '#22d3ee' },
                { label: 'Standard',     val: '3GPP R15/16',   color: '#a78bfa' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, padding: '8px 0', borderBottom: '1px solid #1a2e1f' }}>
                  <span style={{ fontSize: '0.75rem', color: '#737373', fontFamily: 'var(--font-mono)' }}>{r.label}</span>
                  <span style={{ fontSize: '0.8rem', color: r.color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
              <Link to="/5g" className="btn-green" style={{
                backgroundColor: '#4ade80', color: '#0a0a0a',
                padding: '12px 28px', borderRadius: 8,
                fontWeight: 700, fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                textTransform: 'uppercase', fontSize: '0.82rem',
                display: 'inline-block', marginTop: 8, textDecoration: 'none', textAlign: 'center',
              }}>Explore 5G Details</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE PARTNERS ── */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid #1a1a1a', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#404040', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 28 }}>
          TECHNOLOGY PARTNERS &amp; ECOSYSTEM
        </p>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(90deg,#0a0a0a,transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(270deg,#0a0a0a,transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', width: 'max-content' }}>
            {partners.map((p, i) => (
              <span key={i} style={{
                fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontWeight: 700,
                textTransform: 'uppercase', fontSize: '0.88rem', color: '#2e2e2e',
                letterSpacing: '0.06em', padding: '0 44px', whiteSpace: 'nowrap',
              }}>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <Reveal>
            <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>LET'S BUILD TOGETHER</p>
            <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', marginBottom: 18, lineHeight: 1.2 }}>Ready to Build the Future?</h2>
            <p style={{ color: '#a3a3a3', lineHeight: 1.85, marginBottom: 40 }}>
              Talk to our engineers about your 5G, IoT, or AI infrastructure needs. We work directly with universities, enterprises, and government agencies.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn-green" style={{
                backgroundColor: '#4ade80', color: '#0a0a0a',
                padding: '14px 40px', borderRadius: 8,
                fontWeight: 700, fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                textTransform: 'uppercase', fontSize: '0.88rem',
                display: 'inline-block', textDecoration: 'none',
              }}>Get in Touch</Link>
              <Link to="/products" className="btn-ghost" style={{
                backgroundColor: 'transparent', color: '#a3a3a3',
                padding: '14px 40px', borderRadius: 8, fontWeight: 600, fontSize: '0.88rem',
                border: '1px solid #303030', display: 'inline-block', textDecoration: 'none', transition: 'all 0.2s',
              }}>Browse Products</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ──────────────── Sub-components ──────────────── */

function HomeNewsCard({ item }) {
  const isEvent = item.category === 'event';
  const accent  = NEWS_CATEGORY_COLORS[item.category] || '#4ade80';
  const fmt = d => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  return (
    <Link to={`/news/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="news-card" style={{
        backgroundColor: '#111', border: '1px solid #262626',
        borderRadius: 14, overflow: 'hidden', '--accent': accent,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ position: 'relative', height: 195, backgroundColor: '#1a1a1a', overflow: 'hidden', flexShrink: 0 }}>
          {item.image_path
            ? <img className="card-img" src={`/uploads/${item.image_path}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{isEvent ? '🎪' : '📰'}</div>
          }
          <span style={{
            position: 'absolute', top: 12, right: 12,
            backgroundColor: accent, color: '#0a0a0a',
            fontSize: '0.6rem', fontWeight: 700, padding: '4px 10px',
            borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)',
          }}>{isEvent ? 'Event' : 'News'}</span>
        </div>
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontSize: '0.9rem', marginBottom: 10, lineHeight: 1.45,
            fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{item.title}</h3>
          <p style={{
            fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.6, marginBottom: 14, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{item.excerpt}</p>
          <p style={{ fontSize: '0.7rem', color: '#4ade80', fontFamily: 'var(--font-mono)' }}>
            {fmt(item.event_date || item.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ProductCard({ product }) {
  const cat   = product.category;
  const color = CATEGORY_COLORS[cat] || '#4ade80';
  const label = CATEGORY_LABELS[cat] || cat;

  return (
    <Link to={`/products/${slugify(product.name)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="prod-card" style={{
        backgroundColor: '#111', border: '1px solid #262626',
        borderRadius: 14, overflow: 'hidden', '--accent': color,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          height: 195, backgroundColor: '#1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          {product.image_path
            ? <img className="card-img" src={`/uploads/${product.image_path}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ fontSize: '2.5rem' }}>{cat === '5g' ? '📡' : cat === 'iot' ? '🔌' : cat === 'ai' ? '🤖' : '🔧'}</div>
          }
          <span style={{
            position: 'absolute', top: 12, left: 12,
            backgroundColor: 'rgba(0,0,0,0.85)', border: `1px solid ${color}`, color,
            fontSize: '0.62rem', fontFamily: 'var(--font-mono)',
            padding: '3px 9px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>{label}</span>
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
                <span key={tag} style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: '#737373', border: '1px solid #2a2a2a', borderRadius: 4, padding: '2px 6px' }}>
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
