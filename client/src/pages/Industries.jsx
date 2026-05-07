import React from 'react';
import { Link } from 'react-router-dom';

const INDUSTRIES = [
  {
    icon: '🎓',
    title: 'University & Research',
    desc: 'Private 5G testbeds, IoT research platforms, OAIBOX™ for O-RAN experiments, and AI lab kits for academic institutions.',
    tags: ['5G Testbed', 'O-RAN', 'AI Labs'],
    color: '#4ade80',
  },
  {
    icon: '🏭',
    title: 'Smart Factory',
    desc: 'Industrial IoT with RS485/Modbus integration, URLLC 5G connectivity, edge AI for predictive maintenance.',
    tags: ['Industrial IoT', 'URLLC', 'Edge AI'],
    color: '#22d3ee',
  },
  {
    icon: '🌾',
    title: 'Agriculture',
    desc: 'Super Crops platform with multi-sensor arrays, auto-irrigation, soil analytics, and LINE alert integration.',
    tags: ['Smart Farm', 'Edge AI', 'Sensors'],
    color: '#86efac',
  },
  {
    icon: '📡',
    title: 'Telecom',
    desc: 'End-to-end telecom solutions: fiber FTTX training, RF equipment, 5G core deployment, and network monitoring.',
    tags: ['Fiber', '5G Core', 'RF'],
    color: '#fb923c',
  },
  {
    icon: '🏥',
    title: 'Healthcare',
    desc: 'Secure private 5G for medical IoT devices, real-time patient monitoring, DICOM imaging, and critical data transport.',
    tags: ['Medical IoT', '5G SA', 'Security'],
    color: '#f472b6',
  },
  {
    icon: '🛡️',
    title: 'Defense & Government',
    desc: 'Sovereign AI deployments, encrypted private 5G, on-premise data sovereignty with GEN TRI Thai LLM.',
    tags: ['Sovereign AI', 'Private 5G', 'Encryption'],
    color: '#94a3b8',
  },
  {
    icon: '🌆',
    title: 'Smart City',
    desc: 'Scalable 5G/IoT infrastructure for traffic management, environmental monitoring, and distributed edge compute.',
    tags: ['IoT Sensors', '5G', 'Edge'],
    color: '#fbbf24',
  },
  {
    icon: '📦',
    title: 'Logistics & Warehousing',
    desc: 'Real-time asset tracking, industrial IoT, RFID integration, and private 5G coverage for large warehouse facilities.',
    tags: ['Asset Tracking', 'RFID', 'Private 5G'],
    color: '#a78bfa',
  },
];

export default function Industries() {
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
            SECTORS WE SERVE
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>Industries</h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', maxWidth: 560 }}>
            Deploying intelligent infrastructure across Thailand's key economic sectors.
          </p>
        </div>
      </div>

      {/* Grid */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {INDUSTRIES.map(ind => (
              <div key={ind.title} style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderRadius: 14,
                padding: 28,
                transition: 'border-color 0.2s, transform 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ind.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#262626'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 18 }}>{ind.icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: 10, color: '#f5f5f5' }}>{ind.title}</h3>
                <p style={{ fontSize: '0.83rem', color: '#a3a3a3', lineHeight: 1.7, marginBottom: 18 }}>{ind.desc}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ind.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      color: ind.color,
                      border: `1px solid ${ind.color}40`,
                      borderRadius: 4,
                      padding: '2px 7px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0 80px', textAlign: 'center', borderTop: '1px solid #1a1a1a' }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 16 }}>
            Don't See Your Industry?
          </h2>
          <p style={{ color: '#a3a3a3', marginBottom: 32, lineHeight: 1.8 }}>
            Our technology stack is adaptable. Contact our engineering team to discuss your specific infrastructure requirements.
          </p>
          <Link to="/contact" style={{
            backgroundColor: '#4ade80',
            color: '#0a0a0a',
            padding: '14px 36px',
            borderRadius: 8,
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '0.9rem',
            display: 'inline-block',
          }}>
            Talk to an Engineer
          </Link>
        </div>
      </section>
    </div>
  );
}
