import React, { useState } from 'react';

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

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    solution: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

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
            GET IN TOUCH
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>Contact Us</h1>
          <p style={{ color: '#a3a3a3', fontSize: '1rem', maxWidth: 480 }}>
            Tell us about your project and we'll connect you with the right engineer.
          </p>
        </div>
      </div>

      <section style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>
            {/* Contact Form */}
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 32 }}>Send a Message</h2>

              {submitted ? (
                <div style={{
                  backgroundColor: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  borderRadius: 12,
                  padding: 40,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                  <h3 style={{ fontSize: '1.1rem', color: '#4ade80', marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: '#a3a3a3', fontSize: '0.9rem' }}>
                    Thank you, {form.name}. Our team will reach out within 1 business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Field label="Full Name *" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
                    <Field label="Company" name="company" value={form.company} onChange={handleChange} placeholder="Company name" />
                  </div>
                  <Field label="Email *" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" />
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#a3a3a3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                      Solution Interest
                    </label>
                    <select
                      name="solution"
                      value={form.solution}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        backgroundColor: '#111111',
                        border: '1px solid #262626',
                        borderRadius: 8,
                        padding: '10px 14px',
                        color: form.solution ? '#f5f5f5' : '#737373',
                        fontSize: '0.875rem',
                        outline: 'none',
                        appearance: 'none',
                      }}
                    >
                      <option value="">Select a solution...</option>
                      {SOLUTIONS.map(s => (
                        <option key={s} value={s} style={{ backgroundColor: '#111111', color: '#f5f5f5' }}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#a3a3a3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Describe your project or question..."
                      style={{
                        width: '100%',
                        backgroundColor: '#111111',
                        border: '1px solid #262626',
                        borderRadius: 8,
                        padding: '10px 14px',
                        color: '#f5f5f5',
                        fontSize: '0.875rem',
                        resize: 'vertical',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#2d6e45' : '#4ade80',
                      color: '#0a0a0a',
                      padding: '14px 32px',
                      borderRadius: 8,
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background 0.2s',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 style={{ fontSize: '1.2rem', marginBottom: 32 }}>Contact Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <ContactInfo icon="📞" label="Phone" lines={[
                  '+66 2645 4588',
                  'Sales: #143–144',
                  'Support: #220–223',
                  'Service: #261–263',
                ]} />
                <ContactInfo icon="✉️" label="Email" lines={['info@trinergy.co.th']} />
                <ContactInfo icon="💬" label="LINE" lines={['@trinergycomm']} />
                <ContactInfo icon="🌐" label="Website" lines={['www.trinergy.co.th']} />
              </div>

              {/* Values reminder */}
              <div style={{
                marginTop: 48,
                backgroundColor: '#111111',
                border: '1px solid #262626',
                borderRadius: 12,
                padding: 24,
              }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                  OUR COMMITMENT
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {['TRUST', 'TEAMWORK', 'TECHNOLOGY'].map(v => (
                    <span key={v} style={{
                      fontFamily: 'var(--font-heading)',
                      fontStyle: 'italic',
                      fontSize: '0.85rem',
                      color: '#4ade80',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}>
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.78rem',
        color: '#a3a3a3',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontFamily: 'var(--font-mono)',
      }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={{
          width: '100%',
          backgroundColor: '#111111',
          border: '1px solid #262626',
          borderRadius: 8,
          padding: '10px 14px',
          color: '#f5f5f5',
          fontSize: '0.875rem',
          outline: 'none',
        }}
      />
    </div>
  );
}

function ContactInfo({ icon, label, lines }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        backgroundColor: 'rgba(74,222,128,0.1)',
        border: '1px solid rgba(74,222,128,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          {label}
        </p>
        {lines.map((line, i) => (
          <p key={i} style={{ fontSize: '0.9rem', color: i === 0 ? '#f5f5f5' : '#a3a3a3', lineHeight: 1.7 }}>{line}</p>
        ))}
      </div>
    </div>
  );
}
