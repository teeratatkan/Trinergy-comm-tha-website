import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VALUES = [
  { word: 'TRUST', icon: '🔐', desc: 'We build relationships based on integrity, transparency, and long-term commitment to our clients.' },
  { word: 'TEAMWORK', icon: '🤝', desc: 'Cross-functional collaboration between hardware engineers, software developers, and domain experts.' },
  { word: 'TECHNOLOGY', icon: '⚡', desc: 'Continuously pushing boundaries with Open Source, cloud-native, and cutting-edge radio technologies.' },
];

const COMPETENCIES = [
  '5G Core Network Deployment (Open5GS)',
  'RAN Integration & Nokia gNB Configuration',
  'Cloud-Native Kubernetes Orchestration',
  'Industrial IoT Platform Development',
  'AI & Machine Learning Solutions',
  'Fiber Optics (FTTX) Engineering',
  'RF System Design & Integration',
  'Thai Language AI (Sovereign LLM)',
  'Smart Agriculture IoT Platforms',
  'University 5G/O-RAN Lab Kits',
];

export default function About() {
  const [info, setInfo] = useState({});

  useEffect(() => {
    axios.get('/api/info')
      .then(res => setInfo(res.data))
      .catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0d1a0f 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #262626',
        padding: '80px 0 60px',
      }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            ABOUT THE COMPANY
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 20 }}>
            Trinergy Comm-THA Co., Ltd.
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#a3a3a3', maxWidth: 600, lineHeight: 1.8 }}>
            {info.tagline || 'Engineering Intelligent Infrastructure for the Digital Future'}
          </p>
          <div style={{ display: 'flex', gap: 32, marginTop: 40, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: '#4ade80', fontWeight: 600 }}>
                {info.founded_year || '2019'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Founded</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: '#4ade80', fontWeight: 600 }}>Bangkok</div>
              <div style={{ fontSize: '0.75rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Headquarters</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: '#4ade80', fontWeight: 600 }}>Thailand</div>
              <div style={{ fontSize: '0.75rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>Primary Market</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission + About */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                OUR MISSION
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', marginBottom: 20 }}>
                Building Thailand's Digital Backbone
              </h2>
              <p style={{ color: '#a3a3a3', lineHeight: 1.9, fontSize: '0.95rem' }}>
                {info.about_text || 'Trinergy Comm-THA Co., Ltd. was founded in 2019 with a mission to engineer intelligent telecommunications infrastructure for Thailand and the region.'}
              </p>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                TECHNOLOGY PILLARS
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
                {['5G', 'IoT', 'AI', 'Fiber', 'RF'].map(pillar => (
                  <span key={pillar} style={{
                    fontSize: '0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: '#4ade80',
                    backgroundColor: 'rgba(74,222,128,0.1)',
                    border: '1px solid rgba(74,222,128,0.3)',
                    borderRadius: 8,
                    padding: '8px 16px',
                  }}>
                    {pillar}
                  </span>
                ))}
              </div>

              <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                CORE COMPETENCIES
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {COMPETENCIES.map(item => (
                  <li key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.85rem', color: '#a3a3a3' }}>
                    <span style={{ color: '#4ade80', flexShrink: 0, marginTop: 2 }}>▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '60px 0 80px', background: '#0d0d0d', borderTop: '1px solid #1a1a1a' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, textAlign: 'center' }}>
            CORE VALUES
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 48, textAlign: 'center' }}>
            TRUST · TEAMWORK · TECHNOLOGY
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {VALUES.map(val => (
              <div key={val.word} style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderRadius: 12,
                padding: 32,
                textAlign: 'center',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4ade80'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#262626'}>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{val.icon}</div>
                <h3 style={{ fontSize: '1.1rem', color: '#4ade80', marginBottom: 12 }}>{val.word}</h3>
                <p style={{ fontSize: '0.83rem', color: '#a3a3a3', lineHeight: 1.7 }}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
