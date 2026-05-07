import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0d0d0d',
      borderTop: '1px solid #262626',
      padding: '60px 0 0',
      marginTop: 80,
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48,
          paddingBottom: 48,
        }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src="/logo.png" alt="Trinergy" style={{ height: 36, objectFit: 'contain' }} />
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontStyle: 'italic',
                fontSize: '1rem',
                textTransform: 'uppercase',
                color: '#f5f5f5',
              }}>TRINERGY</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#a3a3a3', lineHeight: 1.7, maxWidth: 240 }}>
              Engineering Intelligent Infrastructure for the Digital Future
            </p>
            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              {['5G', 'IoT', 'AI', 'Fiber', 'RF'].map(tag => (
                <span key={tag} style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#4ade80',
                  border: '1px solid rgba(74,222,128,0.3)',
                  borderRadius: 4,
                  padding: '2px 6px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase', color: '#4ade80', letterSpacing: '0.1em', marginBottom: 16 }}>
              Products
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['SEED-IOT Kit', 'AI Lab Kit', '5G Private Network', 'OAIBOX™', 'UData Platform', 'GEN TRI'].map(item => (
                <li key={item}>
                  <Link to="/products" style={{ fontSize: '0.85rem', color: '#a3a3a3', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#4ade80'}
                    onMouseLeave={e => e.target.style.color = '#a3a3a3'}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase', color: '#4ade80', letterSpacing: '0.1em', marginBottom: 16 }}>
              Solutions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Private 5G Networks', 'Smart Factory IoT', 'AI & Machine Learning', 'Fiber Optics', 'University R&D Kits', 'Smart Agriculture'].map(item => (
                <li key={item}>
                  <Link to="/industries" style={{ fontSize: '0.85rem', color: '#a3a3a3', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#4ade80'}
                    onMouseLeave={e => e.target.style.color = '#a3a3a3'}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase', color: '#4ade80', letterSpacing: '0.1em', marginBottom: 16 }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Industries', to: '/industries' },
                { label: 'Private 5G', to: '/5g' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} style={{ fontSize: '0.85rem', color: '#a3a3a3', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#4ade80'}
                    onMouseLeave={e => e.target.style.color = '#a3a3a3'}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>info@trinergy.co.th</p>
              <p style={{ fontSize: '0.8rem', color: '#a3a3a3', marginTop: 4 }}>+66 2645 4588</p>
              <p style={{ fontSize: '0.8rem', color: '#a3a3a3', marginTop: 4 }}>LINE: @trinergycomm</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid #1a1a1a',
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: '0.8rem', color: '#737373' }}>
            © 2026 Trinergy Comm-THA Co., Ltd. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80' }}>
            TRUST · TEAMWORK · TECHNOLOGY
          </p>
        </div>
      </div>
    </footer>
  );
}
