import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) navigate('/admin', { replace: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      login(res.data.token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src="/logo.png" alt="Trinergy" style={{ height: 48, objectFit: 'contain', marginBottom: 12 }} />
          <h1 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase', color: '#f5f5f5', marginBottom: 4 }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#737373', fontFamily: 'var(--font-mono)' }}>
            TRINERGY COMM-THA CO., LTD.
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: 14,
          padding: 36,
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#a3a3a3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin"
                style={{
                  width: '100%',
                  backgroundColor: '#0d0d0d',
                  border: '1px solid #262626',
                  borderRadius: 8,
                  padding: '11px 14px',
                  color: '#f5f5f5',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#a3a3a3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••••"
                style={{
                  width: '100%',
                  backgroundColor: '#0d0d0d',
                  border: '1px solid #262626',
                  borderRadius: 8,
                  padding: '11px 14px',
                  color: '#f5f5f5',
                  fontSize: '0.9rem',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: '0.83rem',
                color: '#f87171',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#2d6e45' : '#4ade80',
                color: '#0a0a0a',
                padding: '12px',
                borderRadius: 8,
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.75rem', color: '#404040' }}>
          Secured with JWT · Trinergy Admin
        </p>
      </div>
    </div>
  );
}
