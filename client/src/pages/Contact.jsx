import React, { useState } from 'react';
import axios from 'axios';

const SOLUTIONS = [
  'Private 5G Network',
  'IoT Platform',
  'AI / Machine Learning',
  'Fiber Optics (FTTX)',
  'RF Engineering',
  'University / R&D Lab Kit',
  'Smart Agriculture',
  'Other',
];

/* Google Maps embed — coordinates from resolved share link */
const MAP_EMBED =
  'https://maps.google.com/maps?q=13.7716775,100.5738536&z=17&output=embed';
const MAP_LINK  = 'https://maps.app.goo.gl/FP3UnBzuatiqSBNa8';

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', solution: '', message: '' });
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/contact', form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 64, background: '#0a0a0a', minHeight: '100vh', color: '#f5f5f5', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0d1a0f 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #262626',
        padding: '60px 0 40px',
      }}>
        <div className="container">
          <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            GET IN TOUCH
          </p>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', marginBottom: 16 }}>Contact Us</h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', maxWidth: 480, lineHeight: 1.7 }}>
            Tell us about your project and we'll connect you with the right engineer.
          </p>
        </div>
      </div>

      {/* ── Form + Info ── */}
      <section style={{ padding: '64px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 56 }}>

            {/* ── Left: Form ── */}
            <div>
              <h2 style={{ fontSize: '1.15rem', marginBottom: 32, fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase' }}>
                Send a Message
              </h2>

              {submitted ? (
                <div style={{
                  backgroundColor: 'rgba(74,222,128,0.08)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  borderRadius: 14, padding: '48px 36px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontSize: '1.1rem', color: '#4ade80', marginBottom: 10 }}>Message Sent!</h3>
                  <p style={{ color: '#a3a3a3', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    Thank you, <strong style={{ color: '#f5f5f5' }}>{form.name}</strong>.<br />
                    Our team will reach out within 1 business day.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name:'',company:'',email:'',solution:'',message:'' }); }}
                    style={{
                      marginTop: 24, background: 'none', border: '1px solid #262626',
                      color: '#a3a3a3', borderRadius: 8, padding: '8px 20px',
                      cursor: 'pointer', fontSize: '0.82rem',
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Field label="Full Name *" name="name"    value={form.name}    onChange={handleChange} required placeholder="Your name" />
                    <Field label="Company"     name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
                  </div>
                  <Field label="Email *" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" />

                  {/* Solution select */}
                  <div>
                    <label style={labelStyle}>Solution Interest</label>
                    <select name="solution" value={form.solution} onChange={handleChange} style={{
                      ...inputStyle, appearance: 'none',
                      color: form.solution ? '#f5f5f5' : '#737373',
                    }}>
                      <option value="">Select a solution...</option>
                      {SOLUTIONS.map(s => <option key={s} value={s} style={{ backgroundColor: '#111', color: '#f5f5f5' }}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={labelStyle}>Message *</label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange} required rows={5}
                      placeholder="Describe your project or question..."
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  {error && (
                    <p style={{ color: '#f87171', fontSize: '0.82rem', backgroundColor: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '10px 14px' }}>
                      {error}
                    </p>
                  )}

                  <button type="submit" disabled={loading} style={{
                    backgroundColor: loading ? '#2d6e45' : '#4ade80',
                    color: '#0a0a0a', padding: '13px 32px', borderRadius: 8,
                    fontWeight: 700, fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                    textTransform: 'uppercase', fontSize: '0.88rem',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s', alignSelf: 'flex-start',
                  }}>
                    {loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* ── Right: Info + Map ── */}
            <div>
              <h2 style={{ fontSize: '1.15rem', marginBottom: 32, fontFamily: 'var(--font-heading)', fontStyle: 'italic', textTransform: 'uppercase' }}>
                Contact Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginBottom: 36 }}>
                <ContactInfo icon="📞" label="Phone" lines={['+66 2645 4588','Sales: #143–144','Support: #220–223','Service: #261–263']} />
                <ContactInfo icon="✉️" label="Email" lines={['info@trinergy.co.th']} />
                <ContactInfo icon="💬" label="LINE"  lines={['@trinergycomm']} />
                <ContactInfo icon="🌐" label="Website" lines={['www.trinergy.co.th']} />
                <ContactInfo
                  icon="📍"
                  label="Address"
                  lines={['Trinergy Instrument Co., Ltd', 'Bangkok, Thailand']}
                  extra={
                    <a
                      href={MAP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: '#4ade80', marginTop: 4, display: 'inline-block', textDecoration: 'none' }}
                    >
                      Open in Google Maps →
                    </a>
                  }
                />
              </div>

              {/* Values */}
              <div style={{
                backgroundColor: '#111', border: '1px solid #262626',
                borderRadius: 12, padding: '18px 24px', marginBottom: 28,
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  OUR COMMITMENT
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['TRUST','TEAMWORK','TECHNOLOGY'].map(v => (
                    <span key={v} style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '0.85rem', color: '#4ade80', fontWeight: 700 }}>{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full-width Map ── */}
      <section style={{ borderTop: '1px solid #1a1a1a' }}>
        <div style={{ position: 'relative' }}>
          {/* Map header bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 32px',
            backgroundColor: '#0d1a0f',
            borderBottom: '1px solid #1a2e1f',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1rem' }}>📍</span>
              <div>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f5f5f5', margin: 0 }}>Trinergy Instrument Co., Ltd</p>
                <p style={{ fontSize: '0.72rem', color: '#737373', fontFamily: 'var(--font-mono)', margin: 0 }}>Bangkok, Thailand</p>
              </div>
            </div>
            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#4ade80', color: '#0a0a0a',
                padding: '8px 18px', borderRadius: 7,
                fontSize: '0.78rem', fontWeight: 700,
                fontFamily: 'var(--font-heading)', fontStyle: 'italic',
                textTransform: 'uppercase', letterSpacing: '0.04em',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              Open in Maps ↗
            </a>
          </div>

          {/* Iframe */}
          <div style={{ position: 'relative', height: 420, overflow: 'hidden' }}>
            <iframe
              title="Trinergy Comm-THA Office Location"
              src={MAP_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Dark overlay tint so map matches the dark theme */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'rgba(10,10,10,0.12)',
            }} />
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Shared styles ── */
const labelStyle = {
  display: 'block', fontSize: '0.76rem', color: '#a3a3a3',
  marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em',
  fontFamily: 'var(--font-mono)',
};
const inputStyle = {
  width: '100%', backgroundColor: '#111111', border: '1px solid #262626',
  borderRadius: 8, padding: '10px 14px', color: '#f5f5f5',
  fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
};

/* ── Sub-components ── */
function Field({ label, name, value, onChange, type = 'text', required, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...inputStyle, borderColor: focused ? '#4ade80' : '#262626', transition: 'border-color 0.2s' }}
      />
    </div>
  );
}

function ContactInfo({ icon, label, lines, extra }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8, flexShrink: 0,
        backgroundColor: 'rgba(74,222,128,0.08)',
        border: '1px solid rgba(74,222,128,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.05rem',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</p>
        {lines.map((line, i) => (
          <p key={i} style={{ fontSize: '0.88rem', color: i === 0 ? '#f5f5f5' : '#a3a3a3', lineHeight: 1.65, margin: 0 }}>{line}</p>
        ))}
        {extra}
      </div>
    </div>
  );
}
