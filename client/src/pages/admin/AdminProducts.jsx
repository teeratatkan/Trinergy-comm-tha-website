import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { value: 'iot', label: 'IoT Lab Kits' },
  { value: 'ai', label: 'AI & Platforms' },
  { value: '5g', label: 'Private 5G' },
  { value: 'telecom', label: 'Telecom Tools' },
];

const CAT_COLORS = {
  iot: '#22d3ee',
  ai: '#a78bfa',
  '5g': '#4ade80',
  telecom: '#fb923c',
};

const EMPTY_FORM = {
  name: '',
  category: 'iot',
  short_description: '',
  description: '',
  tags: '',
  specs: '',
  theme: 'default',
  display_order: 0,
};

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [specsError, setSpecsError] = useState('');
  const fileInputRef = useRef(null);

  const fetchProducts = () => {
    axios.get('/api/products')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'specs') {
      if (value.trim() === '') {
        setSpecsError('');
      } else {
        try {
          JSON.parse(value);
          setSpecsError('');
        } catch {
          setSpecsError('Invalid JSON — check syntax');
        }
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setEditingProduct(null);
    setError('');
    setSuccess('');
    setSpecsError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      short_description: p.short_description || '',
      description: p.description || '',
      tags: p.tags || '',
      specs: p.specs || '',
      theme: p.theme || 'default',
      display_order: p.display_order || 0,
    });
    setImagePreview(p.image_path ? `/uploads/${p.image_path}` : null);
    setImageFile(null);
    setError('');
    setSuccess('');
    setSpecsError('');
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('product-form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (specsError) {
      setError('Fix the specs JSON error before saving.');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('category', form.category);
      data.append('short_description', form.short_description);
      data.append('description', form.description);
      data.append('tags', form.tags);
      data.append('specs', form.specs);
      data.append('theme', form.theme);
      data.append('display_order', form.display_order);
      if (imageFile) data.append('image', imageFile);

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess(`"${form.name}" updated successfully.`);
      } else {
        await axios.post('/api/products', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess(`"${form.name}" added successfully.`);
      }
      fetchProducts();
      // Keep form open with success message, but reset file input
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (!editingProduct) {
        // After add, reset form for new entry
        setForm(EMPTY_FORM);
        setImagePreview(null);
        setShowForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const formTitle = editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Product';
  const formBorderColor = editingProduct ? '#a78bfa' : '#4ade80';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            PRODUCT MANAGEMENT
          </p>
          <h2 style={{ fontSize: '1.8rem' }}>Products</h2>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          style={{
            backgroundColor: showForm && !editingProduct ? 'transparent' : '#4ade80',
            color: showForm && !editingProduct ? '#a3a3a3' : '#0a0a0a',
            border: showForm && !editingProduct ? '1px solid #262626' : 'none',
            padding: '10px 22px',
            borderRadius: 8,
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          {showForm && !editingProduct ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div
          id="product-form-anchor"
          style={{
            backgroundColor: '#111111',
            border: `1px solid ${formBorderColor}`,
            borderRadius: 12,
            padding: 28,
            marginBottom: 32,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: '0.9rem', color: formBorderColor }}>{formTitle}</h3>
            {editingProduct && (
              <button
                onClick={() => { resetForm(); setShowForm(false); }}
                style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                ✕ Cancel Edit
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            {/* Row 1: Name, Category, Display Order */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 20 }}>
              <FormField label="Product Name *">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g. SEED-IOT Kit"
                  style={inputStyle}
                />
              </FormField>
              <FormField label="Category *">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value} style={{ backgroundColor: '#111111' }}>{c.label}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Theme">
                <select
                  name="theme"
                  value={form.theme}
                  onChange={handleFormChange}
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value="default">Default</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="slate">Slate</option>
                </select>
              </FormField>
              <FormField label="Display Order">
                <input
                  type="number"
                  name="display_order"
                  value={form.display_order}
                  onChange={handleFormChange}
                  min="0"
                  style={inputStyle}
                />
              </FormField>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 20 }}>
              <FormField label="Tags (comma-separated)">
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleFormChange}
                  placeholder="Education, Beginner, ESP32"
                  style={inputStyle}
                />
              </FormField>
            </div>

            {/* Short Description */}
            <div style={{ marginBottom: 20 }}>
              <FormField label="Short Description (1-2 sentence teaser)">
                <input
                  name="short_description"
                  value={form.short_description}
                  onChange={handleFormChange}
                  placeholder="Brief teaser shown on product cards..."
                  style={inputStyle}
                />
              </FormField>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <FormField label="Full Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Full product description..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </FormField>
            </div>

            {/* Specs JSON */}
            <div style={{ marginBottom: 20 }}>
              <FormField label={`Specs (JSON key-value) ${specsError ? '— ' + specsError : ''}`}>
                <textarea
                  name="specs"
                  value={form.specs}
                  onChange={handleFormChange}
                  rows={6}
                  placeholder={'{\n  "MCU": "ESP32",\n  "Power Supply": "3.3V / 5V DC"\n}'}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontSize: '0.8rem',
                    borderColor: specsError ? '#f87171' : '#262626',
                  }}
                />
              </FormField>
              {specsError && (
                <p style={{ marginTop: 4, fontSize: '0.75rem', color: '#f87171' }}>{specsError}</p>
              )}
            </div>

            {/* Image upload */}
            <div style={{ marginBottom: 20 }}>
              <FormField label="Product Image">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ ...inputStyle, padding: '8px 12px' }}
                />
              </FormField>
              {imagePreview && (
                <div style={{ marginTop: 12 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #262626' }}
                  />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    style={{ marginLeft: 12, background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div style={{ marginTop: 4, marginBottom: 12, color: '#f87171', fontSize: '0.83rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px' }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ marginTop: 4, marginBottom: 12, color: '#4ade80', fontSize: '0.83rem', backgroundColor: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '10px 14px' }}>
                {success}
              </div>
            )}

            <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={submitting || !!specsError}
                style={{
                  backgroundColor: submitting ? '#2d6e45' : formBorderColor,
                  color: '#0a0a0a',
                  padding: '10px 24px',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontFamily: 'var(--font-heading)',
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: submitting || specsError ? 'not-allowed' : 'pointer',
                  opacity: specsError ? 0.5 : 1,
                }}
              >
                {submitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
                style={{ background: 'none', border: '1px solid #262626', borderRadius: 8, padding: '10px 20px', color: '#a3a3a3', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products table */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a3a3a3' }}>
            All Products ({products.length})
          </h3>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#a3a3a3' }}>Loading...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#737373' }}>No products yet. Add your first product above.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['#', 'Image', 'Name', 'Category', 'Tags', 'Theme', 'Specs', 'Created', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#737373', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #141414', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#404040' }}>{p.id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.image_path ? (
                        <img
                          src={`/uploads/${p.image_path}`}
                          alt={p.name}
                          style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, border: '1px solid #262626' }}
                        />
                      ) : (
                        <div style={{ width: 48, height: 36, backgroundColor: '#1a1a1a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                          {p.category === '5g' ? '📡' : p.category === 'iot' ? '🔌' : p.category === 'ai' ? '🤖' : '🔧'}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '0.85rem', color: '#f5f5f5', fontWeight: 500 }}>{p.name}</div>
                      {p.short_description && (
                        <div style={{ fontSize: '0.72rem', color: '#737373', marginTop: 2, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.short_description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        color: CAT_COLORS[p.category] || '#a3a3a3',
                        border: `1px solid ${(CAT_COLORS[p.category] || '#a3a3a3')}40`,
                        borderRadius: 4,
                        padding: '3px 8px',
                        textTransform: 'uppercase',
                      }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#737373', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.tags || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.78rem', color: '#9ca3af' }}>
                      {p.theme || 'default'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.specs ? (
                        <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 4, padding: '2px 6px' }}>
                          JSON ✓
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.68rem', color: '#404040' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#737373', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {p.created_at ? p.created_at.substring(0, 10) : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openEdit(p)}
                          style={{
                            background: 'rgba(167,139,250,0.1)',
                            border: '1px solid rgba(167,139,250,0.3)',
                            borderRadius: 6,
                            padding: '5px 12px',
                            color: '#a78bfa',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-mono)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 6,
                            padding: '5px 12px',
                            color: '#f87171',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: '#111111',
            border: '1px solid #262626',
            borderRadius: 14,
            padding: 36,
            maxWidth: 400,
            width: '90%',
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Delete Product</h3>
            <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.7 }}>
              Are you sure you want to delete <strong style={{ color: '#f5f5f5' }}>"{products.find(p => p.id === deleteId)?.name}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 24px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  background: 'none',
                  border: '1px solid #262626',
                  borderRadius: 8,
                  padding: '10px 20px',
                  color: '#a3a3a3',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  backgroundColor: '#0d0d0d',
  border: '1px solid #262626',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#f5f5f5',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
};

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', color: '#a3a3a3', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
