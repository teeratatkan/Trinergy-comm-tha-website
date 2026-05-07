import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const NF_LIST = ['AMF', 'SMF', 'UPF', 'PCF', 'NRF', 'SCP', 'UDM', 'AUSF', 'BSF', 'NSSF'];

const USE_CASES = [
  {
    icon: '🏭',
    title: 'Smart Factory',
    desc: 'Ultra-low latency private 5G for industrial automation, URLLC applications, and real-time machine control.',
  },
  {
    icon: '🎓',
    title: 'University Lab',
    desc: 'Full O-RAN stack for academic research. Explore NF configuration, RAN slicing, and protocol-layer experiments.',
  },
  {
    icon: '🏥',
    title: 'Healthcare',
    desc: 'Secure isolated 5G for medical IoT, real-time patient monitoring, and critical imaging data transport.',
  },
  {
    icon: '🌆',
    title: 'Smart City',
    desc: 'Scalable private 5G backbone for traffic management, surveillance, environmental sensors, and edge compute.',
  },
];

export default function FiveG() {
  const [specs, setSpecs] = useState([]);

  useEffect(() => {
    axios.get('/api/5g-specs')
      .then(res => setSpecs(res.data))
      .catch(() => {});
  }, []);

  const getSpec = (key) => {
    const found = specs.find(s => s.spec_key === key);
    return found ? found.spec_value : '—';
  };

  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1a0f 50%, #0a0a0a 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #262626',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div style={{
          position: 'absolute', top: '10%', right: '5%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            PRIVATE 5G INFRASTRUCTURE
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginTop: 16, marginBottom: 20, maxWidth: 720 }}>
            Thailand's First{' '}
            <span style={{ color: '#4ade80' }}>Open-Source 5G Core</span>
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1.05rem', maxWidth: 600, lineHeight: 1.8, marginBottom: 36 }}>
            Built on Open5GS. Validated with Nokia gNB at TOT 5G Test Base. Achieving 940 Mb/s throughput with 0% packet loss. All 10 Network Functions live.
          </p>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { val: '940 Mb/s', label: 'Throughput' },
              { val: '0%', label: 'Packet Loss' },
              { val: '10/10', label: 'NFs Active' },
              { val: 'TRL 8', label: 'Maturity' },
            ].map(s => (
              <div key={s.val} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', color: '#4ade80', fontWeight: 600 }}>{s.val}</div>
                <div style={{ fontSize: '0.75rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            SYSTEM ARCHITECTURE
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 48 }}>Technical Specifications</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {/* Infrastructure */}
            <SpecCard title="Infrastructure" color="#4ade80">
              <SpecRow label="Core Stack" value={getSpec('Core Stack')} accent />
              <SpecRow label="RAN Hardware" value={getSpec('RAN Hardware')} />
              <SpecRow label="Test Location" value={getSpec('Test Location')} />
              <SpecRow label="Protocol" value={getSpec('Protocol')} />
            </SpecCard>

            {/* Performance */}
            <SpecCard title="Performance Results" color="#22d3ee">
              <SpecRow label="Peak Throughput" value={getSpec('Throughput')} accent />
              <SpecRow label="Packet Loss" value={getSpec('Packet Loss')} accent />
              <SpecRow label="Protocol Stack" value="5G NR SA" />
              <SpecRow label="Band" value="Sub-6GHz / mmWave" />
            </SpecCard>

            {/* Deployment */}
            <SpecCard title="Cloud-Native Deployment" color="#a78bfa">
              <SpecRow label="Orchestration" value={getSpec('Orchestration')} />
              <SpecRow label="Monitoring" value={getSpec('Monitoring')} />
              <SpecRow label="Simulator" value={getSpec('Simulator')} />
              <SpecRow label="CI/CD" value="GitOps / Helm Charts" />
            </SpecCard>
          </div>
        </div>
      </section>

      {/* Network Functions */}
      <section style={{ padding: '60px 0', background: '#0d0d0d', borderTop: '1px solid #262626', borderBottom: '1px solid #262626' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            3GPP SA ARCHITECTURE
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 12 }}>All 10 Network Functions — All Active</h2>
          <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: 40 }}>
            Full 3GPP 5G SA core deployment. Every NF independently scalable via Kubernetes.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 16 }}>
            {NF_LIST.map(nf => (
              <div key={nf} style={{
                backgroundColor: '#111111',
                border: '1px solid #1a2e1f',
                borderRadius: 10,
                padding: '20px 16px',
                textAlign: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  backgroundColor: '#4ade80',
                  margin: '0 auto 12px',
                  boxShadow: '0 0 8px #4ade80',
                }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600, color: '#4ade80' }}>
                  {nf}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#4ade80', marginTop: 6, opacity: 0.7 }}>ACTIVE</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* บพข Grant */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: 16,
            padding: 48,
            background: 'linear-gradient(135deg, #111111 0%, #0d1a0f 100%)',
          }}>
            <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              GOVERNMENT R&D GRANT
            </p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: 24 }}>
              บพข. Research Grant — National Competitiveness
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
              {[
                { label: 'Grant Value', val: 'THB 11.67M' },
                { label: 'TRL Progress', val: '4 → 8' },
                { label: 'ROI Multiple', val: '3.9×' },
                { label: 'Status', val: 'Completed' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.75rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', color: '#4ade80', fontWeight: 600 }}>
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            DEPLOYMENT SCENARIOS
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 40 }}>Use Cases</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {USE_CASES.map(uc => (
              <div key={uc.title} style={{
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderRadius: 12,
                padding: 28,
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#4ade80'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#262626'}>
                <div style={{ fontSize: '2rem', marginBottom: 16 }}>{uc.icon}</div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: 10 }}>{uc.title}</h3>
                <p style={{ fontSize: '0.83rem', color: '#a3a3a3', lineHeight: 1.7 }}>{uc.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/contact" style={{
              backgroundColor: '#4ade80',
              color: '#0a0a0a',
              padding: '14px 40px',
              borderRadius: 8,
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              display: 'inline-block',
            }}>
              Request a 5G Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SpecCard({ title, color, children }) {
  return (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #262626',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'block', flexShrink: 0 }} />
        <h3 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: color }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: '8px 0' }}>
        {children}
      </div>
    </div>
  );
}

function SpecRow({ label, value, accent }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid #141414',
    }}>
      <span style={{ fontSize: '0.8rem', color: '#737373', fontFamily: 'var(--font-mono)' }}>{label}</span>
      <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: accent ? '#4ade80' : '#f5f5f5', fontWeight: accent ? 600 : 400 }}>
        {value}
      </span>
    </div>
  );
}
