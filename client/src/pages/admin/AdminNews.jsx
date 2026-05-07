import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const NEWS_CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'event', label: 'Event' },
];

const CAT_COLORS = {
  news: '#4ade80',
  event: '#fb923c',
};

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  category: 'news',
  event_date: '',
};

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
      <label style={{
        display: 'block',
        fontSize: '0.72rem',
        color: '#a3a3a3',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontFamily: 'var(--font-mono)',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminNews() {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const fetchArticles = () => {
    axios.get('/api/news')
      .then(res => { setArticles(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
    setEditingArticle(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openEdit = (article) => {
    setEditingArticle(article);
    setForm({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'news',
      event_date: article.event_date || '',
    });
    setImagePreview(article.image_path ? `/uploads/${article.image_path}` : null);
    setImageFile(null);
    setError('');
    setSuccess('');
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('news-form-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('excerpt', form.excerpt);
      data.append('content', form.content);
      data.append('category', form.category);
      data.append('event_date', form.event_date);
      if (imageFile) data.append('image', imageFile);

      if (editingArticle) {
        await axios.put(`/api/news/${editingArticle.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess(`"${form.title}" updated successfully.`);
      } else {
        await axios.post('/api/news', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccess(`"${form.title}" added successfully.`);
      }

      fetchArticles();
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (!editingArticle) {
        setForm(EMPTY_FORM);
        setImagePreview(null);
        setShowForm(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      fetchArticles();
    } catch (err) {
      console.error(err);
    }
  };

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const formTitle = editingArticle ? `Edit: ${editingArticle.title}` : 'Add New Article';
  const formBorderColor = editingArticle ? '#a78bfa' : '#4ade80';

  return (
    <div>
      {/* Page header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <p style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#4ade80',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 8,
          }}>
            NEWS MANAGEMENT
          </p>
          <h2 style={{ fontSize: '1.8rem' }}>News &amp; Events</h2>
        </div>
        <button
          onClick={() => {
            if (showForm && !editingArticle) {
              resetForm();
              setShowForm(false);
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          style={{
            backgroundColor: showForm && !editingArticle ? 'transparent' : '#4ade80',
            color: showForm && !editingArticle ? '#a3a3a3' : '#0a0a0a',
            border: showForm && !editingArticle ? '1px solid #262626' : 'none',
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
          {showForm && !editingArticle ? 'Cancel' : '+ Add Article'}
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div
          id="news-form-anchor"
          style={{
            backgroundColor: '#111111',
            border: `1px solid ${formBorderColor}`,
            borderRadius: 12,
            padding: 28,
            marginBottom: 32,
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <h3 style={{ fontSize: '0.9rem', color: formBorderColor }}>{formTitle}</h3>
            {editingArticle && (
              <button
                onClick={() => { resetForm(); setShowForm(false); }}
                style={{ background: 'none', border: 'none', color: '#a3a3a3', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                ✕ Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Row 1: Title, Category, Event Date */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
              marginBottom: 20,
            }}>
              <FormField label="Title *">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  placeholder="Article title..."
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
                  {NEWS_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value} style={{ backgroundColor: '#111111' }}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Event / Article Date">
                <input
                  type="date"
                  name="event_date"
                  value={form.event_date}
                  onChange={handleFormChange}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </FormField>
            </div>

            {/* Excerpt */}
            <div style={{ marginBottom: 20 }}>
              <FormField label="Excerpt (short summary shown on cards)">
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Brief summary displayed on the news listing card..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </FormField>
            </div>

            {/* Full Content */}
            <div style={{ marginBottom: 20 }}>
              <FormField label="Full Content (full article body — each new line becomes a paragraph)">
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleFormChange}
                  rows={12}
                  placeholder="Write the full article content here. Each blank line creates a new paragraph when displayed..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 240, lineHeight: 1.6 }}
                />
              </FormField>
            </div>

            {/* Image upload */}
            <div style={{ marginBottom: 20 }}>
              <FormField label="Article Image">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ ...inputStyle, padding: '8px 12px' }}
                />
              </FormField>
              {imagePreview && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: 200,
                      height: 130,
                      objectFit: 'cover',
                      borderRadius: 8,
                      border: '1px solid #262626',
                    }}
                  />
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#737373', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                      {imageFile ? imageFile.name : 'Current image'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(editingArticle?.image_path ? `/uploads/${editingArticle.image_path}` : null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#f87171',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        padding: 0,
                      }}
                    >
                      {imageFile ? 'Remove new image' : ''}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div style={{
                marginBottom: 12,
                color: '#f87171',
                fontSize: '0.83rem',
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 8,
                padding: '10px 14px',
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                marginBottom: 12,
                color: '#4ade80',
                fontSize: '0.83rem',
                backgroundColor: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: 8,
                padding: '10px 14px',
              }}>
                {success}
              </div>
            )}

            <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={submitting}
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
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Saving...' : editingArticle ? 'Save Changes' : 'Add Article'}
              </button>
              <button
                type="button"
                onClick={() => { resetForm(); setShowForm(false); }}
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
          </form>
        </div>
      )}

      {/* Articles table */}
      <div style={{ backgroundColor: '#111111', border: '1px solid #262626', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h3 style={{
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#a3a3a3',
          }}>
            All Articles ({articles.length})
          </h3>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#a3a3a3' }}>Loading...</div>
        ) : articles.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#737373' }}>
            No articles yet. Add your first article above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                  {['#', 'Image', 'Title', 'Category', 'Date', 'Created', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#737373',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr
                    key={article.id}
                    style={{ borderBottom: '1px solid #141414', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#404040',
                    }}>
                      {article.id}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      {article.image_path ? (
                        <img
                          src={`/uploads/${article.image_path}`}
                          alt={article.title}
                          style={{
                            width: 56,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '1px solid #262626',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: 56,
                          height: 40,
                          backgroundColor: '#1a1a1a',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                        }}>
                          {article.category === 'event' ? '🎪' : '📰'}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px', maxWidth: 280 }}>
                      <div style={{
                        fontSize: '0.85rem',
                        color: '#f5f5f5',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 260,
                      }}>
                        {article.title}
                      </div>
                      {article.excerpt && (
                        <div style={{
                          fontSize: '0.72rem',
                          color: '#737373',
                          marginTop: 2,
                          maxWidth: 260,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {article.excerpt}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        color: CAT_COLORS[article.category] || '#a3a3a3',
                        border: `1px solid ${(CAT_COLORS[article.category] || '#a3a3a3')}40`,
                        borderRadius: 4,
                        padding: '3px 8px',
                        textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>
                        {article.category}
                      </span>
                    </td>

                    <td style={{
                      padding: '12px 16px',
                      fontSize: '0.78rem',
                      color: '#a3a3a3',
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'nowrap',
                    }}>
                      {formatDate(article.event_date)}
                    </td>

                    <td style={{
                      padding: '12px 16px',
                      fontSize: '0.75rem',
                      color: '#737373',
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'nowrap',
                    }}>
                      {article.created_at ? article.created_at.substring(0, 10) : '—'}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openEdit(article)}
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
                          onClick={() => setDeleteId(article.id)}
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
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
            <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Delete Article</h3>
            <p style={{ color: '#a3a3a3', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.7 }}>
              Are you sure you want to delete{' '}
              <strong style={{ color: '#f5f5f5' }}>
                "{articles.find(a => a.id === deleteId)?.title}"
              </strong>?
              This action cannot be undone.
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
