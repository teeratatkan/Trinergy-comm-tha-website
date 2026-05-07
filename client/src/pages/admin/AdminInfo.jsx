import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const INFO_FIELDS = [
  { key: 'company_name', label: 'Company Name', type: 'text' },
  { key: 'founded_year', label: 'Founded Year', type: 'text' },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'phone_sales_ext', label: 'Phone (Sales Ext)', type: 'text' },
  { key: 'phone_support_ext', label: 'Phone (Support Ext)', type: 'text' },
  { key: 'phone_service_ext', label: 'Phone (Service Ext)', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'line_id', label: 'LINE ID', type: 'text' },
  { key: 'website', label: 'Website', type: 'text' },
  { key: 'address', label: 'Address', type: 'text' },
  { key: 'values', label: 'Core Values', type: 'text' },
  { key: 'technology_pillars', label: 'Technology Pillars', type: 'text' },
  { key: 'about_text', label: 'About Text', type: 'textarea' },
];

export default function AdminInfo() {
  const { token } = useAuth();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/info')
      .then(res => { setForm(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    setSaved(false);
    try {
      await axios.put('/api/info', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          CONFIGURATION
        </p>
        <h2 style={{ fontSize: '1.8rem' }}>Company Information</h2>
        <p style={{ color: '#737373', fontSize: '0.85rem', marginTop: 4 }}>
          Edit company details shown throughout the website.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#a3a3a3' }}>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: 12,
            overflow: 'hidden',
            marginBottom: 24,
          }}>
            {INFO_FIELDS.map((field, idx) => (
              <div
                key={field.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '220px 1fr',
                  alignItems: 'start',
                  borderBottom: idx < INFO_FIELDS.length - 1 ? '1px solid #1a1a1a' : 'none',
                  padding: '16px 24px',
                  gap: 24,
                }}
              >
                <div style={{ paddingTop: 8 }}>
                  <p style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {field.label}
                  </p>
                  <p style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#404040', marginTop: 2 }}>
                    {field.key}
                  </p>
                </div>
                <div>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.key}
                      value={form[field.key] || ''}
                      onChange={handleChange}
                      rows={4}
                      style={{
                        width: '100%',
                        backgroundColor: '#0d0d0d',
                        border: '1px solid #262626',
                        borderRadius: 8,
                        padding: '10px 14px',
                        color: '#f5f5f5',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                        outline: 'none',
                        lineHeight: 1.6,
                      }}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.key}
                      value={form[field.key] || ''}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        backgroundColor: '#0d0d0d',
                        border: '1px solid #262626',
                        borderRadius: 8,
                        padding: '10px 14px',
                        color: '#f5f5f5',
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ marginBottom: 16, color: '#f87171', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 16px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {saved && (
            <div style={{ marginBottom: 16, color: '#4ade80', backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '10px 16px', fontSize: '0.85rem' }}>
              Company information saved successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              backgroundColor: saving ? '#2d6e45' : '#4ade80',
              color: '#0a0a0a',
              padding: '12px 32px',
              borderRadius: 8,
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}
    </div>
  );
}
