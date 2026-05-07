import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/products'),
      axios.get('/api/info'),
    ]).then(([pRes, iRes]) => {
      setProducts(pRes.data);
      setInfo(iRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = {
    iot: products.filter(p => p.category === 'iot').length,
    ai: products.filter(p => p.category === 'ai').length,
    '5g': products.filter(p => p.category === '5g').length,
    telecom: products.filter(p => p.category === 'telecom').length,
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          OVERVIEW
        </p>
        <h2 style={{ fontSize: '1.8rem' }}>Dashboard</h2>
        <p style={{ color: '#737373', fontSize: '0.85rem', marginTop: 4 }}>
          Welcome back. Manage your products and company information.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#a3a3a3' }}>Loading...</p>
      ) : (
        <>
          {/* Stats cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
            <StatCard value={products.length} label="Total Products" color="#4ade80" link="/admin/products" />
            <StatCard value={categories.iot} label="IoT Products" color="#22d3ee" />
            <StatCard value={categories.ai} label="AI Products" color="#a78bfa" />
            <StatCard value={categories['5g']} label="5G Products" color="#4ade80" />
            <StatCard value={categories.telecom} label="Telecom Products" color="#fb923c" />
          </div>

          {/* Company info summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            <div style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: 12,
              padding: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a3a3a3' }}>
                  Company Info
                </h3>
                <Link to="/admin/info" style={{ fontSize: '0.78rem', color: '#4ade80' }}>Edit →</Link>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Company', info.company_name],
                    ['Founded', info.founded_year],
                    ['Email', info.email],
                    ['Phone', info.phone],
                    ['LINE', info.line_id],
                    ['Website', info.website],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '8px 0', fontSize: '0.78rem', color: '#737373', fontFamily: 'var(--font-mono)', width: '35%' }}>{k}</td>
                      <td style={{ padding: '8px 0', fontSize: '0.83rem', color: '#f5f5f5' }}>{v || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              backgroundColor: '#111111',
              border: '1px solid #262626',
              borderRadius: 12,
              padding: 24,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a3a3a3' }}>
                  Recent Products
                </h3>
                <Link to="/admin/products" style={{ fontSize: '0.78rem', color: '#4ade80' }}>Manage →</Link>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {products.slice(0, 5).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '8px 0', fontSize: '0.83rem', color: '#f5f5f5' }}>{p.name}</td>
                      <td style={{ padding: '8px 0', textAlign: 'right' }}>
                        <span style={{
                          fontSize: '0.65rem',
                          fontFamily: 'var(--font-mono)',
                          color: p.category === '5g' ? '#4ade80' : p.category === 'iot' ? '#22d3ee' : p.category === 'ai' ? '#a78bfa' : '#fb923c',
                          border: '1px solid currentColor',
                          borderRadius: 4,
                          padding: '2px 6px',
                          textTransform: 'uppercase',
                          opacity: 0.7,
                        }}>
                          {p.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ value, label, color, link }) {
  const content = (
    <div style={{
      backgroundColor: '#111111',
      border: '1px solid #262626',
      borderRadius: 12,
      padding: 24,
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => link && (e.currentTarget.style.borderColor = color)}
    onMouseLeave={e => link && (e.currentTarget.style.borderColor = '#262626')}>
      <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: '#737373', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
  return link ? <Link to={link} style={{ textDecoration: 'none' }}>{content}</Link> : content;
}
